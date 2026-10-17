/* ============================================================
   使用登记（模块 D）—— 基本信息 + 使用前问卷
   ------------------------------------------------------------
   两步：
     第 1 步  基本信息（姓名 / 单位科室 / 身份）
     第 2 步  使用前问卷（复用 SURVEY 的 21 题）
   两步都完成后合成一份完整回执，可一键复制发给教学秘书。

   存储：localStorage（键 nec_roster_v1），不发起任何网络请求。
         数据只存在于填写者本人的浏览器里，服务端收不到，
         所以采用「回执制」——由填写者把回执复制后发出。

   入口：
     1) 首页「使用登记」按钮
     2) 点「开始训练」时软拦截（未登记 → 基本信息；已登记未答卷 → 问卷）
   ============================================================ */

(function () {
  const KEY = 'nec_roster_v1';
  const $ = (s) => document.querySelector(s);

  const ROLES = ['住院医师', '规培医师', '进修医师', '主治医师', '护士', '医学生', '其他'];
  const DEFAULT_ORG = '郑州大学第三附属医院 · 新生儿外科';

  /* ---------- 存储（file:// 下 localStorage 可能不可用，做降级） ---------- */
  const mem = {};
  function readRaw() {
    try {
      const v = localStorage.getItem(KEY);
      if (v) return JSON.parse(v);
    } catch (e) { /* ignore */ }
    return mem[KEY] || null;
  }
  function writeRaw(v) {
    mem[KEY] = v;
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* 降级为内存 */ }
  }

  function record() { return readRaw(); }
  function registered() { const r = readRaw(); return !!(r && r.name); }
  function preDone() { const r = readRaw(); return !!(r && r.preDone); }
  function postDone() { const r = readRaw(); return !!(r && r.postDone); }

  /* ---------- 统一参与者 ID 与训练/评价结果（C-08） ---------- */
  function sessionId() {
    try {
      if (window.NEC_UTIL && typeof window.NEC_UTIL.sessionId === 'function') return window.NEC_UTIL.sessionId();
    } catch (e) { /* ignore */ }
    return '';
  }

  /* 训练结果：FLOW.getResult() 有就追加，未完成/接口不可用则跳过 */
  function trainingLine(fallbackSid) {
    try {
      const fr = window.FLOW && typeof window.FLOW.getResult === 'function' ? window.FLOW.getResult() : null;
      if (!fr) return '';
      const score = Number(fr.total != null ? fr.total : fr.score);
      const max = Number(fr.max != null ? fr.max : (fr.maxScore != null ? fr.maxScore : 900));
      if (!isFinite(score) || !isFinite(max) || max <= 0) return '';
      const finished = fr.finished === true || fr.completed === true || score > 0 ||
        (Array.isArray(fr.steps) && fr.steps.some(s => s && s.done));
      if (!finished) return '';
      const pct = Number(fr.pct != null ? fr.pct : Math.round(score / max * 100));
      return '训练：得分 ' + score + '/' + max + '（' + pct + '%），sessionId: ' +
        (fr.sessionId || fallbackSid || sessionId() || '—');
    } catch (e) { return ''; }
  }

  /* 评价结果：EVAL.getResult() 有内容才追加 */
  function evalLine() {
    try {
      const er = window.EVAL && typeof window.EVAL.getResult === 'function' ? window.EVAL.getResult() : null;
      if (!er) return '';
      const sus = er.sus || {};
      const hasAny = (er.answers && Object.keys(er.answers).length > 0) || sus.done > 0 || er.overall != null;
      if (!hasAny) return '';
      const susTxt = (sus.done >= 10 && typeof sus.score === 'number')
        ? ('SUS ' + sus.score + ' / 100')
        : (sus.done ? ('SUS 已完成 ' + sus.done + '/10') : 'SUS 未填');
      const overallTxt = er.overall != null ? (er.overall + ' / 10') : '未填';
      return '评价：' + susTxt + '，总分 ' + overallTxt;
    } catch (e) { return ''; }
  }

  /* 弹层统一走 app.js 的 showMask/hideMask（兼容旧版，缺失时退回 class 切换） */
  function openMask(focusSel) {
    const m = $('#roster-mask');
    if (!m) return;
    if (typeof window.showMask === 'function') window.showMask(m, focusSel || '#btn-roster-close');
    else m.classList.add('active');
  }
  function closeMask() {
    const m = $('#roster-mask');
    if (!m) return;
    if (typeof window.hideMask === 'function') window.hideMask(m);
    else m.classList.remove('active');
  }

  /* ---------- 时间 ---------- */
  function stamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  /* ---------- 回执 ---------- */
  function shortTitle(t, n) {
    n = n || 18;
    const s = String(t || '');
    return s.length > n ? s.slice(0, n) + '…' : s;
  }

  function fmtAnswer(q, v) {
    if (v === undefined || v === null || v === '') return '（未答）';
    if (Array.isArray(v)) return v.length ? v.join('、') : '（未答）';
    if (q && q.type === 'scale5') return v + ' / 5';
    return String(v);
  }

  function surveyLines(answers) {
    const QS = (window.SURVEY && window.SURVEY.QUESTIONS) || [];
    if (!QS.length || !answers) return [];
    const out = [];
    QS.forEach((q, i) => {
      const v = answers[q.id];
      const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
      if (empty) return;                       // 只输出已作答的题
      const no = String(i + 1).padStart(2, '0');
      out.push(no + ' ' + String(q.title || '').trim() + '：' + fmtAnswer(q, v));
    });
    return out;
  }

  function receipt(v, answers) {
    const lines = [];
    lines.push('【NEC 决策舱 · 登记与问卷】');
    lines.push('姓名：' + v.name + '　｜　身份：' + v.role);
    lines.push('单位：' + v.org);
    lines.push('时间：' + v.time);
    const sl = surveyLines(answers);
    if (sl.length) {
      const QS = (window.SURVEY && window.SURVEY.QUESTIONS) || [];
      lines.push('');
      lines.push('■ 问卷（' + sl.length + ' / ' + QS.length + ' 题已答）');
      lines.push.apply(lines, sl);
    } else {
      lines.push('');
      lines.push('■ 问卷：未填写');
    }

    /* 训练得分与教学评价：有数据才追加，便于一份回执完成教学汇总（C-08） */
    const tl = trainingLine(v.sessionId);
    if (tl) { lines.push(''); lines.push('■ ' + tl); }
    const el = evalLine();
    if (el) lines.push('■ ' + el);

    return lines.join('\n');
  }

  /* ---------- 界面状态 ---------- */
  let pendingStart = false;   // 由「开始训练」触发的流程，完成后自动续训
  let surveyFromRoster = false; // 当前问卷是否由登记流程打开（防止首页问卷误写回执）

  function fillForm() {
    const r = readRaw() || {};
    const name = $('#rf-name'), org = $('#rf-org'), role = $('#rf-role');
    if (name) name.value = r.name || '';
    if (org) org.value = r.org || DEFAULT_ORG;
    if (role) role.value = r.role && ROLES.indexOf(r.role) >= 0 ? r.role : ROLES[0];
  }

  function setTitle(t) {
    const h = $('#roster-mask .modal-head h3');
    if (h) h.textContent = t;
  }

  function showForm() {
    const f = $('#roster-form'), done = $('#roster-done');
    const copy = $('#btn-roster-copy'), save = $('#btn-roster-save');
    const go = $('#btn-roster-go'), closeBtn = $('#btn-roster-close2');
    const tip = $('#roster-mask .roster-tip');
    if (tip) tip.hidden = false;
    if (f) f.hidden = false;
    if (done) done.hidden = true;
    if (copy) copy.hidden = true;
    if (go) go.hidden = true;
    if (closeBtn) closeBtn.hidden = false;
    if (save) { save.hidden = false; save.textContent = registered() ? '保存并继续' : '下一步 · 填问卷'; save.classList.remove('ghost'); }
    setTitle('先留个名字');
    const note = $('#roster-note');
    if (note) note.textContent = '带 * 为必填　·　下一步是使用前问卷';
  }

  function showReceipt(v, answers) {
    const f = $('#roster-form'), done = $('#roster-done');
    const copy = $('#btn-roster-copy'), save = $('#btn-roster-save');
    const go = $('#btn-roster-go'), closeBtn = $('#btn-roster-close2');
    const tip = $('#roster-mask .roster-tip');
    const pre = $('#roster-receipt');
    if (tip) tip.hidden = true;
    if (pre) pre.textContent = receipt(v, answers);
    if (f) f.hidden = true;
    if (done) done.hidden = false;
    if (copy) copy.hidden = false;
    if (save) { save.hidden = false; save.textContent = '修改信息'; save.classList.add('ghost'); }
    // 「开始训练」始终可见：无论从首页「使用登记」还是「开始训练」进来，填完都能直接接着练
    if (go) { go.hidden = false; go.classList.remove('ghost'); }
    if (closeBtn) closeBtn.hidden = true;
    setTitle('登记完成');
    const note = $('#roster-note');
    if (note) note.textContent = '已保存在本机';
  }

  function refreshHomeBadge() {
    const b = $('#btn-roster-open');
    if (!b) return;
    const r = readRaw();
    if (r && r.name && r.preDone) {
      b.textContent = '✓ 已登记 · ' + r.name;
      b.classList.add('roster-on');
    } else if (r && r.name) {
      b.textContent = '✎ 登记 · 还差问卷';
      b.classList.add('roster-on');
    } else {
      b.textContent = '✎ 使用登记';
      b.classList.remove('roster-on');
    }
  }

  /* ---------- 动作 ---------- */
  function open(gate) {
    pendingStart = !!gate;
    fillForm();
    const mask = $('#roster-mask');
    if (!mask) return;
    const r = readRaw();
    /* 已完成任一份问卷（前测或后测）就展示回执，而不是空白表单（C-05） */
    if (r && r.name && (r.preDone || r.surveyDone)) { showReceipt(r, r.survey || {}); openMask('#btn-roster-copy'); }
    else { showForm(); openMask('#rf-name'); }
  }

  function close() {
    closeMask();
    pendingStart = false;
  }

  /* 第 1 步提交 → 存基本信息 → 进第 2 步问卷 */
  function submit() {
    const nameEl = $('#rf-name'), orgEl = $('#rf-org'), roleEl = $('#rf-role');
    const name = (nameEl ? nameEl.value : '').trim();
    const org = (orgEl ? orgEl.value : '').trim() || DEFAULT_ORG;
    const role = roleEl ? roleEl.value : ROLES[0];

    if (!name) {
      if (nameEl) { nameEl.focus(); nameEl.classList.add('rf-err'); }
      const tip = $('#rf-name-tip'); if (tip) tip.hidden = false;
      if (typeof toast === 'function') toast('请先填写姓名');
      return;
    }
    if (nameEl) nameEl.classList.remove('rf-err');
    const tipEl = $('#rf-name-tip'); if (tipEl) tipEl.hidden = true;

    const old = readRaw() || {};
    /* 合并旧记录：保留 preDone/postDone/preTime/postTime/survey 等（C-05） */
    const v = Object.assign({}, old, {
      name: name,
      org: org,
      role: role,
      time: old.time || stamp(),
      updated: stamp(),
      sessionId: old.sessionId || sessionId(),
      ver: 3,
    });
    writeRaw(v);
    refreshHomeBadge();

    // 进第 2 步：只做前测（A 基本信息 + B 基线能力自评）
    closeMask();

    /* 已登记且前测已完成：不再重复发问卷，回执或直接续训（C-05） */
    if (preDone()) {
      if (pendingStart) {
        pendingStart = false;
        if (typeof toast === 'function') toast('登记完成，开始训练');
        if (window.FLOW && typeof window.FLOW.start === 'function') window.FLOW.start();
        return;
      }
      showReceipt(v, v.survey || {});
      openMask('#btn-roster-copy');
      if (typeof toast === 'function') toast('基本信息已更新');
      return;
    }

    if (window.SURVEY && typeof window.SURVEY.open === 'function') {
      beginSurveyFlow();
      window.SURVEY.open('roster', ['A', 'B']);
    }
  }

  /* 第 2 步完成（由 survey.js 回调）。secs 为本次所答分部 */
  function onSurveyDone(answers, secs) {
    endSurveyFlow();
    const r = readRaw() || {};
    const isPost = !!(secs && (secs.indexOf('C') >= 0 || secs.indexOf('D') >= 0 || secs.indexOf('E') >= 0));
    if (isPost) { r.postDone = true; r.postTime = stamp(); }
    else { r.preDone = true; r.preTime = stamp(); }
    r.surveyDone = true;                       // 回执分支重新可用（C-05）
    /* 合并而非覆盖：前测与后测分别提交时都不会冲掉另一份答案（C-06） */
    r.survey = Object.assign({}, r.survey || {}, answers || {});
    if (!r.sessionId) r.sessionId = sessionId();
    if (!r.time) r.time = stamp();
    writeRaw(r);
    refreshHomeBadge();

    /* 由「开始训练」软拦截进来时，完成后直接续训（C-05 的 pendingStart） */
    if (pendingStart) {
      pendingStart = false;
      closeMask();
      if (typeof toast === 'function') toast(isPost ? '使用后问卷已记录' : '登记完成，开始训练');
      if (window.FLOW && typeof window.FLOW.start === 'function') window.FLOW.start();
      return;
    }

    /* 只有已登记（有姓名）才弹登记回执；首页独立填问卷时只提示已记录，
       避免出现「姓名：undefined」的空回执 */
    if (r.name) {
      showReceipt(r, r.survey);
      openMask('#btn-roster-copy');
      if (typeof toast === 'function') toast(isPost ? '使用后问卷已记录' : '登记已完成');
    } else if (typeof toast === 'function') {
      toast('问卷已记录，感谢你的反馈');
    }
  }

  function beginSurveyFlow() { surveyFromRoster = true; }
  function endSurveyFlow() { surveyFromRoster = false; }
  function inSurveyFlow() {
    return !!(surveyFromRoster && window.SURVEY && document.querySelector('#screen-survey.active'));
  }

  function goTrain() {
    close();
    if (window.FLOW && typeof window.FLOW.start === 'function') window.FLOW.start();
  }

  function copy() {
    const r = readRaw();
    if (!r) return;
    const text = receipt(r, r.survey);

    const done = () => {
      const btn = $('#btn-roster-copy');
      if (btn) { const old = btn.textContent; btn.textContent = '✓ 已复制'; setTimeout(() => { btn.textContent = old; }, 1800); }
    };

    /* 优先复用 app.js 的统一复制工具（C-08） */
    if (window.NEC_UTIL && typeof window.NEC_UTIL.copyText === 'function') {
      Promise.resolve(window.NEC_UTIL.copyText(text))
        .then(ok => { if (ok) done(); else fallbackCopy(text, done); })
        .catch(() => fallbackCopy(text, done));
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- 绑定 ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    const openBtn = $('#btn-roster-open');
    if (openBtn) openBtn.addEventListener('click', () => open(false));

    const c1 = $('#btn-roster-close'), c2 = $('#btn-roster-close2');
    if (c1) c1.addEventListener('click', close);
    if (c2) c2.addEventListener('click', close);

    const save = $('#btn-roster-save');
    if (save) save.addEventListener('click', () => {
      const f = $('#roster-form');
      if (f && f.hidden) showForm();   // 回执态点「修改信息」→ 回表单
      else submit();
    });

    const cp = $('#btn-roster-copy');
    if (cp) cp.addEventListener('click', copy);

    const go = $('#btn-roster-go');
    if (go) go.addEventListener('click', goTrain);

    /* 结算页的「去填写」→ 打开后测（C/D/E） */
    const ps = $('#btn-post-survey');
    if (ps) ps.addEventListener('click', () => {
      if (window.SURVEY && typeof window.SURVEY.open === 'function') window.SURVEY.open('post', ['C', 'D', 'E']);
    });

    const mask = $('#roster-mask');
    if (mask) mask.addEventListener('click', (e) => { if (e.target === mask) close(); });

    /* 一输入就清掉红框与提示 */
    const nameInput = $('#rf-name');
    if (nameInput) nameInput.addEventListener('input', () => {
      nameInput.classList.remove('rf-err');
      const tip = $('#rf-name-tip'); if (tip) tip.hidden = true;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mask && mask.classList.contains('active')) close();
    });

    refreshHomeBadge();
  });

  /* 软拦截：点「开始训练」时检查登记与前测 */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('[data-open-flow]');
    if (!btn) return;
    if (registered() && preDone()) return;      // 都完成，直接放行
    e.preventDefault();
    e.stopPropagation();
    if (registered()) {
      // 只差前测 → 直接进问卷
      pendingStart = true;
      beginSurveyFlow();
      if (window.SURVEY && typeof window.SURVEY.open === 'function') window.SURVEY.open('roster', ['A', 'B']);
    } else {
      open(true);
    }
  }, true);

  window.ROSTER = {
    open, close, record, registered, preDone, postDone,
    onSurveyDone, inSurveyFlow, beginSurveyFlow, endSurveyFlow,
  };
})();
