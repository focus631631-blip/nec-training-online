/* ============================================================
   使用前问卷 —— 页面内填写，不导出、不外发
   ------------------------------------------------------------
   设计依据（国内外文献）：
     · 需求评估框架：Kern DE, Thomas PA, Hughes MT. Curriculum
       Development for Medical Education: A Six-Step Approach.
       3rd ed. Baltimore: Johns Hopkins University Press; 2016.
       （第 1 步「问题识别与一般需求评估」→ 本问卷第一、二、四部分）
     · 临床内容对标：中国医师协会新生儿科医师分会循证专业委员会.
       新生儿坏死性小肠结肠炎临床诊疗指南（2020）[J]. 中国当代儿科杂志,
       2021, 23(1): 1-11. DOI: 10.7499/j.issn.1008-8830.2011145
       （修正 Bell 分期；腹平片 + 腹部超声 + 血常规/CRP/PCT/血气；
         内科治疗起点为禁食、胃肠减压、经验性广谱抗生素）
     · 技术接受度构念：Davis FD. Perceived usefulness, perceived ease
       of use, and user acceptance of information technology. MIS Q.
       1989;13(3):319-340；Venkatesh V, Morris MG, Davis GB, Davis FD.
       User acceptance of information technology: toward a unified view.
       MIS Q. 2003;27(3):425-478.（绩效期望、努力期望、使用意愿）
     · 可行性评估维度：Bowen DJ, Kreuter M, Spring B, et al. How we
       design feasibility studies. Am J Prev Med. 2009;36(5):452-457.
       （可接受性、需求、实用性）
     · 教学效果四层模型：Kirkpatrick DL, Kirkpatrick JD. Evaluating
       Training Programs: The Four Levels. 3rd ed. 2006.
       （本问卷对应第 1 层「反应」的前测部分）

   说明：本问卷为教学工具的使用前画像与需求调查，不是经信效度检验的
        正式量表。各组量表条目依据上述公开文献的维度与措辞改写，若用于
        科研发表，请以原量表正式版本重新校对并做信效度检验。
   ============================================================ */

(function () {
  const $ = (s) => document.querySelector(s);

  /* ---------- 本机存储（file:// 下 localStorage 可能不可用，做降级） ---------- */
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
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* 降级为内存 */ }
    }
  };

  /* ============================================================
     分部（含文献依据）
     ============================================================ */
  const SECTIONS = [
    {
      id: 'A', name: '基本信息', cn: '一',
      note: '用于分层统计，不做个体识别',
      src: 'Kern 六步法第 1 步：一般需求评估的常规人口学与背景条目'
    },
    {
      id: 'B', name: '基线能力自评', cn: '二',
      note: '对照 2020 版 NEC 诊疗指南的核心环节给自己打分',
      src: '条目内容对标《新生儿坏死性小肠结肠炎临床诊疗指南（2020）》：修正 Bell 分期、影像学检查、内科治疗起点'
    },
    {
      id: 'C', name: '使用意愿', cn: '三',
      note: '你想不想用，和好不好用，是两件事',
      src: '技术接受模型 TAM（感知有用性、感知易用性）与 UTAUT（绩效期望、努力期望、社会影响）三构念'
    },
    {
      id: 'D', name: '使用场景与内容偏好', cn: '四',
      note: '',
      src: 'Bowen 等（2009）可行性研究框架中的「需求（demand）」与「可接受性（acceptability）」'
    },
    {
      id: 'E', name: '推送意愿与留言', cn: '五',
      note: '联系方式可留空，只用于内容推送',
      src: ''
    }
  ];

  /* ============================================================
     题目
     ============================================================ */
  const SCALE5 = ['很低', '偏低', '一般', '较高', '很高'];

  const QS = [
    /* ---------- A 基本信息 ---------- */
    { id: 'gender', sec: 'A', type: 'single', title: '性别', options: ['男', '女', '不愿透露'] },
    {
      id: 'role', sec: 'A', type: 'single', title: '你现在的身份', required: true,
      options: ['新生儿外科医师', '新生儿科医师', '儿科住培医师或研究生', '产科、助产或护理人员', '医学生或见习生', '其他']
    },
    {
      id: 'seniority', sec: 'A', type: 'single', title: '年资',
      options: ['医学生', '住院医师规范化培训阶段', '住院医师（1—3 年）', '主治医师', '副主任医师及以上', '其他']
    },
    {
      id: 'workplace', sec: 'A', type: 'single', title: '所在单位类型',
      options: ['三级甲等妇幼保健院或儿童医院', '三级综合医院', '二级医院', '基层医疗机构', '其他']
    },
    {
      id: 'exp', sec: 'A', type: 'single', title: '你实际参与过的新生儿 NEC 病例大约有几例',
      options: ['0 例', '1—5 例', '6—20 例', '20 例以上']
    },

    /* ---------- B 基线能力自评 ---------- */
    {
      id: 'b_first', sec: 'B', type: 'scale5', required: true, title: '面对一个「大便带血」的早产儿，你对「第一步该做什么」有多大把握',
      scale: SCALE5
    },
    {
      id: 'b_bell', sec: 'B', type: 'scale5', required: true, title: '你能准确说出 NEC 修正 Bell 分期各期之间的分界点吗',
      scale: SCALE5,
      note: '不确定也没关系，这题只用来了解起点，训练结束后可以回头看'
    },
    {
      id: 'b_image', sec: 'B', type: 'scale5', required: true, title: '腹平片与腹部超声在 NEC 早期识别中的分工，你有多清楚',
      scale: SCALE5,
      note: '不确定也没关系，这题只用来了解起点，训练结束后可以回头看'
    },
    {
      id: 'b_treat', sec: 'B', type: 'scale5', required: true, title: '对「禁食—胃肠减压—经验性抗生素」这三条内科治疗起点，你有多确定该在什么时候启动',
      scale: SCALE5
    },
    {
      id: 'b_weak', sec: 'B', type: 'multi', title: '你觉得最可能在哪个环节出问题', sub: '可多选，选你真实会漏的那几项',
      options: [
        '血便性状与时间线的追问',
        '腹围的逐日连续测量',
        '肛门指检',
        '腹壁色泽与张力的观察',
        '腹平片判读',
        '腹部超声判读',
        '修正 Bell 分期与处理强度的对应',
        '禁食与胃肠减压的启动时机',
        '恢复喂养的条件把握'
      ]
    },

    /* ---------- C 使用意愿 ---------- */
    {
      id: 'c_useful', sec: 'C', type: 'scale5', required: true, title: '如果这套工具能让我看清每一步决策的后果，我愿意花时间把它做完',
      scale: SCALE5, note: '对应 TAM 的感知有用性、UTAUT 的绩效期望'
    },
    {
      id: 'c_easy', sec: 'C', type: 'scale5', required: true, title: '从你看到的界面判断，你觉得它上手应该不难',
      scale: SCALE5, note: '对应 TAM 的感知易用性、UTAUT 的努力期望'
    },
    {
      id: 'c_willing', sec: 'C', type: 'single', required: true, title: '你会把它推荐给同科室的同事或带的学生吗',
      options: ['会，主动推荐', '可能会', '看情况', '不太会']
    },

    /* ---------- D 使用场景与内容偏好 ---------- */
    {
      id: 'd_usage', sec: 'D', type: 'single', title: '你最希望在什么场景下用它',
      options: ['个人自学', '科室住培教学', '院内或院际竞赛', '学生见习与带教', '科务交班与病例讨论']
    },
    {
      id: 'd_style', sec: 'D', type: 'multi', title: '你更喜欢哪种形式的学习内容', sub: '可多选',
      options: [
        '交互式决策训练（像现在这样）',
        '短视频讲解',
        '图文病例复盘',
        '影像读片训练',
        '题目自测与错题本',
        '可下载的教学课件',
        '手术视频与操作要点'
      ]
    },
    {
      id: 'd_dur', sec: 'D', type: 'single', title: '你能接受的单次训练时长',
      options: ['5 分钟以内', '10 分钟左右', '20 分钟左右', '30 分钟以上，愿意一次做完']
    },
    {
      id: 'd_cases', sec: 'D', type: 'multi', title: '还希望增加哪些病例', sub: '可多选',
      options: [
        '新生儿腹裂与脐膨出',
        '先天性肠闭锁与肠旋转不良',
        '先天性巨结肠及其危象',
        '肥厚性幽门狭窄',
        '新生儿气胸与纵隔气肿',
        '新生儿黄疸的疾病鉴别',
        '新生儿卵巢囊肿与腹部包块',
        '肛门直肠畸形'
      ]
    },

    /* ---------- E 推送意愿与留言 ---------- */
    {
      id: 'e_push', sec: 'E', type: 'multi', title: '你希望我们推送什么内容', sub: '可多选',
      options: [
        '指南与共识更新解读',
        '典型病例复盘',
        '影像读片训练',
        '手术视频与操作要点',
        '教学课件与题库',
        '科室管理与科务模板',
        '不需要推送'
      ]
    },
    {
      id: 'e_freq', sec: 'E', type: 'single', title: '如果推送，你希望的频率',
      options: ['每周一次', '每两周一次', '每月一次', '不定期，有重要内容再发']
    },
    {
      id: 'e_contact', sec: 'E', type: 'text', title: '如果希望收到推送，可以留一个联系方式',
      sub: '可留空，仅用于内容推送，不会用于其他用途', placeholder: '邮箱或微信，可留空'
    },
    {
      id: 'e_comment', sec: 'E', type: 'area', title: '还有什么想告诉我们的',
      sub: '可留空', placeholder: '建议、批评、想吐槽的地方都可以写在这里'
    }
  ];

  /* ============================================================
     状态
     ------------------------------------------------------------
     前测（A+B）与后测（C+D/E）分键保存，互不覆盖；
     内存里保存两份问卷合并后的视图，落盘时只写当前视图涉及的题。
     ============================================================ */
  const KEY_PRE = 'nec_survey_pre_v3';    // 前测：A 基本信息 + B 基线能力自评
  const KEY_POST = 'nec_survey_post_v3';  // 后测：C 使用意愿 + D 内容偏好 + E 推送意愿
  let from = 'home';
  let opened = false;                     // 是否已进入过问卷（pagehide 兜底只在进入后生效）
  let saveTimer = null;

  function isPostView() {
    return !!activeSecs && activeSecs.some(s => s === 'C' || s === 'D' || s === 'E');
  }
  function keyForView() { return isPostView() ? KEY_POST : KEY_PRE; }

  /* 读取时把前后测合并成一个视图，界面逻辑不必区分两份问卷 */
  function loadAll() {
    return Object.assign({}, Store.get(KEY_PRE, {}), Store.get(KEY_POST, {}));
  }

  let answers = loadAll();

  /* 只把「当前视图涉及的题」写进对应的键，另一份问卷不受影响 */
  function saveView() {
    const out = {};
    qsOf().forEach(q => { if (answers[q.id] !== undefined) out[q.id] = answers[q.id]; });
    /* 保留该键原有的提交元信息，避免自动保存把 _ts 等冲掉 */
    const prev = Store.get(keyForView(), {});
    ['_ts', '_from', '_ver'].forEach(k => {
      if (prev[k] !== undefined && out[k] === undefined) out[k] = prev[k];
    });
    Store.set(keyForView(), out);
  }

  /* 防抖 250ms 自动保存：输入/选择后不点提交也不会丢 */
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; saveView(); }, 250);
  }

  function flushSave() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (opened) saveView();
  }

  /* 离开页面 / 切到后台前兜底保存（C-07） */
  window.addEventListener('pagehide', flushSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escA(s) { return esc(s).replace(/"/g, '&quot;'); }

  /* ============================================================
     渲染
     ============================================================ */
  /* ============================================================
     当前视图包含哪些分部
     ------------------------------------------------------------
     null      = 全部五部分（从首页直接点「使用前问卷」时）
     ['A','B'] = 前测：基本信息 + 基线能力自评（登记第 2 步）
     ['C','D','E'] = 后测：使用意愿 + 内容偏好 + 推送意愿（训练结束后）
     ============================================================ */
  let activeSecs = null;

  function qsOf() {
    return activeSecs ? QS.filter(q => activeSecs.indexOf(q.sec) >= 0) : QS;
  }

  function render() {
    const box = $('#survey-list');
    if (!box) return;
    box.innerHTML = '';

    SECTIONS.filter(sec => !activeSecs || activeSecs.indexOf(sec.id) >= 0).forEach(sec => {
      const head = document.createElement('div');
      head.className = 'sv-sec';
      head.innerHTML = `
        <div class="sv-sec-t"><span class="sv-sec-no">${sec.cn}</span>${esc(sec.name)}
          ${sec.note ? `<span class="sv-sec-note">${esc(sec.note)}</span>` : ''}</div>
        ${sec.src ? `<div class="sv-sec-src">文献依据：${esc(sec.src)}</div>` : ''}`;
      box.appendChild(head);

      QS.filter(q => q.sec === sec.id).forEach(q => {
        const idx = qsOf().indexOf(q) + 1;
        const card = document.createElement('div');
        card.className = 'sv-q';
        card.dataset.qid = q.id;

        let body = '';
        if (q.type === 'single' || q.type === 'multi') {
          body = `<div class="sv-opts">` + q.options.map(o => `
            <button type="button" class="sv-opt" data-q="${q.id}" data-v="${escA(o)}"
                    data-multi="${q.type === 'multi' ? 1 : 0}">
              <span class="sv-mark"></span><span class="sv-txt">${esc(o)}</span>
            </button>`).join('') + `</div>`;
        } else if (q.type === 'scale5') {
          body = `<div class="sv-scale">` + [1, 2, 3, 4, 5].map(n => `
            <button type="button" class="sv-scale-btn" data-q="${q.id}" data-v="${n}">
              <b>${n}</b><span>${esc((q.scale || SCALE5)[n - 1])}</span>
            </button>`).join('') + `</div>`;
        } else if (q.type === 'text') {
          body = `<input class="sv-input" type="text" data-q="${q.id}"
                    placeholder="${escA(q.placeholder || '')}" value="${escA(answers[q.id] || '')}"/>`;
        } else {
          body = `<textarea class="sv-input sv-area" data-q="${q.id}" rows="3"
                    placeholder="${escA(q.placeholder || '')}">${esc(answers[q.id] || '')}</textarea>`;
        }

        card.innerHTML = `
          <div class="sv-q-head">
            <span class="sv-no">${String(idx).padStart(2, '0')}</span>
            <div>
              <div class="sv-title">${esc(q.title)}${q.required ? '<span class="sv-req">必填</span>' : ''}</div>
              ${q.sub ? `<div class="sv-sub">${esc(q.sub)}</div>` : ''}
              ${q.note ? `<div class="sv-note">${esc(q.note)}</div>` : ''}
            </div>
          </div>
          <div class="sv-q-body">${body}</div>`;
        box.appendChild(card);
      });
    });

    box.querySelectorAll('.sv-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.q, val = btn.dataset.v;
        if (btn.dataset.multi === '1') {
          const cur = Array.isArray(answers[qid]) ? answers[qid].slice() : [];
          const k = cur.indexOf(val);
          if (k >= 0) cur.splice(k, 1); else cur.push(val);
          answers[qid] = cur;
        } else {
          answers[qid] = (answers[qid] === val) ? '' : val;
        }
        paint(qid); updateProgress(); persist();
      });
    });
    box.querySelectorAll('.sv-scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.q, v = Number(btn.dataset.v);
        answers[qid] = (answers[qid] === v) ? '' : v;
        paint(qid); updateProgress(); persist();
      });
    });
    box.querySelectorAll('.sv-input').forEach(inp => {
      inp.addEventListener('input', () => {
        answers[inp.dataset.q] = inp.value;
        updateProgress(); persist();
      });
    });

    qsOf().forEach(q => paint(q.id));
    updateProgress();
  }

  function paint(qid) {
    const card = document.querySelector(`.sv-q[data-qid="${qid}"]`);
    if (!card) return;
    const val = answers[qid];
    card.querySelectorAll('.sv-opt').forEach(b => {
      const on = Array.isArray(val) ? val.includes(b.dataset.v) : val === b.dataset.v;
      b.classList.toggle('on', on);
    });
    card.querySelectorAll('.sv-scale-btn').forEach(b => {
      b.classList.toggle('on', Number(b.dataset.v) === val);
    });
  }

  function answeredCount() {
    return qsOf().filter(q => {
      const v = answers[q.id];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'number') return true;
      return v !== undefined && String(v).trim() !== '';
    }).length;
  }

  function updateProgress() {
    const list = qsOf();
    const n = answeredCount(), total = list.length;
    const bar = $('#sv-progress-fill');
    if (bar) bar.style.width = Math.round(n / total * 100) + '%';
    const txt = $('#sv-progress-txt');
    if (txt) txt.textContent = `${n} / ${total}`;
    const sub = $('#survey-submit');
    if (sub) {
      const miss = list.filter(q => q.required && !answers[q.id]);
      sub.disabled = miss.length > 0;
      sub.textContent = miss.length ? `还有 ${miss.length} 道必填` : '提交问卷';
    }
  }

  /* ============================================================
     提交 / 回显
     ============================================================ */
  function showSaved() {
    const box = $('#sv-saved');
    if (!box) return;
    const n = answeredCount();
    box.innerHTML = `
      <div class="sv-saved-in">
        <div class="sv-saved-ico">✓</div>
        <div>
          <div class="sv-saved-t">问卷已记录在本机</div>
          <div class="sv-saved-s">共回答 ${n} / ${qsOf().length} 题。可以随时回来修改，内容不会离开这台电脑。</div>
        </div>
      </div>`;
    box.classList.add('on');
  }

  function submit() {
    const secs = activeSecs ? activeSecs.slice() : ['A', 'B'];
    const ts = new Date().toISOString();

    /* 只写当前视图对应的键：前测与后测各自保存，互不覆盖（C-06） */
    const out = {};
    qsOf().forEach(q => { if (answers[q.id] !== undefined) out[q.id] = answers[q.id]; });
    out._ts = ts;
    out._from = from;
    out._ver = 3;
    Store.set(keyForView(), out);

    /* 合并视图（含两份问卷）交给登记模块合成回执 */
    const snapshot = Object.assign({}, loadAll());
    snapshot._ts = ts;
    snapshot._from = from;
    snapshot._ver = 3;

    showSaved();

    /* 若本次问卷是「使用登记」的第 2 步，交给 ROSTER 合成完整回执 */
    if (window.ROSTER && typeof window.ROSTER.inSurveyFlow === 'function' && window.ROSTER.inSurveyFlow()) {
      if (typeof window.ROSTER.onSurveyDone === 'function') {
        window.ROSTER.onSurveyDone(snapshot, secs);
      }
      return;
    }

    if (typeof toast === 'function') toast('问卷已记录，感谢你的反馈');
  }

  /* 只清当前视图涉及的题；另一份问卷与已提交数据不受影响（C-06） */
  function reset() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    qsOf().forEach(q => { delete answers[q.id]; });
    Store.set(keyForView(), {});
    const box = $('#sv-saved');
    if (box) { box.classList.remove('on'); box.innerHTML = ''; }
    render();
    const s = $('#survey-scroll'); if (s) s.scrollTop = 0;
  }

  /* 按当前视图切换页头文案 */
  const HEAD = {
    kicker: '使用前问卷 · 模块 B',
    title: '先花两分钟，让我们知道你是谁',
    sub: '问卷分两部分：基本信息与基线能力自评（约 10 题）；使用意愿、内容偏好与推送意愿在训练结束后填写。各部分的维度与措辞参考了国内外公开文献（详见每部分下方的「文献依据」）。所有填写内容只保存在本机浏览器，不会自动上传；如需汇总，请使用登记回执或复制功能自行发送。',
  };

  function applyHeadCopy() {
    const k = document.querySelector('#screen-survey .doc-kicker');
    const t = document.querySelector('#screen-survey .doc-title');
    const s = document.querySelector('#screen-survey .doc-sub');
    if (!k || !t || !s) return;

    if (activeSecs && activeSecs.indexOf('C') >= 0) {
      // 后测
      k.textContent = '使用后问卷 · 训练结束';
      t.textContent = '训练做完了，说说真实感受';
      s.textContent = '这一部分问三件事：使用意愿、内容偏好与推送意愿。题目依据 TAM／UTAUT 等公开文献的维度整理。所有填写内容只保存在本机浏览器，不会自动上传；如需汇总，请使用登记回执或复制功能自行发送。';
    } else if (activeSecs) {
      // 前测
      k.textContent = '使用前问卷 · 登记第 2 步';
      t.textContent = '先花两分钟，让我们知道你是谁';
      s.textContent = '这一部分只问两件事：基本信息与基线能力自评，用于分层统计和训练前后的对比。关于使用体验的问题，等训练做完再问。所有填写内容只保存在本机浏览器，不会自动上传；如需汇总，请使用登记回执或复制功能自行发送。';
    } else {
      k.textContent = HEAD.kicker;
      t.textContent = HEAD.title;
      s.textContent = HEAD.sub;
    }
  }

  function open(fromPage, secs) {
    flushSave();               // 切换视图前先把上一视图的作答落盘
    from = fromPage || 'home';
    if (fromPage !== 'roster' && window.ROSTER && typeof window.ROSTER.endSurveyFlow === 'function') {
      window.ROSTER.endSurveyFlow();
    }
    /* 默认只发前测（A+B）：后测 C/D/E 只在结算页之后出现（D07） */
    activeSecs = (Array.isArray(secs) && secs.length) ? secs.slice() : ['A', 'B'];
    opened = true;
    applyHeadCopy();
    answers = loadAll();
    render();
    const box = $('#sv-saved');
    if (answeredCount() > 0) showSaved();
    else if (box) { box.classList.remove('on'); box.innerHTML = ''; }
    if (typeof showScreen === 'function') showScreen('screen-survey');
    const s = $('#survey-scroll'); if (s) s.scrollTop = 0;
  }

  function back() {
    flushSave();
    if (window.ROSTER && typeof window.ROSTER.endSurveyFlow === 'function') window.ROSTER.endSurveyFlow();
    if (typeof showScreen === 'function') showScreen(from === 'flow' ? 'screen-flow-summary' : 'screen-start');
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-open-survey]').forEach(b =>
      b.addEventListener('click', () => {
        const secs = b.dataset.sections ? b.dataset.sections.split(',').map(s => s.trim()) : null;
        open(b.dataset.openSurvey, secs);
      }));

    const b1 = $('#survey-submit'), b2 = $('#survey-reset');
    const b3 = $('#survey-back'), b4 = $('#survey-back2');
    if (b1) b1.addEventListener('click', submit);
    if (b2) b2.addEventListener('click', reset);
    if (b3) b3.addEventListener('click', back);
    if (b4) b4.addEventListener('click', back);
  });

  window.SURVEY = {
    open, reset, QUESTIONS: QS, SECTIONS,
    currentSections: () => (activeSecs ? activeSecs.slice() : null),
  };
})();
