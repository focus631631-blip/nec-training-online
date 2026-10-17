/* ============================================================
   教学评价表 —— 页面内填写即可，不做导出
   ------------------------------------------------------------
   设计依据与使用边界（国内外文献）：
     · 反应层与学习层框架：Kirkpatrick DL, Kirkpatrick JD.
       Evaluating Training Programs: The Four Levels. 3rd ed.
       San Francisco: Berrett-Koehler; 2006.
       （仅用于分层组织本表，不宣称已覆盖 Kirkpatrick 四层）
     · 模拟教学设计维度：Jeffries PR, Rizzolo MA. Designing and
       Implementing Models for the Innovative Use of Simulation to
       Teach Nursing Care of Ill Adults and Children. New York:
       National League for Nursing; 2006.
       中文版：朱芬芬, 吴丽荣, 张迪. 中文版 Jeffries 模拟教学设计
       量表的信度效度评价[J]. 中国护理管理, 2017, 17(12): 1620-1623.
       （本表每个维度只保留 1 题，属「单题自评（改编自该量表，
         未做信效度检验）」，不引用原量表 α）
     · 满意度与自信心：Jeffries & Rizzolo（2006）Student Satisfaction
       and Self-Confidence in Learning（满意度 5 题、自信心 8 题）。
       本表为单题自评（改编自该量表，未做信效度检验），不引用 α。
     · 认知负荷：Leppink J, Paas F, Van der Vleuten CPM, Van Gog T,
       Van Merriënboer JJG. Development of an instrument for measuring
       different types of cognitive load. Behav Res Methods.
       2013;45(4):1058-1072.
       （原文为 10 条目、三类负荷；本表只参考其内在/外在分类自编 3 题，
         探索性使用，不称量表、不引用 α）
     · 系统可用性：Brooke J. SUS: a "quick and dirty" usability scale.
       1996. 中文版：Wang Y, Lei T, Liu X. Chinese System Usability
       Scale: translation, revision, psychological measurement.
       Int J Hum-Comput Int. 2020;36(10):953-963.
       doi:10.1080/10447318.2019.1700644（中文版 Cronbach's α = 0.840，
       本表完整使用全部 10 条；计分：奇条目 得分 = 选项 − 1，
       偶条目 得分 = 5 − 选项，求和后 × 2.5 换算为 0—100 分，
       即百分制换算（0—100 分），不是统计学意义上的标准化；10 条全部作答才计分；
       >68 为高于文献平均，SUS 是相对度量，不作合格/优秀判定）

   说明：本表为教学自评工具，不是经信效度检验的正式量表。若用于科研发表，
        请以各原量表正式版本逐条校对措辞并重新做信效度检验。
   ============================================================ */

(function () {
  const $ = (s) => document.querySelector(s);

  const mem = {};
  const Store = {
    get(key, def) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : (key in mem ? mem[key] : def);
      } catch (e) { return (key in mem ? mem[key] : def); }
    },
    set(key, val) {
      mem[key] = val;
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 降级 */ }
    }
  };

  /* ---------- 一、分项评分（改编自中文版 Jeffries SDS 五维度 + 总体满意度，单题自评） ---------- */
  const DIMS = [
    { id: 'd_goal',    name: '目标与信息', dim: '单题自评 · 目标/信息', desc: '开始之前，我清楚这个环节要考我什么' },
    { id: 'd_support', name: '支持与提示', dim: '单题自评 · 支持',      desc: '卡住的时候，界面给了我足够的提示，但没有代替我思考' },
    { id: 'd_solve',   name: '问题解决',   dim: '单题自评 · 问题解决',  desc: '训练逼着我做判断，而不是照着流程点下去' },
    { id: 'd_feed',    name: '反馈质量',   dim: '单题自评 · 反馈',      desc: '提交之后，每条说明都讲清楚了对在哪、错在哪' },
    { id: 'd_fidelity',name: '逼真度',     dim: '单题自评 · 逼真度',    desc: '病例数据、影像与对话，像真实的 NICU 场景' },
    { id: 'd_satis',   name: '总体满意度', dim: '单题自评',             desc: '这种教学方式，我愿意再参加一次' }
  ];

  /* ---------- 二、自信心变化（改编自 NLN 自信心分量表，单题自评） ---------- */
  const CONFS = [
    { id: 'cf_sign',  name: '识别早期征象', desc: '再来一个血便的早产儿，我更有信心找出 NEC 的早期线索' },
    { id: 'cf_test',  name: '选择检查',     desc: '我知道下一步该开哪些检查，以及为什么要开' },
    { id: 'cf_treat', name: '启动处理',     desc: '对「禁食—减压—抗生素」的启动时机，我比之前更确定' }
  ];

  /* ---------- 三、自编认知负荷感知（3 题 · 探索性，参考 Leppink 内在/外在分类） ---------- */
  const LOADS = [
    { id: 'cl_intrinsic', name: '内容本身较复杂', kind: 'intrinsic',
      desc: '这个病例涉及的知识点很多，本身就有难度' },
    { id: 'cl_ext_ui',    name: '界面额外耗力', kind: 'extraneous', reverse: true,
      desc: '界面或文字排版让我多花了不必要的力气' },
    { id: 'cl_ext_text',  name: '反复回看才能记住', kind: 'extraneous', reverse: true,
      desc: '我需要反复回看前面的内容，才能跟得上' }
  ];

  /* ---------- 四、系统可用性（中文版 SUS，10 条） ---------- */
  const SUS = [
    { n: 1,  positive: true,  text: '我愿意经常使用这套训练工具' },
    { n: 2,  positive: false, text: '我觉得这套工具不必要地复杂' },
    { n: 3,  positive: true,  text: '我觉得这套工具容易使用' },
    { n: 4,  positive: false, text: '我认为需要技术人员帮忙，我才能用起来' },
    { n: 5,  positive: true,  text: '我觉得这套工具的各个部分配合得比较好' },
    { n: 6,  positive: false, text: '我觉得这套工具前后不太一致' },
    { n: 7,  positive: true,  text: '我想大多数人很快就能学会使用它' },
    { n: 8,  positive: false, text: '我觉得用起来很笨拙' },
    { n: 9,  positive: true,  text: '我对使用这套工具有信心' },
    { n: 10, positive: false, text: '使用之前，我需要先学很多东西' }
  ];

  /* ---------- 五、总体与建议 ---------- */
  const PICKS = [
    {
      id: 'p_value', title: '九个环节里，对你最有价值的是哪一个', required: true,
      options: [
        '临床症状', '查体', '辅助检查', '诊断', '外科会诊',
        '内科治疗', '病情转折', '手术决策', '术后管理'
      ]
    },
    {
      id: 'p_fail', title: '每一次「暂不处理」都会直接判失败，这种设计你觉得',
      options: ['很好，代价具体、记得住', '可以接受', '有点重，容易挫败', '不太必要']
    },
    {
      id: 'p_mode', title: '你更喜欢哪一种训练路径',
      options: ['当前这种九环节单科路径', '更短的精简版', '更长的高阶版']
    }
  ];

  const MULTS = [
    {
      id: 'm_improve', title: '最需要改进的地方', sub: '可多选',
      options: [
        '题目文字偏长，读起来累',
        '影像数量还不够',
        '选项之间的区别不够清楚',
        '希望有标准答案的逐条对照',
        '希望加计时或难度分级',
        '希望记录可以导出',
        '暂时没有明显需要改的地方'
      ]
    }
  ];

  const OPEN = [
    { id: 'o_gain',   title: '做完这一轮，你带走的最重要的一条是什么', placeholder: '一两句话即可' },
    { id: 'o_advice', title: '还有什么建议', placeholder: '想加什么病例、想改什么地方、哪里说得不对，都可以写' }
  ];

  const TOTAL_HARD = DIMS.length + CONFS.length + LOADS.length + SUS.length + PICKS.length;
  const KEY = 'nec_eval_v3';
  let form = Store.get(KEY, {});
  let from = 'home';
  let opened = false;          // 是否已进入过评价表（pagehide 兜底只在进入后生效）
  let saveTimer = null;

  function sid() {
    try {
      if (window.NEC_UTIL && typeof window.NEC_UTIL.sessionId === 'function') return window.NEC_UTIL.sessionId();
    } catch (e) { /* ignore */ }
    return '';
  }

  function saveNow() { Store.set(KEY, form); }

  /* 防抖 250ms 自动保存：没点提交就返回也不会丢（C-07） */
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; saveNow(); }, 250);
  }

  function flushSave() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (opened) saveNow();
  }

  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escA = (s) => esc(s).replace(/"/g, '&quot;');

  /* ============================================================
     渲染
     ============================================================ */
  function secHead(no, title, note) {
    return `<div class="ev-sec"><div class="ev-sec-head"><span class="ev-sec-no">${no}</span>${title}
      ${note ? `<span class="ev-sec-note">${note}</span>` : ''}</div></div>`;
  }

  function render() {
    const box = $('#eval-body');
    if (!box) return;
    box.innerHTML = '';

    /* 一、分项评分 */
    const a = document.createElement('div');
    a.className = 'ev-sec';
    a.innerHTML = `
      <div class="ev-sec-head"><span class="ev-sec-no">一</span>分项评分
        <span class="ev-sec-note">1 分很低，5 分很好</span></div>
      <div class="ev-sec-src">文献依据：维度与措辞改编自中文版 Jeffries 模拟教学设计量表（SDS）与 NLN 满意度条目；本表每个维度只保留 1 题，属单题自评，未做信效度检验，不引用原量表的 α</div>`;
    DIMS.forEach(d => a.appendChild(ratingRow(d, 'ev-dot')));
    box.appendChild(a);

    /* 二、自信心 */
    const b = document.createElement('div');
    b.className = 'ev-sec';
    b.innerHTML = `
      <div class="ev-sec-head"><span class="ev-sec-no">二</span>自信心变化
        <span class="ev-sec-note">和参加之前比，1 分没变化，5 分明显提升</span></div>
      <div class="ev-sec-src">文献依据：条目改编自 NLN Student Satisfaction and Self-Confidence in Learning（Jeffries &amp; Rizzolo, 2006）的自信心分量表；本表为单题自评，未做信效度检验</div>`;
    CONFS.forEach(c => a2(b, c));
    box.appendChild(b);

    /* 三、认知负荷 */
    const c = document.createElement('div');
    c.className = 'ev-sec';
    c.innerHTML = `
      <div class="ev-sec-head"><span class="ev-sec-no">三</span>自编认知负荷感知 3 题（探索性，参考 Leppink 分类）
        <span class="ev-sec-note">1 完全不同意，5 完全同意</span></div>
      <div class="ev-sec-src">本部分为自编认知负荷感知 3 题（探索性，参考 Leppink 等 2013 的内在/外在负荷分类）；未使用原量表，未做信效度检验，只作教学反馈</div>`;
    LOADS.forEach(l => {
      const row = ratingRow({ id: l.id, name: l.name, dim: l.kind === 'intrinsic' ? '内在负荷' : '外在负荷', desc: l.desc + (l.note ? `（${l.note}）` : '') }, 'ev-dot');
      if (l.reverse) row.classList.add('ev-rev');
      c.appendChild(row);
    });
    box.appendChild(c);

    /* 四、SUS */
    const d = document.createElement('div');
    d.className = 'ev-sec';
    d.innerHTML = `
      <div class="ev-sec-head"><span class="ev-sec-no">四</span>系统可用性
        <span class="ev-sec-note">1 非常不同意，5 非常同意</span></div>
      <div class="ev-sec-src">文献依据：中文版系统可用性量表（SUS），Wang Y, Lei T, Liu X. Int J Hum-Comput Int. 2020;36(10):953-963（α = 0.840，本表完整使用 10 条）。得分 = 各条目计分之和 × 2.5 的百分制换算（0—100 分），10 条全部作答才计分</div>
      <div class="ev-sus-score" id="ev-sus-out">—</div>`;
    SUS.forEach(s => {
      const row = document.createElement('div');
      row.className = 'ev-quick' + (s.positive ? '' : ' ev-rev');
      row.dataset.dim = 'sus_' + s.n;
      row.innerHTML = `
        <div class="ev-quick-k" title="${escA(s.text)}">${s.n}. ${esc(s.text)}
          <span class="ev-tag">${s.positive ? '正' : '反'}</span></div>
        <div class="ev-quick-r">
          ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="ev-qdot" data-k="sus_${s.n}" data-v="${v}">${v}</button>`).join('')}
        </div>`;
      d.appendChild(row);
    });
    box.appendChild(d);

    /* 五、总体与建议 */
    const e = document.createElement('div');
    e.className = 'ev-sec';
    e.innerHTML = `<div class="ev-sec-head"><span class="ev-sec-no">五</span>总体与建议</div>`;
    const ovr = document.createElement('div');
    ovr.className = 'ev-overall';
    ovr.innerHTML = `
      <div class="ev-overall-k">给这套训练工具打一个总分（1—10 分）</div>
      <div class="ev-overall-dots">
        ${Array.from({ length: 10 }, (_, i) => `<button type="button" class="ev-odot" data-k="overall" data-v="${i + 1}">${i + 1}</button>`).join('')}
      </div>
      <div class="ev-overall-out" id="ev-overall-out">尚未评分</div>`;
    e.appendChild(ovr);

    PICKS.forEach(p => {
      const wrap = document.createElement('div');
      wrap.className = 'ev-q';
      wrap.dataset.qid = p.id;
      wrap.innerHTML = `
        <div class="ev-q-t">${esc(p.title)}${p.required ? '<span class="sv-req">必填</span>' : ''}</div>
        <div class="ev-q-opts">
          ${p.options.map(o => `<button type="button" class="ev-opt" data-k="${p.id}" data-v="${escA(o)}">${esc(o)}</button>`).join('')}
        </div>`;
      e.appendChild(wrap);
    });
    MULTS.forEach(m => {
      const wrap = document.createElement('div');
      wrap.className = 'ev-q';
      wrap.dataset.qid = m.id;
      wrap.innerHTML = `
        <div class="ev-q-t">${esc(m.title)}${m.sub ? `<span class="ev-q-sub">${esc(m.sub)}</span>` : ''}</div>
        <div class="ev-q-opts">
          ${m.options.map(o => `<button type="button" class="ev-opt ev-multi" data-k="${m.id}" data-v="${escA(o)}">${esc(o)}</button>`).join('')}
        </div>`;
      e.appendChild(wrap);
    });
    OPEN.forEach(o => {
      const wrap = document.createElement('div');
      wrap.className = 'ev-q';
      wrap.innerHTML = `
        <div class="ev-q-t">${esc(o.title)}</div>
        <textarea class="ev-input" data-k="${o.id}" rows="3" placeholder="${escA(o.placeholder)}">${esc(form[o.id] || '')}</textarea>`;
      e.appendChild(wrap);
    });
    box.appendChild(e);

    bind();
    DIMS.concat(CONFS, LOADS).forEach(x => paintDot(x.id));
    SUS.forEach(s => paintQuick('sus_' + s.n));
    PICKS.concat(MULTS).forEach(q => paintOpts(q.id));
    paintOverall();
    updateSus();     // 回访时恢复 SUS 分数/完成度（C-15）
    updateFoot();
  }

  function ratingRow(d, cls) {
    const row = document.createElement('div');
    row.className = 'ev-row';
    row.dataset.dim = d.id;
    row.innerHTML = `
      <div class="ev-row-l">
        <div class="ev-row-name">${esc(d.name)}<span class="ev-tag">${esc(d.dim)}</span></div>
        <div class="ev-row-desc">${esc(d.desc)}</div>
      </div>
      <div class="ev-row-r">
        ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="${cls}" data-k="${d.id}" data-v="${n}">${n}</button>`).join('')}
      </div>`;
    return row;
  }

  function a2(box, c) {
    box.appendChild(ratingRow({ id: c.id, name: c.name, dim: '单题自评', desc: c.desc }, 'ev-dot'));
  }

  function bind() {
    const box = $('#eval-body');
    box.querySelectorAll('.ev-dot').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = Number(b.dataset.v);
      form[k] = (form[k] === v) ? undefined : v;
      paintDot(k); persist();
    }));
    box.querySelectorAll('.ev-qdot').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = Number(b.dataset.v);
      form[k] = (form[k] === v) ? undefined : v;
      paintQuick(k);
      updateSus();
      persist();
    }));
    box.querySelectorAll('.ev-odot').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = Number(b.dataset.v);
      form[k] = (form[k] === v) ? undefined : v;
      paintOverall(); persist();
    }));
    box.querySelectorAll('.ev-opt').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k, v = b.dataset.v;
      if (b.classList.contains('ev-multi')) {
        const cur = Array.isArray(form[k]) ? form[k].slice() : [];
        const i = cur.indexOf(v);
        if (i >= 0) cur.splice(i, 1); else cur.push(v);
        form[k] = cur;
      } else {
        form[k] = (form[k] === v) ? undefined : v;
      }
      paintOpts(k); persist();
    }));
    box.querySelectorAll('.ev-input').forEach(t => t.addEventListener('input', () => {
      form[t.dataset.k] = t.value;
      updateFoot(); persist();
    }));
  }

  function paintDot(k) {
    const row = document.querySelector(`.ev-row[data-dim="${k}"]`);
    if (!row) return;
    row.querySelectorAll('.ev-dot').forEach(b => b.classList.toggle('on', Number(b.dataset.v) === form[k]));
    updateFoot();
  }
  function paintQuick(k) {
    const row = document.querySelector(`.ev-quick[data-dim="${k}"]`);
    if (!row) return;
    row.querySelectorAll('.ev-qdot').forEach(b => b.classList.toggle('on', Number(b.dataset.v) === form[k]));
    updateFoot();
  }
  function paintOverall() {
    document.querySelectorAll('.ev-odot').forEach(b => b.classList.toggle('on', Number(b.dataset.v) === form.overall));
    const out = $('#ev-overall-out');
    if (out) out.textContent = form.overall ? `${form.overall} / 10 分` : '尚未评分';
    updateFoot();
  }
  function paintOpts(k) {
    const wrap = document.querySelector(`.ev-q[data-qid="${k}"]`);
    if (!wrap) return;
    const val = form[k];
    wrap.querySelectorAll('.ev-opt').forEach(b => {
      const on = Array.isArray(val) ? val.includes(b.dataset.v) : val === b.dataset.v;
      b.classList.toggle('on', on);
    });
    updateFoot();
  }

  /* ---------- SUS 计分：10 条全部作答才计分（D03 / C-15） ---------- */
  function susScore() {
    let sum = 0, done = 0;
    SUS.forEach(s => {
      const v = form['sus_' + s.n];
      if (typeof v !== 'number') return;
      sum += s.positive ? (v - 1) : (5 - v);
      done++;
    });
    /* 未答满 10 条时 score 为 null：不折算、不给等级，避免无意义的外推 */
    return { score: done === SUS.length ? Math.round(sum * 2.5) : null, done };
  }

  /* 统一阈值口径：68 为文献平均，SUS 是相对度量，不作合格/优秀判定 */
  function susVerdict(score) {
    if (score > 68) return '高于文献平均（68）';
    if (score === 68) return '等于文献平均（68）';
    return '低于文献平均（68）';
  }

  function updateSus() {
    const out = $('#ev-sus-out');
    if (!out) return;
    const { score, done } = susScore();
    if (done < SUS.length) {
      out.innerHTML = `<b>—</b><span>/ 100</span><em>已完成 ${done}/${SUS.length} 条，答满 10 条才计分</em>`;
      out.className = 'ev-sus-score' + (done ? ' on' : '');
      return;
    }
    out.innerHTML = `<b>${score}</b><span>/ 100</span><em>${susVerdict(score)}</em>`;
    out.className = 'ev-sus-score on';
  }

  function doneCount() {
    let n = 0;
    DIMS.concat(CONFS, LOADS).forEach(x => { if (typeof form[x.id] === 'number') n++; });
    SUS.forEach(s => { if (typeof form['sus_' + s.n] === 'number') n++; });
    n += PICKS.filter(p => form[p.id]).length;
    return n;
  }

  function dimAvg() {
    const vals = DIMS.map(d => form[d.id]).filter(v => typeof v === 'number');
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
  }

  /* 提交门槛：分项 6 项 + SUS 10 条 + p_value（D10 / C-15） */
  function missingRequired() {
    let miss = 0;
    DIMS.forEach(d => { if (typeof form[d.id] !== 'number') miss++; });
    miss += SUS.filter(s => typeof form['sus_' + s.n] !== 'number').length;
    if (!form.p_value) miss++;
    return miss;
  }

  function updateFoot() {
    const n = doneCount();
    const bar = $('#ev-progress-fill');
    if (bar) bar.style.width = Math.round(n / TOTAL_HARD * 100) + '%';
    const txt = $('#ev-progress-txt');
    if (txt) txt.textContent = `${n} / ${TOTAL_HARD}`;
    const avg = $('#ev-avg');
    if (avg) avg.textContent = dimAvg();
    const btn = $('#eval-submit');
    if (btn) {
      const miss = missingRequired();
      btn.disabled = miss > 0;
      btn.textContent = miss ? `还有 ${miss} 项未完成` : '提交评价表';
    }
  }

  function savedHtml() {
    const { score, done } = susScore();
    const susTxt = done === SUS.length
      ? ` · SUS ${score} 分（${susVerdict(score)}）`
      : (done ? ` · SUS 已完成 ${done}/${SUS.length} 条` : '');
    return `
      <div class="sv-saved-in">
        <div class="sv-saved-ico">✓</div>
        <div>
          <div class="sv-saved-t">评价表已记录在本机</div>
          <div class="sv-saved-s">分项均分 ${dimAvg()}${form.overall ? ` · 总分 ${form.overall} / 10` : ''}${susTxt}。内容不会自动上传，可随时回来修改，或用「复制评价结果」自行汇总。</div>
        </div>
      </div>`;
  }

  function submit() {
    const miss = missingRequired();
    if (miss > 0) {
      if (typeof toast === 'function') toast(`还有 ${miss} 项未完成：分项 6 项、SUS 10 条、最有价值环节`);
      return;
    }
    form._ts = new Date().toISOString();
    form._from = from;
    form._ver = 3;
    form._sessionId = sid();
    form._sus = susScore();
    saveNow();
    const box = $('#ev-saved');
    if (box) { box.innerHTML = savedHtml(); box.classList.add('on'); }
    if (typeof toast === 'function') toast('评价表已记录，谢谢');
  }

  function reset() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    form = {};
    saveNow();
    const box = $('#ev-saved');
    if (box) { box.classList.remove('on'); box.innerHTML = ''; }
    render();
    const s = $('#eval-scroll'); if (s) s.scrollTop = 0;
  }

  function open(fromPage) {
    flushSave();                 // 重新进入前先把上一轮作答落盘（C-07）
    from = fromPage || 'home';
    opened = true;
    form = Store.get(KEY, {});
    render();
    const box = $('#ev-saved');
    if (box) {
      if (doneCount() > 0) { box.innerHTML = savedHtml(); box.classList.add('on'); }
      else { box.classList.remove('on'); box.innerHTML = ''; }
    }
    if (typeof showScreen === 'function') showScreen('screen-eval');
    const s = $('#eval-scroll'); if (s) s.scrollTop = 0;
  }

  function back() {
    flushSave();
    if (typeof showScreen === 'function') showScreen(from === 'flow' ? 'screen-flow-summary' : 'screen-start');
  }

  /* ---------- 数据回收：统一结果对象（C-08） ---------- */
  function getResult() {
    const { score, done } = susScore();
    const answers = {};
    Object.keys(form).forEach(k => { if (k.charAt(0) !== '_') answers[k] = form[k]; });
    return {
      type: 'eval',
      sessionId: sid(),
      ts: form._ts || new Date().toISOString(),
      sus: { score: done === SUS.length ? score : null, done },
      overall: form.overall || null,
      answers
    };
  }

  function copyResult() {
    const text = JSON.stringify(getResult(), null, 2);
    const btn = $('#btn-eval-copy');
    const flash = () => {
      if (!btn) return;
      const old = btn.textContent;
      btn.textContent = '✓ 已复制';
      setTimeout(() => { btn.textContent = old; }, 1800);
    };
    const fail = () => { if (typeof toast === 'function') toast('复制受限，已弹出结果文本，请手动复制'); };

    if (window.NEC_UTIL && typeof window.NEC_UTIL.copyText === 'function') {
      Promise.resolve(window.NEC_UTIL.copyText(text))
        .then(ok => { if (ok) flash(); else fail(); })
        .catch(fail);
      return;
    }
    /* 兜底：NEC_UTIL 不可用时退回 execCommand */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) flash(); else fail();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-open-eval]').forEach(b =>
      b.addEventListener('click', () => open(b.dataset.openEval)));

    const s = $('#eval-submit'), r = $('#eval-reset');
    const b1 = $('#eval-back'), b2 = $('#eval-back2');
    const c = $('#btn-eval-copy');
    if (s) s.addEventListener('click', submit);
    if (r) r.addEventListener('click', reset);
    if (b1) b1.addEventListener('click', back);
    if (b2) b2.addEventListener('click', back);
    if (c) c.addEventListener('click', copyResult);
  });

  window.EVAL = { open, reset, DIMS, SUS, susScore, getResult, copyResult };
})();
