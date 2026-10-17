/* ============================================================
   医学影像模块 —— 全部为真实临床 / 文献影像
   ------------------------------------------------------------
   一、本院素材
       郑州大学第三附属医院（河南省妇幼保健院）新生儿外科 · 新生儿科
       全部影像均已做患儿及家属身份信息脱敏处理。

       gross   术中大体 · 坏死肠段
       us_pv   腹部彩超 · 门静脉积气
       us_pneu 腹部彩超 · 肠壁积气
       xr_pv   腹部平片 · 门静脉积气
       xr_pneu 腹部平片 · 肠壁积气
       stool   临床征象 · 血便
       RDS_VIDEO 临床视频 · 新生儿呼吸窘迫（已做运动包络脱敏）

   二、外部开放获取素材（4 幅，均为可自由使用的授权，已在下方逐条标注）

       1) xr_pp 腹部平片 · 气腹
          Al-Taher R, Mansour H, Al-Qaisi M, et al. Spontaneous
          pneumoperitoneum in neonates: a case series. Ann Pediatr Surg.
          2022;18:33. DOI: 10.1186/s43159-022-00170-7
          授权：Creative Commons Attribution 4.0 International (CC BY 4.0)
          可商用、可改编，需署名。

       2) xr_early 腹部平片 · NICU 早期（肠管弥漫扩张、充气不均）
          Pediatric Imaging. Premature newborn with feeding intolerance.
          https://pediatricimaging.org/2019/07/29/premature-newborn-with-feeding-intolerance/
          授权：CC BY-NC-SA 4.0 —— 署名-非商业性使用-相同方式共享
          ⚠ 含"非商业性"条款，仅可用于非商业教学；日后若商业化须替换。

       3) us_normal 腹部超声 · 正常肠管
          Priyadarshi A, Rogerson S, Cruzado R, et al. Neonatologist-performed
          point-of-care abdominal ultrasound: What have we learned so far?
          Front Pediatr. 2023;11:1173311. doi:10.3389/fped.2023.1173311
          Figure 2, panel A. 授权：CC BY 4.0，可商用、可改编，需署名。

       4) xr_rds 胸部正位片 · 新生儿呼吸窘迫综合征
          Wikimedia Commons: "X-ray of infant respiratory distress
          syndrome (IRDS).png"
          授权：CC0 1.0 Universal（完全放弃著作权，等同公有领域）

   三、说明
       本模块为教学训练工具的一部分，影像仅用于征象识别训练，
       不作为诊断依据；实际临床决策请遵循本院诊疗规范与上级医师意见。
       全部影像均为真实拍摄或已发表文献图片，不含任何手绘示意图。
   ============================================================ */

window.IMAGING = {

  /* ---------- 真实素材（外置 JPG，assets/real/） ---------- */
  REAL: {
    gross:     'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/nec_gross.jpg',
    stool:     'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/clinical_bloody_stool.jpg',
    us_normal: 'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/us_normal.jpg',
    us_pneu:   'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/us_pneumatosis.jpg',
    us_pv:     'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/us_pv_gas.jpg',
    xr_early:  'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/xr_early.jpg',
    xr_pneu:   'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/xr_pneumatosis.jpg',
    xr_pv:     'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/xr_pv_gas.jpg',
    xr_pp:     'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/xr_pneumoperitoneum.jpg',
    xr_rds:    'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/xr_rds.jpg'
  },

  /* ---------- 通用外框 ---------- */
  _realFrame(src, caption, tag) {
    return `
    <div class="real-film">
      <div class="real-film-inner">
        <img src="${src}" alt="${caption}" loading="lazy" decoding="async"/>
        <span class="real-tag">${tag}</span>
      </div>
      <div class="real-caption">${caption}</div>
    </div>`;
  },

  /* ---------- 脱敏临床视频 ---------- */
  RDS_VIDEO: 'https://6e8e529789ac46b1a6a8eb67ed751cdc.sg2.agentos-app.run/assets/real/rds_clip.mp4',
  _realVideo(src, caption, tag) {
    return `
    <div class="real-film">
      <div class="real-film-inner">
        <video class="real-video" src="${src}" poster="assets/real/rds_clip_480.jpg" controls playsinline preload="none"></video>
        <span class="real-tag">${tag}</span>
      </div>
      <div class="real-caption">${caption}</div>
      <div class="real-hint">已对患儿及家属身份信息做脱敏处理，画面仅展示临床征象</div>
    </div>`;
  },
  rdsVideo() {
    return this._realVideo(this.RDS_VIDEO,
      '临床视频 · 新生儿呼吸窘迫（三凹征、呼吸急促、呻吟）', '真实影像 · 临床视频');
  },

  /* ---------- 胸部正位片：新生儿呼吸窘迫综合征 ---------- */
  realChest() {
    return this._realFrame(this.REAL.xr_rds,
      '胸部正位片 · 双肺透亮度普遍减低，呈弥漫细颗粒（磨玻璃）影，可见支气管充气征，肺容积减小，符合新生儿呼吸窘迫综合征',
      '真实影像 · 胸片');
  },

  /* ---------- 术中大体 ---------- */
  realGross() {
    return this._realFrame(this.REAL.gross,
      '术中大体 · 坏死肠段广泛肠壁积气，肠管色泽暗红、张力差',
      '真实影像 · 术中');
  },

  /* ---------- 腹部平片 ---------- */
  realXray(kind) {
    if (kind === 'pneumoperitoneum') {
      return this._realFrame(this.REAL.xr_pp,
        '腹部平片 · 气腹：仰卧位可见前腹壁下大量游离气体，呈足球征/Rigler 征，肠管被压向中央；立位或左侧卧位才见膈下/肝上前新月形游离气体',
        '真实影像 · 气腹');
    }
    if (kind === 'pneumatosis') {
      return this._realFrame(this.REAL.xr_pneu,
        '腹部立位平片 · 肠壁积气：沿肠壁走行的线状、串珠状透亮影，需与肠管内小气泡鉴别',
        '真实影像 · 腹平片');
    }
    // kind === 'early'：NICU 早期、疑似 NEC 阶段。
    return this._realFrame(this.REAL.xr_early,
      '腹部平片 · 肠管弥漫扩张、充气不均，未见肠壁积气、门静脉积气及游离气体',
      '真实影像 · 腹平片');
  },

  /* ---------- 腹部超声 ---------- */
  realUltrasound(kind) {
    if (kind === 'pneumatosis') {
      return this._realFrame(this.REAL.us_pneu,
        '腹部彩超 · 肠壁内点状强回声（白箭头），提示肠壁积气', '真实影像 · 超声');
    }
    if (kind === 'portal') {
      return this._realFrame(this.REAL.us_pv,
        '腹部彩超 · 门静脉积气（白箭头）', '真实影像 · 超声');
    }
    // kind === 'normal'
    return this._realFrame(this.REAL.us_normal,
      '腹部超声 · 正常肠管：肠壁呈高-低-高回声分层（gut signature），肠腔内散在点状强回声为肠腔积气',
      '真实影像 · 超声');
  },

  /* ---------- 临床血便 ---------- */
  realStool() {
    return this._realFrame(this.REAL.stool,
      '临床征象 · 血便（尿不湿可见血性及黏液样便）', '真实影像 · 临床');
  },

  /* ---------- 对外统一接口 ---------- */
  chest()             { return this.realChest(); },
  abdomenEarly()      { return this.realXray('early'); },
  pneumatosis()       { return this.realXray('pneumatosis'); },
  pneumoperitoneum()  { return this.realXray('pneumoperitoneum'); },
  ultrasound(kind)    { return this.realUltrasound(kind); },

  /* ---------- 病理演变：四帧真实影像序列 ----------
     供"从肠壁积气到气腹"演示使用。playDemo() 会按 .path-step 的顺序
     逐个切换透明度，因此这里返回并列堆叠的四帧而不是动画。 */
  PATH_SEQ: [
    { key: 'us_normal', cap: '腹部超声 · 正常肠管，肠壁分层清晰，血供良好' },
    { key: 'us_pneu',   cap: '腹部彩超 · 肠壁内出现点状强回声，气体进入肠壁' },
    { key: 'gross',     cap: '术中大体 · 肠壁全层坏死，肠管暗红、张力丧失' },
    { key: 'xr_pp',     cap: '腹部平片 · 仰卧位前腹壁下大量游离气体，呈足球征/Rigler 征；立位/左侧卧位见膈下/肝上前新月形游离气体' }
  ],
  pathology() {
    const seq = this.PATH_SEQ.map((s, i) => {
      const m = this._ASSET_META[s.key];
      return `
      <div class="path-step" data-i="${i}">
        ${this._realFrame(this.REAL[s.key], m[0], m[1])}
        <div class="path-seq-cap">${s.cap}</div>
      </div>`;
    }).join('');
    return `<div class="path-seq">${seq}</div>`;
  },

  /* ---------- 附：真实影像直取 ---------- */
  grossPhoto() { return this.realGross(); },
  stoolPhoto() { return this.realStool(); },
  chestPhoto() { return this.realChest(); },

  /* ---------- 资料库用：按素材键直取，保证"名称—图像"一一对应 ---------- */
  _ASSET_META: {
    gross:     ['术中大体 · 坏死肠段广泛肠壁积气，肠管色泽暗红、张力差', '真实影像 · 术中'],
    us_pv:     ['腹部彩超 · 门静脉积气（白箭头）', '真实影像 · 超声'],
    us_pneu:   ['腹部彩超 · 肠壁内点状强回声（白箭头），提示肠壁积气', '真实影像 · 超声'],
    us_normal: ['腹部超声 · 正常肠管：肠壁呈高-低-高回声分层（gut signature），肠腔内散在点状强回声为肠腔积气', '真实影像 · 超声'],
    xr_pv:     ['腹部立位平片 · 肝内门静脉积气（白箭头），肠壁积气征象', '真实影像 · 腹平片'],
    xr_pneu:   ['腹部立位平片 · 肠壁积气：沿肠壁走行的线状、串珠状透亮影，需与肠管内小气泡鉴别', '真实影像 · 腹平片'],
    xr_early:  ['腹部平片 · 肠管弥漫扩张、充气不均，未见肠壁积气、门静脉积气及游离气体', '真实影像 · 腹平片'],
    xr_rds:    ['胸部正位片 · 双肺透亮度普遍减低，呈弥漫细颗粒（磨玻璃）影，可见支气管充气征，肺容积减小，符合新生儿呼吸窘迫综合征', '真实影像 · 胸片'],
    xr_pp:     ['腹部平片 · 气腹：仰卧位可见前腹壁下大量游离气体，呈足球征/Rigler 征，肠管被压向中央；立位或左侧卧位才见膈下/肝上前新月形游离气体', '真实影像 · 气腹'],
    stool:     ['临床征象 · 血便（尿不湿可见血性及黏液样便）', '真实影像 · 临床']
  },
  realAsset(key) {
    const m = this._ASSET_META[key];
    if (!m || !this.REAL[key]) return '';
    return this._realFrame(this.REAL[key], m[0], m[1]);
  },
  asset(key) { return this.realAsset(key); }

};
