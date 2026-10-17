/* ============================================================
   NEC 虚拟病例决策舱 —— 共享交互库
   ------------------------------------------------------------
   本文件只保留各模块共用的部分：
     · 页面切换、提示、视觉反馈
     · AVG 剧情播放系统（背景场景 + 立绘 + 逐字对话）
     · 影像查看器 / 大图弹层 / 影像资料库 / 病理演变演示
     · 病例系统回顾
   病例逻辑在 flow.js，问卷在 survey.js，教学评价表在 evalform.js。
   ============================================================ */

const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

/* ============================================================
   通用工具
   ============================================================ */
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const el = $('#' + id);
  if (el) el.classList.add('active');
}

function screenFlash(type) {
  const el = document.createElement('div');
  el.className = 'screen-flash ' + type;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 780);
}

function confetti() {
  const colors = ['#22D3EE', '#F59E0B', '#10B981', '#8B5CF6', '#3B82F6'];
  for (let i = 0; i < 46; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (30 + Math.random() * 40) + '%';
    el.style.background = colors[i % colors.length];
    el.style.animationDelay = (Math.random() * 0.5).toFixed(2) + 's';
    el.style.animationDuration = (1.5 + Math.random() * 1.1).toFixed(2) + 's';
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}

/* ============================================================
   共享数据工具：参与者 ID / 复制文本
   ------------------------------------------------------------
   三个模块（登记、训练、评价）共用同一个 sessionId，
   回执里凭它把「谁 / 得分 / 问卷 / 评价」对上号。
   ============================================================ */
function showCopyFallback(text) {
  try {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(4,9,17,.92);display:flex;align-items:center;justify-content:center;padding:20px;';
    const box = document.createElement('div');
    box.style.cssText = 'background:#111E33;border:1px solid #22354F;border-radius:12px;padding:16px;width:min(720px,94vw);max-height:86vh;display:flex;flex-direction:column;gap:10px;';
    const h = document.createElement('div');
    h.textContent = '自动复制受限，请手动复制下面的文本';
    h.style.cssText = 'color:#E6EDF7;font-weight:700;font-size:15px;';
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.readOnly = true;
    ta.style.cssText = 'width:100%;height:320px;max-height:60vh;background:#0B1424;color:#E6EDF7;border:1px solid #22354F;border-radius:8px;padding:10px;font:12px/1.6 ui-monospace,Menlo,Consolas,monospace;resize:vertical;';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn small';
    btn.textContent = '已选中，按 Ctrl/⌘+C 复制后关闭';
    btn.addEventListener('click', () => wrap.remove());
    box.appendChild(h); box.appendChild(ta); box.appendChild(btn);
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    setTimeout(() => { try { ta.focus(); ta.select(); } catch (e) { /* ignore */ } }, 50);
  } catch (e) { /* ignore */ }
}

const NEC_UTIL = (() => {
  const SID_KEY = 'nec_session_id';
  function sessionId() {
    try {
      let v = localStorage.getItem(SID_KEY);
      if (!v) {
        v = (crypto && crypto.randomUUID) ? crypto.randomUUID()
          : 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(SID_KEY, v);
      }
      return v;
    } catch (e) {
      return window.__nec_sid || (window.__nec_sid = 'm' + Date.now().toString(36));
    }
  }
  function copyText(text) {
    return new Promise(resolve => {
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        if (!ok) showCopyFallback(text);
        resolve(!!ok);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => resolve(true)).catch(fallback);
        return;
      }
      fallback();
    });
  }
  return { sessionId, copyText };
})();
window.NEC_UTIL = NEC_UTIL;

/* ============================================================
   模态层可访问性：aria-hidden / 焦点进入 / Tab 陷阱 / 焦点回归
   ============================================================ */
const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
let activeMask = null;
let lastFocus = null;

function showMask(mask, focusSel) {
  if (!mask) return;
  if (activeMask && activeMask !== mask) hideMask(activeMask, true);
  lastFocus = document.activeElement;
  activeMask = mask;
  mask.classList.add('active');
  mask.setAttribute('aria-hidden', 'false');
  document.body.classList.add('mask-open');
  const target = focusSel ? mask.querySelector(focusSel) : mask.querySelector(FOCUSABLE);
  setTimeout(() => { try { (target || mask).focus(); } catch (e) { /* ignore */ } }, 40);
}

function hideMask(mask, keepFocus) {
  if (!mask) return;
  mask.classList.remove('active');
  mask.setAttribute('aria-hidden', 'true');
  if (activeMask === mask) activeMask = null;
  if (!activeMask) {
    document.body.classList.remove('mask-open');
    if (!keepFocus && lastFocus && lastFocus.focus) {
      try { lastFocus.focus(); } catch (e) { /* ignore */ }
    }
    lastFocus = null;
  }
}

function closeReviewMask() { hideMask($('#review-mask')); }

/* ============================================================
   AVG 剧情播放系统
   ============================================================ */
let dlgTyping = null;   // 打字进行中：点击加速
let dlgAdvance = null;  // 等待继续：点击推进
let dlgResolve = null;  // 当前对话的 resolve，供「跳过」时提前兑现
let storyAbort = false; // 「跳过剧情」标志：playStory 的循环见到即收尾

const SCENE_MAP = { nicu: 'sceneNICU', or: 'sceneOR' };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function rpgSetScene(key) {
  const fn = SCENE_MAP[key];
  if (!fn || !window.ART) return;
  const el = $('#rpg-scene');
  if (el.dataset.key === key) return;
  el.dataset.key = key;
  el.style.transition = 'opacity .32s ease';
  el.style.opacity = '0';
  setTimeout(() => { el.innerHTML = ART[fn](); el.style.opacity = '1'; }, 300);
}

function closeStory() {
  storyAbort = true;
  hideMask($('#story-mask'), true);
  $('#rpg-mood-box').classList.remove('show');
  setSpeaker('none');
}

function skipStory() {
  dlgTyping = null;
  dlgAdvance = null;
  // 兑现当前这一句，让 playStory 的 for-await 能继续走完并返回，
  // 否则调用方 await playStory(...) 会永远挂住（训练的进场就靠它）
  const r = dlgResolve;
  dlgResolve = null;
  if (r) r();
  closeStory();
}

async function playStory(lines) {
  storyAbort = false;
  showMask($('#story-mask'), '#rpg-dialog');
  for (const line of lines) {
    if (storyAbort) break;
    if (line.scene) { rpgSetScene(line.scene); await sleep(330); }
    if (storyAbort) break;
    await rpgSay(line.speaker, line.side || 'none', line.portrait, line.text, line.tone);
  }
}

function playTransition(stage) {
  return new Promise(resolve => {
    const mask = $('#transit-mask');
    $('#transit-num').textContent = String(stage.index).padStart(2, '0');
    $('#transit-name').textContent = stage.name;
    mask.classList.add('active');
    setTimeout(() => { mask.classList.remove('active'); resolve(); }, 1600);
  });
}

function setSpeaker(who) {
  const L = $('#rpg-p-left'), R = $('#rpg-p-right');
  if (!L || !R) return;
  L.classList.toggle('active', who === 'left');
  R.classList.toggle('active', who === 'right');
  L.classList.toggle('dim', who !== 'left');
  R.classList.toggle('dim', who !== 'right');
}

function rpgSay(speaker, side, portraitKey, text, tone) {
  return new Promise(resolve => {
    if (!window.ART) { resolve(); return; }
    if (side === 'left' && portraitKey) {
      const el = $('#rpg-p-left');
      if (el.dataset.key !== portraitKey) { el.innerHTML = ART[portraitKey](); el.dataset.key = portraitKey; }
    }
    if (side === 'right' && portraitKey) {
      const el = $('#rpg-p-right');
      if (el.dataset.key !== portraitKey) { el.innerHTML = ART[portraitKey](); el.dataset.key = portraitKey; }
    }
    setSpeaker(side);

    const nameEl = $('#rpg-name');
    nameEl.textContent = speaker;
    nameEl.className = 'rpg-name' + (tone ? ' tone-' + tone : '');
    $('#rpg-next').classList.remove('show');

    const el = $('#rpg-text');
    el.textContent = '';
    el.classList.remove('done');
    let i = 0, done = false;
    const timer = setInterval(() => {
      if (done) return;
      if (i >= text.length) { finish(); return; }
      el.textContent = text.slice(0, ++i);
    }, 28);

    function finish() {
      if (done) return;
      done = true;
      clearInterval(timer);
      el.textContent = text;
      el.classList.add('done');
      $('#rpg-next').classList.add('show');
      dlgTyping = null;
    }
    dlgTyping = finish;

    dlgAdvance = () => {
      $('#rpg-next').classList.remove('show');
      dlgAdvance = null;
      dlgResolve = null;
      resolve();
    };
    dlgResolve = resolve;
  });
}

function talkAdvance() {
  if (dlgTyping) { dlgTyping(); return; }
  if (dlgAdvance) { dlgAdvance(); }
}

/* ============================================================
   影像查看器（点开放大）
   ============================================================ */
let currentImageSpec = null;

function renderImage() {
  const body = $('#image-body');
  if (!currentImageSpec) { body.innerHTML = ''; return; }
  const render = window.IMAGING[currentImageSpec.type];
  if (typeof render === 'function') {
    body.innerHTML = render.call(window.IMAGING, currentImageSpec.kind);
  } else {
    body.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-3);">影像数据缺失</div>';
  }
}

function openImage(spec) {
  currentImageSpec = spec;
  $('#image-title').textContent = spec.title || '影像查看';
  renderImage();
  showMask($('#image-mask'), '#btn-image-close');
}
function closeImage() { hideMask($('#image-mask')); }

/* ============================================================
   大图弹层 ——「图片先蹦出来」
   ------------------------------------------------------------
   popImage(spec, { step, note })  返回 Promise，点击「继续」后兑现。
   用于：进入环节时先展示该环节的关键影像；提交影像类动作时先出图再出文字。
   ============================================================ */
let popResolve = null;
let popTimer = null;
let popSeq = 0;

function popImage(spec, opts = {}) {
  return new Promise(resolve => {
    const IM = window.IMAGING;
    const render = IM && IM[spec.type];
    if (typeof render !== 'function') { resolve(); return; }

    // 每次弹出递增序号：旧的关闭定时器/旧 Promise 不能影响新弹层
    const mySeq = ++popSeq;
    if (popTimer) { clearTimeout(popTimer); popTimer = null; }
    // 上一张还没关就再弹一张时，先把上一张兑现（不隐藏新弹层）
    if (popResolve) { const r = popResolve; popResolve = null; r(); }

    const mask  = $('#pop-mask');
    const media = $('#pop-media');
    $('#pop-step').textContent  = opts.step || '';
    $('#pop-title').textContent = spec.title || '';
    $('#pop-note').textContent  = opts.note || '';
    media.innerHTML = render.call(IM, spec.kind);

    const v = media.querySelector('video');
    if (v) {
      if (spec.start) {
        v.addEventListener('loadedmetadata', () => {
          try { v.currentTime = spec.start; } catch (e) { /* 忽略 */ }
        }, { once: true });
      }
      v.muted = true;              // 音轨已剥离，这里再强制一次
      const p = v.play && v.play();
      if (p && p.catch) p.catch(() => {});
    }

    mask.classList.remove('active', 'in');
    mask.setAttribute('aria-hidden', 'false');
    void mask.offsetWidth;         // 强制重排，保证每次弹出动画都从头播
    showMask(mask, '#btn-pop-ok');
    requestAnimationFrame(() => mask.classList.add('in'));
    if (typeof screenFlash === 'function') screenFlash('pop');

    popResolve = () => {
      if (mySeq !== popSeq) { resolve(); return; }   // 已被更新的弹层取代，只兑现旧 Promise
      popResolve = null;
      mask.classList.remove('in');
      popTimer = setTimeout(() => {
        if (mySeq === popSeq) hideMask(mask, true);
        popTimer = null;
      }, 200);
      resolve();
    };
  });
}

function closePop() { if (popResolve) { const r = popResolve; popResolve = null; r(); } }

/* ============================================================
   影像资料库
   ============================================================ */
/* 与 assets/real/ 下 10 份素材 + 1 段视频严格一一对应，名称不串 */
const GALLERY_REAL = [
  { name: '临床征象 · 血便',       key: 'stool' },
  { name: '腹部平片 · 早期（肠管扩张）', key: 'xr_early' },
  { name: '腹部平片 · 肠壁积气',   key: 'xr_pneu' },
  { name: '腹部平片 · 门静脉积气', key: 'xr_pv' },
  { name: '腹部平片 · 气腹',       key: 'xr_pp' },
  { name: '腹部超声 · 正常肠管',   key: 'us_normal' },
  { name: '腹部彩超 · 肠壁积气',   key: 'us_pneu' },
  { name: '腹部彩超 · 门静脉积气', key: 'us_pv' },
  { name: '胸部正位片 · 呼吸窘迫', key: 'xr_rds' },
  { name: '术中大体 · 坏死肠管',   key: 'gross' },
  { name: '临床视频 · 呼吸窘迫（已静音）', video: true },
];

function renderGallery() {
  const grid = $('#gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';
  let n = 0;

  GALLERY_REAL.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gal-card';
    let spec;
    if (item.video) {
      spec = { type: 'rdsVideo', title: item.name };
      card.innerHTML = `<div class="gal-thumb">${IMAGING.rdsVideo()}</div>
        <div class="gal-name">${item.name}</div>`;
    } else {
      spec = { type: 'asset', kind: item.key, title: item.name };
      card.innerHTML = `<div class="gal-thumb">${IMAGING.realAsset(item.key)}</div>
        <div class="gal-name">${item.name}</div>`;
    }
    card.addEventListener('click', () => openImage(spec));
    grid.appendChild(card); n++;
  });

  const cnt = $('#gallery-count');
  if (cnt) cnt.textContent = `真实影像 ${n} 项 · 点击放大`;
}

function openGallery() {
  renderGallery();
  showMask($('#gallery-mask'), '#btn-gallery-close');
}
function closeGallery() { hideMask($('#gallery-mask')); }

/* ============================================================
   病理演变演示
   ============================================================ */
let demoTimer = null;

function openDemo() {
  showMask($('#demo-mask'), '#btn-demo-close');
  playDemo();
}

function playDemo() {
  clearTimeout(demoTimer);
  const body = $('#demo-body');
  body.innerHTML = IMAGING.pathology();
  const steps = Array.from(body.querySelectorAll('.path-step'));
  const stepsBox = $('#demo-steps');

  const labels = steps.map(s => {
    const cap = s.querySelector('.path-seq-cap');
    return cap ? cap.textContent.trim() : '';
  });
  stepsBox.innerHTML = labels.map((t, i) =>
    `<div class="demo-step" data-i="${i}"><span class="n">${i + 1}</span><span>${t}</span></div>`
  ).join('');
  const dots = Array.from(stepsBox.querySelectorAll('.demo-step'));

  steps.forEach(s => { s.style.transition = 'opacity .55s ease'; s.style.opacity = '0'; });

  let i = 0;
  (function next() {
    if (i >= steps.length) {
      dots.forEach(d => d.classList.remove('on'));
      demoTimer = setTimeout(playDemo, 2600);
      return;
    }
    steps.forEach(s => { s.style.opacity = '0'; });
    steps[i].style.opacity = '1';
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
    i++;
    demoTimer = setTimeout(next, 2600);
  })();
}

function closeDemo() {
  clearTimeout(demoTimer);
  hideMask($('#demo-mask'));
}

/* ============================================================
   病例系统回顾与指南要点（数据来自 review.js）
   ============================================================ */
function openReview() {
  if (!window.REVIEW) return;
  const box = $('#review-body');
  let html = '';

  html += `<section class="rv-sec">
    <h4 class="rv-h">一、本病例全程回顾</h4>
    <p class="rv-intro">按九个环节逐段对照：当时的情境、关键决策、决策依据，以及对应的指南条目。</p>`;
  REVIEW.walkthrough.forEach((w, i) => {
    html += `<div class="rv-stage">
      <div class="rv-stage-head">
        <span class="rv-stage-idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="rv-stage-name">${w.stage}</span>
      </div>
      <div class="rv-row"><span class="rv-k">情境</span><span class="rv-v">${w.situation}</span></div>
      <div class="rv-row"><span class="rv-k">关键决策</span><span class="rv-v">${w.decision}</span></div>
      <div class="rv-row"><span class="rv-k">依据</span><span class="rv-v">${w.rationale}</span></div>
      <div class="rv-row rv-gl"><span class="rv-k">指南</span><span class="rv-v">${w.guideline}</span></div>
    </div>`;
  });
  html += `</section>`;

  html += `<section class="rv-sec">
    <h4 class="rv-h">二、指南要点与本病例对照</h4>
    <p class="rv-intro">四列依次为：环节、指南推荐、证据等级、本病例的对应处理。</p>
    <table class="rv-table">
      <thead><tr><th>环节</th><th>指南推荐</th><th>证据等级</th><th>本病例对应</th></tr></thead>
      <tbody>`;
  REVIEW.guidelinePoints.forEach(p => {
    html += `<tr><td class="rv-area">${p.area}</td><td>${p.point}</td><td class="rv-lv">${p.level}</td><td>${p.case}</td></tr>`;
  });
  html += `</tbody></table></section>`;

  html += `<section class="rv-sec">
    <h4 class="rv-h">三、争议与前沿</h4>
    <p class="rv-intro">以下各点在病例中都有落点，也是答辩时最可能被追问的方向。</p>`;
  REVIEW.controversies.forEach((c, i) => {
    html += `<div class="rv-contra">
      <div class="rv-contra-t"><span class="rv-num">${i + 1}</span>${c.title}</div>
      <div class="rv-contra-b">${c.body}</div>
    </div>`;
  });
  html += `</section>`;

  box.innerHTML = html;
  $('#review-refs').innerHTML = REVIEW.refs.map(r => `［${r.tag}］${r.name}　${r.source}`).join('<br>');
  showMask($('#review-mask'), '#btn-review-close');
  box.scrollTop = 0;
}

/* ============================================================
   事件绑定
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const on = (sel, ev, fn) => { const el = $(sel); if (el) el.addEventListener(ev, fn); };

  /* 共享电脑：一键清除本机登记/问卷/训练/评价数据 */
  on('#btn-clear-local', 'click', () => {
    if (!window.confirm('将清除本机保存的登记、问卷、训练结果与评价数据，且无法恢复。确定继续？')) return;
    try {
      Object.keys(localStorage)
        .filter(k => k.indexOf('nec_') === 0)
        .forEach(k => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }
    window.location.reload();
  });

  /* 影像查看器 */
  on('#btn-image-close', 'click', closeImage);
  on('#btn-image-close2', 'click', closeImage);

  /* 大图弹层 */
  on('#btn-pop-ok', 'click', closePop);

  /* 影像资料库 */
  ['#btn-gallery-start', '#btn-gallery-map'].forEach(sel => on(sel, 'click', openGallery));
  on('#btn-gallery-close', 'click', closeGallery);
  on('#btn-gallery-close2', 'click', closeGallery);

  /* 病理演变 */
  on('#btn-demo-open', 'click', openDemo);
  on('#btn-demo-close', 'click', closeDemo);
  on('#btn-demo-close2', 'click', closeDemo);
  on('#btn-demo-replay', 'click', playDemo);

  /* 病例系统回顾 */
  on('#btn-flow-review', 'click', openReview);
  on('#btn-review-close', 'click', closeReviewMask);
  on('#btn-review-close2', 'click', closeReviewMask);

  /* AVG 对话交互 */
  on('#rpg-dialog', 'click', talkAdvance);

  on('#btn-story-skip', 'click', skipStory);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (activeMask) {
        e.preventDefault();
        if (activeMask.id === 'story-mask') { skipStory(); return; }
        if (activeMask.id === 'pop-mask') { closePop(); return; }
        if (activeMask.id === 'image-mask') { closeImage(); return; }
        if (activeMask.id === 'gallery-mask') { closeGallery(); return; }
        if (activeMask.id === 'demo-mask') { closeDemo(); return; }
        if (activeMask.id === 'review-mask') { closeReviewMask(); return; }
        if (activeMask.id === 'roster-mask' && window.ROSTER) { window.ROSTER.close(); return; }
      }
      return;
    }
    if (e.key === 'Tab' && activeMask) {
      const list = Array.from(activeMask.querySelectorAll(FOCUSABLE))
        .filter(x => x.offsetParent !== null && !x.disabled);
      if (!list.length) return;
      const first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if ((e.key === ' ' || e.key === 'Enter')) {
      if ($('#pop-mask').classList.contains('active')) { e.preventDefault(); closePop(); return; }
      if ($('#story-mask').classList.contains('active')) { e.preventDefault(); talkAdvance(); }
    }
  });
});
