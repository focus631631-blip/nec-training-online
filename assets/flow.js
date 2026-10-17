/* ============================================================
   新生儿血便全程病例 —— 九环节临床决策训练（流程引擎）
   ------------------------------------------------------------
   依赖（在 app.js 之后加载）：
     showScreen / toast / playStory / closeStory / playTransition
     openImage / popImage / IMAGING / confetti
   依赖数据：window.FLOW_CASE（flow_case.js）

   规则：
     · 每个环节列出若干可选动作，学员勾选后提交
     · 关键动作（must）按完成率折算到 100 分；漏一项按比例扣分
     · 加分动作（good）最多补 5 分作为缓冲；错误动作（bad）每个扣 10 分
     · 「暂不处理」（danger）一旦确认，本环节直接判定失败
     · 进入环节时先全屏弹出该环节的关键影像；提交含影像的动作时，
       也是先逐张把大图弹出来，再出文字讲解
   ============================================================ */

(function () {
  const FC = window.FLOW_CASE;
  if (!FC) { console.warn('FLOW_CASE 未加载'); return; }

  const $  = (s) => document.querySelector(s);
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  /* 评分常量：每环节 100 分制，九环节合计 900 */
  const STEP_MAX   = 100;
  const GOOD_BONUS = 5;    // 加分动作全选最多补 5 分
  const D_BAD      = 10;   // 每个错误动作扣 10 分

  const st = {
    step: 0,
    picked: new Set(),
    submitted: false,
    scores: [],      // 每环节 { score, mustMiss, badPick, goodPick, done }
    dimension: {},   // 维度累计
    attempts: {},    // 每环节重试次数
    startedAt: 0,
    running: false,
    finished: false
  };

  /* ============================================================
     会话存档：刷新/关闭后可回到当前环节
     ============================================================ */
  const SAVE_KEY = 'nec_flow_session_v3';
  const SAVE_TTL = 24 * 3600 * 1000;

  function saveSession() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        v: 3, ts: Date.now(), step: st.step,
        scores: st.scores, dimension: st.dimension,
        attempts: st.attempts, startedAt: st.startedAt
      }));
    } catch (e) { /* 存储不可用时静默降级 */ }
  }
  function loadSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (s && s.v === 3 && Date.now() - s.ts < SAVE_TTL) return s;
    } catch (e) { /* ignore */ }
    return null;
  }
  function clearSession() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  }

  /* 训练完成后把结果单独留档：刷新/填问卷后回执仍能带上得分 */
  const RESULT_KEY = 'nec_flow_result_v3';
  function saveResult(obj) {
    try { localStorage.setItem(RESULT_KEY, JSON.stringify(obj)); } catch (e) { /* ignore */ }
  }
  function loadResult() {
    try {
      const r = JSON.parse(localStorage.getItem(RESULT_KEY) || 'null');
      if (r && r.ts && Date.now() - new Date(r.ts).getTime() < 24 * 3600 * 1000) return r;
    } catch (e) { /* ignore */ }
    return null;
  }
  function clearResult() {
    try { localStorage.removeItem(RESULT_KEY); } catch (e) { /* ignore */ }
  }

  /* ============================================================
     工具
     ============================================================ */
  function scoreOfStep(step, picked) {
    const must = step.actions.filter(a => a.kind === 'must');
    const good = step.actions.filter(a => a.kind === 'good');
    const mustMiss = must.filter(a => !picked.has(a.id));
    const goodPick = good.filter(a => picked.has(a.id));
    const badPick  = step.actions.filter(a => a.kind === 'bad' && picked.has(a.id));

    const mustRate = must.length ? (must.length - mustMiss.length) / must.length : 1;
    const goodRate = good.length ? goodPick.length / good.length : 0;
    let s = mustRate * STEP_MAX + goodRate * GOOD_BONUS - badPick.length * D_BAD;
    s = Math.round(Math.max(0, Math.min(STEP_MAX, s)));
    return { score: s, mustMiss, goodPick, badPick, must, good };
  }

  function gradeOf(pct) {
    return pct >= 90 ? '优秀' : pct >= 75 ? '良好' : pct >= 60 ? '合格' : '需要重练';
  }

  /* 运行代次与推进锁：防止双击开始/重打/完成导致并发流程 */
  let runId = 0;
  let advancing = false;

  function dimOfStep(step) {
    return (FC.dimensions || []).find(d => d.key === step.dim) || null;
  }

  function flowPush(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    const node = el.firstElementChild;
    $('#flow-stream').appendChild(node);
    const s = $('#flow-stream');
    requestAnimationFrame(() => { s.scrollTop = s.scrollHeight; });
    return node;
  }

  /* 播放剧情并在结束后收起遮罩（否则剧情层会一直盖在训练界面上） */
  async function story(lines) {
    if (!lines || !lines.length || typeof playStory !== 'function') return;
    await playStory(lines);
    if (typeof closeStory === 'function') closeStory();
  }

  /* 弹出大图；popImage 不可用时静默跳过。
     弹层出问题也不能阻断训练流程，所以整段包在 try 里。 */
  async function showVisual(spec, stepLabel) {
    if (!spec || typeof popImage !== 'function') return;
    try {
      await popImage(spec, { step: stepLabel, note: spec.note });
    } catch (e) {
      if (typeof closePop === 'function') closePop();
    }
  }

  /* ============================================================
     顶部进度
     ============================================================ */
  function renderTrack() {
    const box = $('#flow-track');
    if (!box) return;
    box.innerHTML = '';
    FC.steps.forEach((s, i) => {
      const d = document.createElement('div');
      const done = i < st.step;
      const cur = i === st.step;
      d.className = 'stage-dot' + (done ? ' done' : '') + (cur ? ' current' : '');
      d.innerHTML = `<span class="idx">${s.index}</span><span>${s.name}</span>`;
      box.appendChild(d);
    });
    const sc = $('#flow-score');
    if (sc) {
      const total = st.scores.reduce((a, b) => a + (b ? b.score : 0), 0);
      sc.textContent = total;
    }
  }

  /* ============================================================
     左栏：患儿状态
     ============================================================ */
  const VITAL_DEFS = [
    { key: 'hr',   label: '心率',   unit: '次/分', bad: v => v > 180, warn: v => v > 165 },
    { key: 'rr',   label: '呼吸',   unit: '次/分', bad: v => v > 70,  warn: v => v > 62 },
    { key: 'bp',   label: '血压',   unit: 'mmHg',  raw: true },
    { key: 'temp', label: '体温',   unit: '℃',     bad: v => v >= 38, warn: v => v >= 37.5 },
    { key: 'spo2', label: '血氧',   unit: '%',     bad: v => v < 90,  warn: v => v < 94 },
    { key: 'abd',  label: '腹围',   unit: 'cm',    bad: v => v >= 36, warn: v => v >= 33 }
  ];
  const LAB_DEFS = [
    { key: 'crp', label: 'C 反应蛋白', unit: 'mg/L' },
    { key: 'plt', label: '血小板',     unit: '×10⁹/L' },
    { key: 'lac', label: '乳酸',       unit: 'mmol/L' },
    { key: 'be',  label: '碱剩余',     unit: 'mmol/L' },
    { key: 'na',  label: '血钠',       unit: 'mmol/L' },
    { key: 'k',   label: '血钾',       unit: 'mmol/L' },
    { key: 'cl',  label: '血氯',       unit: 'mmol/L' }
  ];

  function renderPatient(step) {
    const p = step.patient;
    const vg = $('#flow-vitals');
    if (vg) {
      vg.innerHTML = '';
      VITAL_DEFS.forEach(d => {
        const raw = p.vitals[d.key];
        if (raw === undefined || raw === null) return;
        const num = parseFloat(raw);
        let cls = '';
        if (!d.raw && !isNaN(num)) {
          if (d.bad && d.bad(num)) cls = ' bad';
          else if (d.warn && d.warn(num)) cls = ' warn';
        }
        const div = document.createElement('div');
        div.className = 'vit' + cls;
        div.innerHTML = `<div class="vit-k">${d.label}</div>
          <div class="vit-v">${raw}<span class="vit-u">${d.unit}</span></div>`;
        vg.appendChild(div);
      });
    }
    const lb = $('#flow-labs');
    if (lb) {
      lb.innerHTML = '';
      LAB_DEFS.forEach(d => {
        const v = p.labs[d.key];
        if (v === undefined) return;
        const div = document.createElement('div');
        div.className = 'lab';
        div.innerHTML = `<span class="lab-k">${d.label}</span>
          <span class="lab-v">${v}<span class="lab-u">${d.unit}</span></span>`;
        lb.appendChild(div);
      });
      if (p.note) {
        const n = document.createElement('div');
        n.className = 'lab-note';
        n.textContent = p.note;
        lb.appendChild(n);
      }
    }
    const fl = $('#flow-flags');
    if (fl) {
      fl.innerHTML = '';
      (p.flags || []).forEach(f => {
        const s = document.createElement('span');
        s.className = 'flag';
        s.textContent = f;
        fl.appendChild(s);
      });
    }
  }

  /* ============================================================
     右栏：动作面板
     ============================================================ */
  function renderActions(step) {
    const box = $('#flow-actions');
    if (!box) return;
    box.innerHTML = '';

    const groups = {};
    step.actions.filter(a => a.kind !== 'danger').forEach(a => {
      (groups[a.group] = groups[a.group] || []).push(a);
    });

    Object.keys(groups).forEach(g => {
      const lab = document.createElement('div');
      lab.className = 'act-group';
      lab.textContent = g;
      box.appendChild(lab);

      groups[g].forEach(a => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flow-act';
        btn.dataset.id = a.id;
        btn.setAttribute('aria-pressed', 'false');
        btn.innerHTML = `<span class="fa-box"></span><span class="fa-txt">${a.label}</span>`;
        btn.addEventListener('click', () => {
          if (st.submitted) return;
          if (st.picked.has(a.id)) st.picked.delete(a.id);
          else st.picked.add(a.id);
          const on = st.picked.has(a.id);
          btn.classList.toggle('on', on);
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          updateSubmit();
        });
        box.appendChild(btn);
      });
    });

    // 危险动作：单独放在底部，视觉上区隔开
    const dangers = step.actions.filter(a => a.kind === 'danger');
    if (dangers.length) {
      const dz = document.createElement('div');
      dz.className = 'flow-danger-zone';
      dz.innerHTML = '<div class="fd-label">或者</div>';
      dangers.forEach(a => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'flow-danger';
        btn.innerHTML = `<span class="fd-ico">!</span>${a.label}`;
        btn.addEventListener('click', () => confirmDanger(a));
        dz.appendChild(btn);
      });
      box.appendChild(dz);
    }

    updateSubmit();
  }

  function updateSubmit() {
    const btn = $('#btn-flow-submit');
    const hint = $('#flow-hint');
    if (!btn) return;
    const n = st.picked.size;
    btn.disabled = st.submitted || n === 0;
    btn.textContent = st.submitted ? '本环节已提交' : `提交本环节（已选 ${n} 项）`;
    if (hint && !st.submitted) {
      hint.textContent = n === 0 ? '勾选你认为必须完成的动作' : '可以多选，想清楚再提交';
    }
  }

  /* ============================================================
     危险动作：确认 → 本环节失败
     ============================================================ */
  function confirmDanger(action) {
    if (st.submitted) return;
    const box = $('#flow-actions');
    const old = box.querySelector('.flow-confirm');
    if (old) old.remove();
    const bar = document.createElement('div');
    bar.className = 'flow-confirm';
    bar.innerHTML = `
      <div class="fc-txt">确认选择「${action.label}」？本环节将直接判定失败。</div>
      <div class="fc-btns">
        <button class="btn small danger" id="fc-yes">确认，不处理</button>
        <button class="btn small ghost" id="fc-no">返回重选</button>
      </div>`;
    box.appendChild(bar);
    const s = box; requestAnimationFrame(() => { s.scrollTop = s.scrollHeight; });
    const close = () => bar.remove();
    $('#fc-no').addEventListener('click', close);
    $('#fc-yes').addEventListener('click', () => { close(); triggerFail(action); });
  }

  /* ============================================================
     提交评分
     ============================================================ */
  async function submit() {
    if (st.submitted) return;
    const step = FC.steps[st.step];
    const r = scoreOfStep(step, st.picked);
    st.submitted = true;
    st.scores[st.step] = r;

    const dim = dimOfStep(step);
    if (dim) st.dimension[dim.key] = { name: dim.name, score: r.score };

    renderTrack();
    updateSubmit();
    saveSession();

    /* ① 先把影像一张张弹出来 —— 让学生先看，再读 */
    const imgActions = step.actions.filter(a => st.picked.has(a.id) && a.imaging);
    try {
      for (const a of imgActions) {
        await showVisual({ ...a.imaging, note: a.label }, `环节 ${step.index} · ${step.name}`);
      }
    } catch (e) { /* 弹层异常不影响后续评分与反馈 */ }

    /* ② 再出文字结果 */
    const badPick = r.badPick.length;
    const okAll = r.mustMiss.length === 0 && badPick === 0;
    flowPush(`<div class="evt ${okAll ? 'good' : (badPick ? 'bad' : 'neutral')} flow-result">
      <div class="evt-head"><span class="evt-tag">本环节评估</span>
        <span class="evt-title">得分 ${r.score} / ${STEP_MAX}</span></div>
      <div class="evt-body">
        关键动作 ${r.must.length - r.mustMiss.length} / ${r.must.length} 完成${
          r.goodPick.length ? `，另有 ${r.goodPick.length} 项加分动作` : ''}${
          badPick ? `，${badPick} 项处理不恰当` : ''}。
      </div>
    </div>`);

    /* 逐条反馈（关键动作的说明就是知识点） */
    step.actions.forEach(a => {
      if (!st.picked.has(a.id)) return;
      if (a.kind === 'danger') return;
      const tone = a.kind === 'bad' ? 'bad' : (a.kind === 'must' ? 'good' : 'neutral');
      const verdict = a.kind === 'must' ? '<span class="verdict">关键动作 · 已落实</span>'
                    : a.kind === 'bad'  ? '<span class="verdict">这一处理需要重新考虑</span>'
                    : '<span class="verdict">加分动作</span>';
      const node = flowPush(`<div class="evt ${tone}">
        <div class="evt-head"><span class="evt-tag">${a.group}</span>
          <span class="evt-title">${a.label}</span></div>
        <div class="evt-body">${a.feedback}</div>
        ${verdict}
      </div>`);
      // 检查类动作：影像同时留在病程记录里，供随时回看
      if (a.imaging) attachImaging(node, a.imaging);
    });

    /* 遗漏的关键动作 */
    if (r.mustMiss.length) {
      flowPush(`<div class="evt bad flow-miss">
        <div class="evt-head"><span class="evt-tag">被遗漏</span>
          <span class="evt-title">还有 ${r.mustMiss.length} 项关键动作没有做</span></div>
        <div class="evt-body">${r.mustMiss.map(a => `· ${a.label}`).join('<br>')}</div>
      </div>`);
    }

    // 解锁推进
    const btn = $('#btn-flow-submit');
    btn.disabled = true;
    btn.textContent = '本环节已提交';
    const next = $('#btn-flow-next');
    next.disabled = false;
    next.textContent = (st.step === FC.steps.length - 1) ? '完成训练，查看结果' : '进入下一环节';
    const hint = $('#flow-hint');
    if (hint) hint.textContent = '中栏标出了每一条判断的依据，可点击影像放大';
  }

  function attachImaging(node, spec) {
    const render = window.IMAGING[spec.type];
    if (typeof render !== 'function') return;
    const wrap = document.createElement('div');
    wrap.className = 'evt-imaging';
    const html = render.call(window.IMAGING, spec.kind);
    wrap.innerHTML = `
      <div class="evt-img-frame">${html}</div>
      <div class="evt-img-bar">
        <span class="evt-img-hint">以上为本次检查所见的真实影像，点击可放大</span>
        <button class="img-btn" type="button"><span class="img-ico">▣</span> 放大查看</button>
      </div>`;
    wrap.querySelectorAll('.evt-img-frame video').forEach(v =>
      v.addEventListener('click', e => e.stopPropagation()));
    wrap.addEventListener('click', () => window.openImage(spec));
    node.appendChild(wrap);
    const s = $('#flow-stream');
    requestAnimationFrame(() => { s.scrollTop = s.scrollHeight; });
  }

  /* ============================================================
     环节失败
     ============================================================ */
  function triggerFail(action) {
    const step = FC.steps[st.step];
    st.submitted = true;
    st.scores[st.step] = { score: 0, mustMiss: [], goodPick: [], badPick: [], must: [], failed: true };
    const dim = dimOfStep(step);
    if (dim) st.dimension[dim.key] = { name: dim.name, score: 0 };
    saveSession();

    $('#fail-title').textContent = step.fail.title;
    $('#fail-step').textContent = `环节 ${step.index} · ${step.name}`;
    $('#fail-lesson').textContent = step.fail.lesson;
    showScreen('screen-flow-fail');

    story(step.fail.script);
  }

  function retryStep() {
    st.attempts[st.step] = (st.attempts[st.step] || 0) + 1;
    st.submitted = false;
    st.picked = new Set();
    delete st.scores[st.step];
    const dim = dimOfStep(FC.steps[st.step]);
    if (dim) delete st.dimension[dim.key];
    saveSession();
    showScreen('screen-flow');
    enterStep(false);
  }

  /* ============================================================
     结算
     ============================================================ */
  function showSummary() {
    const total = st.scores.reduce((a, b) => a + (b ? b.score : 0), 0);
    const max = FC.steps.length * STEP_MAX;
    const pct = Math.round(total / max * 100);
    st.finished = true;
    st.running = false;
    advancing = false;
    saveResult(getResult());
    clearSession();
    $('#flow-sum-score').textContent = total;
    $('#flow-sum-max').textContent = max;
    $('#flow-sum-pct').textContent = pct + '%';
    $('#flow-sum-grade').textContent = gradeOf(pct);

    // 九个环节
    const list = $('#flow-sum-list');
    list.innerHTML = '';
    FC.steps.forEach((s, i) => {
      const r = st.scores[i] || { score: 0 };
      const row = document.createElement('div');
      row.className = 'fs-row' + (r.failed ? ' failed' : '');
      const w = Math.max(4, Math.round(r.score / STEP_MAX * 100));
      row.innerHTML = `
        <div class="fs-name"><b>${s.index}</b>${s.name}</div>
        <div class="fs-bar"><i style="width:${w}%"></i></div>
        <div class="fs-score">${r.failed ? '<em>失败</em>' : r.score}<span>/100</span></div>`;
      list.appendChild(row);
    });

    // 九个能力维度
    const dims = $('#flow-sum-dims');
    if (dims) {
      dims.innerHTML = '';
      (FC.dimensions || []).forEach(d => {
        const rec = st.dimension[d.key];
        const sc = rec ? rec.score : 0;
        const row = document.createElement('div');
        row.className = 'fs-row';
        row.innerHTML = `
          <div class="fs-name">${d.name}</div>
          <div class="fs-bar"><i style="width:${Math.max(3, sc)}%"></i></div>
          <div class="fs-score">${sc}<span>/100</span></div>`;
        dims.appendChild(row);
      });
    }

    // 训练要点
    const ins = $('#flow-sum-insight');
    if (ins) ins.textContent = (FC.ending && FC.ending.insight) || '';

    showScreen('screen-flow-summary');
    if (pct >= 75 && typeof confetti === 'function') confetti();

    /* 训练结束后提示「使用后问卷」（C/D/E），已填过就不再提示 */
    const pt = $('#flow-sum-posttip');
    if (pt) {
      const done = !!(window.ROSTER && typeof window.ROSTER.postDone === 'function' && window.ROSTER.postDone());
      pt.hidden = done;
    }
  }

  /* ============================================================
     进入环节
     ============================================================ */
  async function enterStep(withTransition = true) {
    const myRun = runId;
    const step = FC.steps[st.step];
    st.picked = new Set();
    st.submitted = false;

    $('#flow-stream').innerHTML = '';
    renderTrack();
    renderPatient(step);
    renderActions(step);

    const next = $('#btn-flow-next');
    next.disabled = true;
    next.textContent = '进入下一环节';
    const hint = $('#flow-hint');
    if (hint) hint.textContent = '勾选你认为必须完成的动作';

    if (withTransition) await playTransition({ index: step.index, name: step.name });
    if (myRun !== runId) return;

    const label = `环节 ${step.index} · ${step.name}`;
    $('#flow-step-name').textContent = label;
    $('#flow-step-time').textContent = step.time;

    // 先看病人，再看文字
    await showVisual(step.visual, label);
    if (myRun !== runId) return;

    flowPush(`<div class="scene-card">
      <div class="label">环节 ${step.index} · ${step.name}</div>
      <div class="text">${step.lead}</div>
      <div class="task"><b>你的任务　</b>${step.task}</div>
    </div>`);

    if (step.narrative && step.narrative.length) {
      await story(step.narrative);
      if (myRun !== runId) return;
    }
    if (step.hint) {
      flowPush(`<div class="evt neutral flow-tip">
        <div class="evt-head"><span class="evt-tag">思路提示</span></div>
        <div class="evt-body">${step.hint}</div>
      </div>`);
    }
    saveSession();
  }

  function nextStep() {
    if (advancing || !st.submitted || st.finished) return;
    advancing = true;
    const btn = $('#btn-flow-next');
    if (btn) btn.disabled = true;

    if (st.step >= FC.steps.length - 1) {
      (async () => {
        if (FC.ending && FC.ending.lines) await story(FC.ending.lines);
        advancing = false;
        showSummary();
      })();
      return;
    }
    st.step += 1;
    saveSession();
    enterStep(true).finally(() => { advancing = false; });
  }

  function restart() {
    start({ fresh: true });
  }

  /* ============================================================
     启动 / 续训 / 退出
     ============================================================ */
  async function start(opts = {}) {
    if (st.running) return;

    // 有未完成存档时先问：继续还是重开
    if (!opts.fresh) {
      const saved = loadSession();
      if (saved && saved.step > 0 && saved.step < FC.steps.length) {
        const yes = window.confirm(`发现上次未完成的训练（进行到第 ${saved.step + 1} 环节），是否继续？\n点「取消」将重新开始。`);
        if (yes) { await resume(saved); return; }
      }
    }

    st.running = true;
    runId++;
    const myRun = runId;
    clearResult();
    st.step = 0;
    st.picked = new Set();
    st.submitted = false;
    st.scores = [];
    st.dimension = {};
    st.attempts = {};
    st.startedAt = Date.now();
    st.finished = false;
    clearSession();
    showScreen('screen-flow');

    // 开场：先看孩子的录像，再听病史
    if (FC.openingVisual) await showVisual(FC.openingVisual, '开场');
    if (myRun !== runId) return;

    await story(FC.opening);
    if (myRun !== runId) return;

    await enterStep(false);
    st.running = false;
  }

  async function resume(saved) {
    st.running = true;
    runId++;
    const myRun = runId;
    st.step = Math.min(saved.step || 0, FC.steps.length - 1);
    st.scores = saved.scores || [];
    st.dimension = saved.dimension || {};
    st.attempts = saved.attempts || {};
    st.startedAt = saved.startedAt || Date.now();
    st.picked = new Set();
    st.submitted = false;
    st.finished = false;
    showScreen('screen-flow');
    if (myRun !== runId) return;
    await enterStep(false);
    st.running = false;
    toast('已回到上次训练进度');
  }

  function confirmQuit() {
    const inFlow = $('#screen-flow').classList.contains('active')
      || $('#screen-flow-fail').classList.contains('active');
    if (!inFlow) return true;
    return window.confirm('训练进度会保留在本机，下次可从当前环节继续。确定退出训练？');
  }

  function quitToHome() {
    if (!confirmQuit()) return;
    saveSession();
    runId++;
    st.running = false;
    advancing = false;
    if (typeof closePop === 'function') closePop();
    if (typeof closeStory === 'function') closeStory();
    showScreen('screen-start');
  }

  /* ============================================================
     结果导出
     ============================================================ */
  function getResult() {
    const cached = loadResult();
    if (cached && (!st.scores || st.scores.length === 0)) return cached;
    const total = st.scores.reduce((a, b) => a + (b ? b.score : 0), 0);
    const max = FC.steps.length * STEP_MAX;
    const pct = Math.round(total / max * 100);
    const caseNo = ($('#flow-case-no') && $('#flow-case-no').textContent.trim()) || 'NEC-2026-002';
    return {
      type: 'flow', v: 3, finished: !!st.finished,
      sessionId: (window.NEC_UTIL && window.NEC_UTIL.sessionId()) || '',
      ts: new Date().toISOString(),
      caseNo, total, max, pct, grade: gradeOf(pct),
      durationSec: st.startedAt ? Math.round((Date.now() - st.startedAt) / 1000) : null,
      steps: FC.steps.map((s, i) => {
        const r = st.scores[i] || {};
        return {
          index: s.index, name: s.name,
          score: typeof r.score === 'number' ? r.score : 0,
          max: STEP_MAX,
          failed: !!r.failed,
          attempts: st.attempts[i] || 0
        };
      }),
      dimensions: (FC.dimensions || []).map(d => ({
        key: d.key, name: d.name,
        score: st.dimension[d.key] ? st.dimension[d.key].score : 0
      }))
    };
  }

  function resultText(r) {
    const lines = [];
    lines.push('【NEC 决策舱 · 训练结果】');
    lines.push('参与者 ID：' + r.sessionId);
    lines.push('时间：' + new Date(r.ts).toLocaleString('zh-CN'));
    lines.push(`病例：${r.caseNo}　得分：${r.total} / ${r.max}（${r.pct}% · ${r.grade}）`);
    if (r.durationSec != null) lines.push('用时：' + Math.round(r.durationSec / 60) + ' 分钟');
    lines.push('');
    lines.push('■ 各环节');
    r.steps.forEach(s => lines.push(`${s.index} ${s.name}：${s.failed ? '失败' : s.score + ' / 100'}${s.attempts ? '（重试 ' + s.attempts + ' 次）' : ''}`));
    lines.push('');
    lines.push('■ 能力维度');
    r.dimensions.forEach(d => lines.push(`${d.name}：${d.score} / 100`));
    return lines.join('\n');
  }

  async function copyResult() {
    const r = getResult();
    const text = resultText(r);
    let ok = false;
    if (window.NEC_UTIL && window.NEC_UTIL.copyText) {
      ok = await window.NEC_UTIL.copyText(text);
    } else {
      try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { ok = false; }
    }
    toast(ok ? '训练结果已复制，可粘贴给教学秘书' : '复制受限，已弹出结果文本，请手动复制');
  }

  /* ---------- 事件绑定 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const bs = $('#btn-flow-submit'); if (bs) bs.addEventListener('click', submit);
    const bn = $('#btn-flow-next');   if (bn) bn.addEventListener('click', nextStep);
    const br = $('#btn-flow-retry');  if (br) br.addEventListener('click', retryStep);
    const bh = $('#btn-flow-home');   if (bh) bh.addEventListener('click', quitToHome);
    const bq = $('#btn-flow-quit');   if (bq) bq.addEventListener('click', quitToHome);
    const brt = $('#btn-flow-restart'); if (brt) brt.addEventListener('click', restart);
    const bb = $('#btn-flow-back');   if (bb) bb.addEventListener('click', () => showScreen('screen-start'));
    const bc = $('#btn-flow-copy');   if (bc) bc.addEventListener('click', copyResult);

    /* 首页与结算页的入口 */
    document.querySelectorAll('[data-open-flow]').forEach(b =>
      b.addEventListener('click', () => start()));
  });

  window.addEventListener('beforeunload', (e) => {
    const inFlow = $('#screen-flow').classList.contains('active')
      || $('#screen-flow-fail').classList.contains('active');
    if (inFlow && !st.finished) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  window.FLOW = { start, resume, showSummary, restart, quitToHome, getResult, copyResult, clearResult };
})();
