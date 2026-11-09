/* ============================================================
   手术室准备 · 麻醉 / 消毒 / 铺巾 —— 示意图
   纯 SVG 绘制，不依赖外部素材，避免虚构真实照片。
   暴露给 flow_case.js：window.OR_PREP_SVG
   ============================================================ */
(function () {
  const SVG = `
<svg viewBox="0 0 1180 720" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;height:auto;max-height:80vh;display:block" role="img"
     aria-label="手术室准备示意：麻醉诱导与气管插管、腹部消毒范围、铺无菌巾后的术野">
  <defs>
    <radialGradient id="orBg" cx="50%" cy="34%" r="80%">
      <stop offset="0" stop-color="#10283e"/>
      <stop offset="1" stop-color="#04090f"/>
    </radialGradient>
    <linearGradient id="orTable" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#173850"/>
      <stop offset="1" stop-color="#091826"/>
    </linearGradient>
    <linearGradient id="orMatt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#123248"/>
      <stop offset="1" stop-color="#0c2133"/>
    </linearGradient>
    <linearGradient id="orDrape" x1="0.1" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#37808b"/>
      <stop offset="0.5" stop-color="#276069"/>
      <stop offset="1" stop-color="#1a444d"/>
    </linearGradient>
    <linearGradient id="orSkin" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#efbda3"/>
      <stop offset="1" stop-color="#cf9077"/>
    </linearGradient>
    <radialGradient id="orPovidone" cx="50%" cy="45%" r="62%">
      <stop offset="0" stop-color="#a9621f" stop-opacity="0.52"/>
      <stop offset="1" stop-color="#6f3c11" stop-opacity="0.34"/>
    </radialGradient>
    <filter id="orSoft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="9"/>
    </filter>
    <filter id="orGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <clipPath id="orHole">
      <ellipse cx="662" cy="372" rx="112" ry="84"/>
    </clipPath>
  </defs>

  <rect width="1180" height="720" fill="url(#orBg)"/>
  <!-- 手术灯 -->
  <ellipse cx="590" cy="40" rx="250" ry="120" fill="#7fd8ff" opacity="0.10" filter="url(#orSoft)"/>
  <ellipse cx="590" cy="210" rx="330" ry="120" fill="#2e6f8f" opacity="0.16" filter="url(#orSoft)"/>

  <!-- 手术台 -->
  <rect x="86" y="192" width="1008" height="330" rx="26" fill="url(#orTable)" stroke="#2d6484" stroke-width="1.6"/>
  <rect x="108" y="212" width="964" height="290" rx="16" fill="url(#orMatt)"/>

  <!-- 患儿：头在左，躯干向右，腹部正对术野 -->
  <g>
    <ellipse cx="252" cy="368" rx="64" ry="57" fill="url(#orSkin)"/>
    <rect x="296" y="312" width="596" height="120" rx="58" fill="url(#orSkin)"/>
    <rect x="862" y="338" width="104" height="40" rx="20" fill="url(#orSkin)"/>
    <rect x="862" y="392" width="104" height="40" rx="20" fill="url(#orSkin)"/>
        <ellipse cx="252" cy="368" rx="64" ry="57" fill="none" stroke="#9a6349" stroke-width="1" opacity="0.3"/>
    <!-- 气管插管 -->
    <path d="M214 340 q-40 -18 -74 -10" stroke="#dcecf6" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M214 340 q-40 -18 -74 -10" stroke="#8cc7e0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.75"/>
    <rect x="128" y="322" width="28" height="18" rx="5" fill="#9adcf0"/>
    <rect x="196" y="332" width="26" height="9" rx="4" fill="#eadcc8" opacity="0.9"/>
  </g>

  <!-- 无菌巾：四周封闭，腹部留洞 -->
  <path fill-rule="evenodd" fill="url(#orDrape)"
        d="M430 244 h424 q16 0 16 16 v224 q0 16 -16 16 H430 q-16 0 -16 -16 V260 q0 -16 16 -16 z
           M640 296 a100 76 0 1 0 0.1 0 z"/>
  <!-- 洞口边缘 -->
  <ellipse cx="640" cy="372" rx="100" ry="76" fill="none" stroke="#5aa8b6" stroke-width="2.4" opacity="0.9"/>
  <ellipse cx="640" cy="372" rx="92" ry="69" fill="none" stroke="#0a1c26" stroke-width="3" opacity="0.5"/>
  <!-- 洞内：腹部皮肤与消毒液 -->
  <g clip-path="url(#orHole)">
    <rect x="520" y="280" width="240" height="190" fill="url(#orSkin)"/>
    <ellipse cx="640" cy="372" rx="82" ry="60" fill="#b4641a" opacity="0.88"/>
    <ellipse cx="640" cy="372" rx="82" ry="60" fill="none" stroke="#e9a95c" stroke-width="2" opacity="0.85"/>
    <ellipse cx="640" cy="372" rx="98" ry="74" fill="none" stroke="#3a2410" stroke-width="8" opacity="0.28"/>
    
  </g>
  <!-- 巾钳 -->
  <g stroke="#c2d4de" stroke-width="3.4" stroke-linecap="round" opacity="0.9">
    <path d="M440 258 l18 16"/><path d="M844 258 l-18 16"/>
    <path d="M440 476 l18 -16"/><path d="M844 476 l-18 -16"/>
  </g>

  <!-- 消毒范围标注 -->
  <ellipse cx="640" cy="372" rx="72" ry="52" fill="none" stroke="#ffe0b8" stroke-width="1.6"
           stroke-dasharray="7 6" opacity="0.85"/>
  <g font-family="system-ui,-apple-system,'PingFang SC',sans-serif" text-anchor="middle">
    <text x="640" y="366" font-size="16.5" fill="#fff3e2" font-weight="700">消毒范围</text>
    <text x="640" y="388" font-size="12" fill="#ffe8c8" opacity="0.95">以脐为中心</text>
  </g>

  <!-- 监护仪 -->
  <g>
    <rect x="932" y="52" width="206" height="116" rx="10" fill="#07141d" stroke="#2f6d8a" stroke-width="1.4"/>
    <text x="948" y="80" font-size="12" fill="#7fd7c4" font-family="ui-monospace,Menlo,monospace">HR 176</text>
    <text x="1042" y="80" font-size="12" fill="#7fd7c4" font-family="ui-monospace,Menlo,monospace">SpO₂ 97</text>
    <path d="M948 118 h20 l7 -24 l9 40 l8 -28 l7 14 h18 l7 -16 l8 28 l7 -20 h24 l6 10 h22"
          stroke="#3ff0a8" stroke-width="2" fill="none" filter="url(#orGlow)"/>
    <text x="948" y="152" font-size="12" fill="#f2c46a" font-family="ui-monospace,Menlo,monospace">T 36.2 ℃</text>
    <text x="1042" y="152" font-size="11.5" fill="#8fb6c8" font-family="system-ui,'PingFang SC',sans-serif">体温保护中</text>
  </g>

  <!-- 麻醉机 -->
  <g>
    <rect x="42" y="52" width="196" height="116" rx="10" fill="#081924" stroke="#2b5f7d" stroke-width="1.3"/>
    <circle cx="86" cy="92" r="15" fill="none" stroke="#6fb7d0" stroke-width="2"/>
    <circle cx="86" cy="92" r="4.5" fill="#6fb7d0"/>
    <text x="112" y="88" font-size="12" fill="#9fd3e6" font-family="system-ui,'PingFang SC',sans-serif">七氟烷</text>
    <text x="112" y="106" font-size="12" fill="#9fd3e6" font-family="system-ui,'PingFang SC',sans-serif">2.0 %</text>
    <text x="60" y="148" font-size="11.5" fill="#6d9db4" font-family="system-ui,'PingFang SC',sans-serif">麻醉机 · 呼吸回路</text>
  </g>

  <!-- 编号标记 -->
  <g font-family="system-ui,-apple-system,'PingFang SC',sans-serif">
    <circle cx="252" cy="256" r="18" fill="#0b2739" stroke="#5fd0e6" stroke-width="2"/>
    <text x="252" y="263" text-anchor="middle" font-size="16" fill="#9ee8f7" font-weight="600">1</text>
    <path d="M252 274 V312" stroke="#5fd0e6" stroke-width="1.4" opacity="0.6"/>

    <circle cx="640" cy="222" r="18" fill="#2a1a08" stroke="#e0a45c" stroke-width="2"/>
    <text x="640" y="229" text-anchor="middle" font-size="16" fill="#ffcf94" font-weight="600">2</text>
    <path d="M640 240 V286" stroke="#e0a45c" stroke-width="1.4" opacity="0.7"/>

    <circle cx="886" cy="486" r="18" fill="#0b2739" stroke="#5fd0e6" stroke-width="2"/>
    <text x="886" y="493" text-anchor="middle" font-size="16" fill="#9ee8f7" font-weight="600">3</text>
    <path d="M868 486 H840" stroke="#5fd0e6" stroke-width="1.4" opacity="0.55"/>
  </g>

  <!-- 底部三步说明 -->
  <g font-family="system-ui,-apple-system,'PingFang SC',sans-serif">
    <rect x="86" y="556" width="326" height="112" rx="12" fill="#0a1a27" stroke="#26506a" stroke-width="1.2"/>
    <text x="108" y="588" font-size="15.5" fill="#8fe2f5" font-weight="600">① 麻醉</text>
    <text x="108" y="616" font-size="12.8" fill="#b9d3e0">气管插管已固定，麻醉维持平稳</text>
    <text x="108" y="640" font-size="12.8" fill="#b9d3e0">全程监测心率、血氧与体温</text>

    <rect x="427" y="556" width="326" height="112" rx="12" fill="#170f06" stroke="#6b4a1e" stroke-width="1.2"/>
    <text x="449" y="588" font-size="15.5" fill="#ffcf94" font-weight="600">② 消毒</text>
    <text x="449" y="616" font-size="12.8" fill="#e0c7a4">碘伏以脐为中心，由内向外涂布</text>
    <text x="449" y="640" font-size="12.8" fill="#e0c7a4">上至剑突、下至耻骨联合、两侧至腋中线</text>

    <rect x="768" y="556" width="326" height="112" rx="12" fill="#0a1a27" stroke="#26506a" stroke-width="1.2"/>
    <text x="790" y="588" font-size="15.5" fill="#8fe2f5" font-weight="600">③ 铺巾</text>
    <text x="790" y="616" font-size="12.8" fill="#b9d3e0">无菌巾四周封闭，只暴露腹部术野</text>
    <text x="790" y="640" font-size="12.8" fill="#b9d3e0">铺好后不再跨越术野取物</text>
  </g>
</svg>`;

  window.OR_PREP_SVG = SVG;
})();
