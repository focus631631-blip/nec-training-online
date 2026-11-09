/* ============================================================
   立绘与场景 —— SVG 绘制
   ------------------------------------------------------------
   风格：简化半身像 + 剪影场景，AVG 对话系统用
   ============================================================ */

window.ART = {

  /* ============ 人物立绘 ============ */

  /* 年轻父亲 —— 焦虑，便装 */
  father() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="年轻父亲">
      <defs>
        <linearGradient id="pfCloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#46536B"/><stop offset="100%" stop-color="#2E3849"/>
        </linearGradient>
        <linearGradient id="pfSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F6D0B0"/><stop offset="100%" stop-color="#E6B08C"/>
        </linearGradient>
      </defs>
      <path d="M52,320 Q54,238 94,220 L146,220 Q186,238 188,320 Z" fill="url(#pfCloth)"/>
      <path d="M94,220 Q120,248 146,220" fill="none" stroke="#1E2634" stroke-width="3.4"/>
      <rect x="105" y="184" width="30" height="46" rx="13" fill="#E0AA86"/>
      <ellipse cx="120" cy="136" rx="53" ry="61" fill="url(#pfSkin)"/>
      <ellipse cx="67" cy="142" rx="8.5" ry="13" fill="#E0AA86"/>
      <ellipse cx="173" cy="142" rx="8.5" ry="13" fill="#E0AA86"/>
      <path d="M66,122 Q68,66 120,62 Q172,66 174,122 Q170,92 120,88 Q70,92 66,122 Z" fill="#232936"/>
      <path d="M74,110 Q92,96 112,104" stroke="#232936" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      <path d="M128,104 Q148,96 166,110" stroke="#232936" stroke-width="4.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="102" cy="140" rx="7.4" ry="8.6" fill="#252B36"/>
      <ellipse cx="138" cy="140" rx="7.4" ry="8.6" fill="#252B36"/>
      <circle cx="104.5" cy="137" r="2.4" fill="#FFFFFF" opacity="0.85"/>
      <circle cx="140.5" cy="137" r="2.4" fill="#FFFFFF" opacity="0.85"/>
      <path d="M120,148 L120,162" stroke="#D69A76" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="120" cy="178" rx="10" ry="7" fill="#B2585A"/>
      <ellipse cx="86" cy="164" rx="9" ry="6" fill="#E89A9A" opacity="0.28"/>
      <ellipse cx="154" cy="164" rx="9" ry="6" fill="#E89A9A" opacity="0.28"/>
    </svg>`;
  },

  /* 新生儿科医师 —— NICU 手术帽 + 口罩 + 听诊器（插画风） */
  neonatologist() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="新生儿科医师">
      <defs>
        <radialGradient id="nvGlow" cx="50%" cy="38%" r="55%">
          <stop offset="0%" stop-color="#2C6B8A" stop-opacity="0.55"/>
          <stop offset="60%" stop-color="#123247" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#0B1824" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="nvScrub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3C6E8F"/><stop offset="55%" stop-color="#2B5573"/><stop offset="100%" stop-color="#1E3E57"/>
        </linearGradient>
        <linearGradient id="nvSkin" x1="0.2" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stop-color="#F8DCC2"/><stop offset="45%" stop-color="#EFC3A1"/><stop offset="100%" stop-color="#D79A75"/>
        </linearGradient>
        <linearGradient id="nvNeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D89570"/><stop offset="100%" stop-color="#EFA87F"/>
        </linearGradient>
        <linearGradient id="nvCap" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#5FA0C4"/><stop offset="55%" stop-color="#3E7FA6"/><stop offset="100%" stop-color="#2A5D80"/>
        </linearGradient>
        <linearGradient id="nvMask" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#CFE6F2"/><stop offset="55%" stop-color="#A9CFE2"/><stop offset="100%" stop-color="#82AEC6"/>
        </linearGradient>
        <linearGradient id="nvMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E7EEF5"/><stop offset="50%" stop-color="#9FB3C6"/><stop offset="100%" stop-color="#5F7389"/>
        </linearGradient>
        <linearGradient id="nvShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#050A10" stop-opacity="0"/><stop offset="100%" stop-color="#050A10" stop-opacity="0.65"/>
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="128" rx="148" ry="150" fill="url(#nvGlow)"/>
      <path d="M22,320 C26,258 54,232 84,220 L156,220 C186,232 214,258 218,320 Z" fill="url(#nvScrub)"/>
      <path d="M92,222 L120,272 L148,222 L140,216 L120,244 L100,216 Z" fill="#162E42" opacity="0.85"/>
      <path d="M96,224 C104,242 112,254 120,268 C128,254 136,242 144,224" fill="none" stroke="#1B3A50" stroke-width="3"/>
      <path d="M22,320 C26,262 48,238 74,226 C60,250 58,286 60,320 Z" fill="#0E2233" opacity="0.35"/>
      <path d="M218,320 C214,262 192,238 166,226 C180,250 182,286 180,320 Z" fill="#0B1B29" opacity="0.28"/>
      <path d="M102,172 L138,172 L142,226 C134,236 106,236 98,226 Z" fill="url(#nvNeck)"/>
      <path d="M98,214 Q120,228 142,214 L142,230 C132,240 108,240 98,230 Z" fill="#B8724F" opacity="0.55"/>
      <ellipse cx="120" cy="124" rx="49" ry="57" fill="url(#nvSkin)"/>
      <ellipse cx="72" cy="130" rx="8.5" ry="13" fill="#E0A57F"/>
      <ellipse cx="72" cy="130" rx="4" ry="8" fill="#C88A64" opacity="0.6"/>
      <ellipse cx="168" cy="130" rx="8.5" ry="13" fill="#DDA07A"/>
      <path d="M74,128 Q78,164 94,184 Q104,194 120,194 Q136,194 146,184 Q162,164 166,128 Q150,150 120,152 Q90,150 74,128 Z" fill="#C98763" opacity="0.28"/>
      <path d="M70,112 C70,52 170,52 170,112 C170,104 164,96 158,92 C150,86 138,82 120,82 C102,82 90,86 82,92 C76,96 70,104 70,112 Z" fill="url(#nvCap)"/>
      <path d="M70,112 Q120,98 170,112" fill="none" stroke="#8CC3DE" stroke-width="2.4" opacity="0.9"/>
      <path d="M82,92 C90,80 104,74 120,74 C136,74 150,80 158,92" fill="none" stroke="#2A5D80" stroke-width="2" opacity="0.5"/>
      <path d="M96,86 C104,78 114,75 122,75" fill="none" stroke="#A9D6EA" stroke-width="1.6" opacity="0.55"/>
      <path d="M140,80 C148,84 152,90 154,98" fill="none" stroke="#254F6C" stroke-width="1.6" opacity="0.45"/>
      <path d="M86,112 Q96,105 110,110" fill="none" stroke="#4A3A33" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M130,110 Q144,105 154,112" fill="none" stroke="#4A3A33" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M82,124 Q96,117 112,125 Q96,131 82,124 Z" fill="#B87C5C" opacity="0.35"/>
      <path d="M128,124 Q144,117 158,125 Q144,131 128,124 Z" fill="#B87C5C" opacity="0.35"/>
      <path d="M84,124 Q96,118 110,124 Q96,131 84,124 Z" fill="#FBF6F1"/>
      <path d="M130,124 Q144,118 156,124 Q144,131 130,124 Z" fill="#FBF6F1"/>
      <circle cx="97" cy="124" r="5.4" fill="#5B3F34"/><circle cx="143" cy="124" r="5.4" fill="#5B3F34"/>
      <circle cx="97" cy="124" r="2.6" fill="#241612"/><circle cx="143" cy="124" r="2.6" fill="#241612"/>
      <circle cx="95.4" cy="122.2" r="1.6" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="141.4" cy="122.2" r="1.6" fill="#FFFFFF" opacity="0.9"/>
      <path d="M84,124 Q96,118 110,124" fill="none" stroke="#4A3229" stroke-width="2" stroke-linecap="round"/>
      <path d="M130,124 Q144,118 156,124" fill="none" stroke="#4A3229" stroke-width="2" stroke-linecap="round"/>
      <path d="M86,132 Q97,137 109,132" fill="none" stroke="#C98A68" stroke-width="1.4" opacity="0.65"/>
      <path d="M131,132 Q143,137 154,132" fill="none" stroke="#C98A68" stroke-width="1.4" opacity="0.65"/>
      <g fill="none" stroke="#2E3A44" stroke-width="2">
        <rect x="82" y="114" width="32" height="20" rx="7"/>
        <rect x="126" y="114" width="32" height="20" rx="7"/>
        <path d="M114,122 Q120,119 126,122"/>
        <path d="M82,120 L74,118"/><path d="M158,120 L166,118"/>
      </g>
      <path d="M86,118 L94,118" stroke="#EAF6FF" stroke-width="1.4" opacity="0.7"/>
      <path d="M130,118 L138,118" stroke="#EAF6FF" stroke-width="1.4" opacity="0.7"/>
      <path d="M78,138 C78,176 100,196 120,196 C140,196 162,176 162,138 C162,130 154,125 146,128 C136,132 128,135 120,135 C112,135 104,132 94,128 C86,125 78,130 78,138 Z" fill="url(#nvMask)"/>
      <path d="M80,140 C100,150 140,150 160,140" fill="none" stroke="#6E9AB2" stroke-width="1.6" opacity="0.7"/>
      <path d="M84,158 C102,168 138,168 156,158" fill="none" stroke="#6E9AB2" stroke-width="1.4" opacity="0.55"/>
      <path d="M88,174 C104,182 136,182 152,174" fill="none" stroke="#6E9AB2" stroke-width="1.3" opacity="0.45"/>
      <path d="M78,142 C70,138 66,132 66,124" fill="none" stroke="#D8ECF6" stroke-width="2" opacity="0.9"/>
      <path d="M162,142 C170,138 174,132 174,124" fill="none" stroke="#D8ECF6" stroke-width="2" opacity="0.9"/>
      <path d="M104,134 C110,130 130,130 136,134" fill="none" stroke="#4E7C96" stroke-width="1.6" opacity="0.75"/>
      <path d="M92,206 Q120,216 148,206 L148,222 Q120,232 92,222 Z" fill="#0D1E2B" opacity="0.22"/>
      <path d="M86,224 C74,252 78,286 96,300" fill="none" stroke="#1B2733" stroke-width="5.2" stroke-linecap="round"/>
      <path d="M154,224 C166,252 162,286 144,300" fill="none" stroke="#1B2733" stroke-width="5.2" stroke-linecap="round"/>
      <circle cx="120" cy="286" r="12" fill="url(#nvMetal)"/>
      <circle cx="120" cy="286" r="6" fill="#2C3A47"/>
      <circle cx="116" cy="282" r="2" fill="#FFFFFF" opacity="0.5"/>
      <g transform="rotate(-4 158 268)">
        <rect x="140" y="244" width="40" height="52" rx="5" fill="#E9F2F8" opacity="0.92"/>
        <rect x="140" y="244" width="40" height="9" rx="4" fill="#2C7FA8"/>
        <rect x="145" y="259" width="30" height="3" rx="1.5" fill="#9FB4C4"/>
        <rect x="145" y="267" width="24" height="3" rx="1.5" fill="#B9CBD8"/>
        <circle cx="148" cy="285" r="6" fill="#C9DCE8"/>
      </g>
      <rect x="0" y="292" width="240" height="28" fill="url(#nvShadow)"/>
    </svg>
    `;
  },

  /* 新生儿外科医师 —— 手术帽 + 口罩 + 胸卡（插画风） */
  surgeon() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="新生儿外科医师">
      <defs>
        <radialGradient id="sgGlow" cx="45%" cy="36%" r="55%">
          <stop offset="0%" stop-color="#2E6B5E" stop-opacity="0.5"/>
          <stop offset="60%" stop-color="#12302C" stop-opacity="0.16"/>
          <stop offset="100%" stop-color="#0A1A18" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="sgGown" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3E7268"/><stop offset="55%" stop-color="#2C5A53"/><stop offset="100%" stop-color="#1D403C"/>
        </linearGradient>
        <linearGradient id="sgSkin" x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#F0D0AF"/><stop offset="45%" stop-color="#E4B78F"/><stop offset="100%" stop-color="#C98D65"/>
        </linearGradient>
        <linearGradient id="sgNeck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#C4825C"/><stop offset="100%" stop-color="#DFA178"/>
        </linearGradient>
        <linearGradient id="sgCap" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stop-color="#4E9184"/><stop offset="55%" stop-color="#397064"/><stop offset="100%" stop-color="#25514A"/>
        </linearGradient>
        <linearGradient id="sgMask" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stop-color="#D3E8E2"/><stop offset="55%" stop-color="#ACD1CB"/><stop offset="100%" stop-color="#84ACA8"/>
        </linearGradient>
        <linearGradient id="sgMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#EEF3F6"/><stop offset="50%" stop-color="#A6B6BE"/><stop offset="100%" stop-color="#5F7279"/>
        </linearGradient>
        <linearGradient id="sgShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#04090A" stop-opacity="0"/><stop offset="100%" stop-color="#04090A" stop-opacity="0.68"/>
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="126" rx="146" ry="148" fill="url(#sgGlow)"/>
      <path d="M18,320 C24,254 54,228 84,216 L156,216 C186,228 216,254 222,320 Z" fill="url(#sgGown)"/>
      <path d="M96,218 L120,262 L144,218 L137,212 L120,238 L103,212 Z" fill="#102A27" opacity="0.9"/>
      <path d="M98,220 C106,238 113,250 120,260 C127,250 134,238 142,220" fill="none" stroke="#173734" stroke-width="3"/>
      <path d="M18,320 C22,258 46,234 72,222 C58,246 56,282 58,320 Z" fill="#0B211E" opacity="0.38"/>
      <path d="M222,320 C218,258 194,234 168,222 C182,246 184,282 182,320 Z" fill="#081A18" opacity="0.3"/>
      <path d="M103,168 L137,168 L141,222 C133,232 107,232 99,222 Z" fill="url(#sgNeck)"/>
      <path d="M99,210 Q120,224 141,210 L141,226 C131,236 109,236 99,226 Z" fill="#A9683F" opacity="0.55"/>
      <ellipse cx="120" cy="120" rx="50" ry="58" fill="url(#sgSkin)"/>
      <ellipse cx="71" cy="128" rx="8.5" ry="13" fill="#D2946D"/>
      <ellipse cx="169" cy="128" rx="8.5" ry="13" fill="#CE8F68"/>
      <path d="M72,126 Q76,164 92,184 Q103,194 120,194 Q137,194 148,184 Q164,164 168,126 Q151,148 120,150 Q89,148 72,126 Z" fill="#B97950" opacity="0.3"/>
      <path d="M68,108 C68,46 172,46 172,108 C172,100 166,92 160,88 C152,82 138,78 120,78 C102,78 88,82 80,88 C74,92 68,100 68,108 Z" fill="url(#sgCap)"/>
      <path d="M68,108 Q120,94 172,108" fill="none" stroke="#8FC7BB" stroke-width="2.4" opacity="0.9"/>
      <path d="M80,88 C88,76 104,70 120,70 C136,70 152,76 160,88" fill="none" stroke="#1F4A44" stroke-width="2" opacity="0.5"/>
      <path d="M96,82 C104,74 113,71 121,71" fill="none" stroke="#A9D8CD" stroke-width="1.6" opacity="0.55"/>
      <path d="M142,76 C150,80 154,86 156,94" fill="none" stroke="#1D433E" stroke-width="1.6" opacity="0.5"/>
      <path d="M84,106 Q96,100 110,106" fill="none" stroke="#3E2F28" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M130,106 Q144,100 156,106" fill="none" stroke="#3E2F28" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M80,120 Q96,113 112,121 Q96,127 80,120 Z" fill="#A97452" opacity="0.4"/>
      <path d="M128,120 Q144,113 160,121 Q144,127 128,120 Z" fill="#A97452" opacity="0.4"/>
      <path d="M82,120 Q96,114 110,120 Q96,127 82,120 Z" fill="#FBF6F1"/>
      <path d="M130,120 Q144,114 158,120 Q144,127 130,120 Z" fill="#FBF6F1"/>
      <circle cx="96" cy="120" r="5.2" fill="#46332A"/><circle cx="144" cy="120" r="5.2" fill="#46332A"/>
      <circle cx="96" cy="120" r="2.5" fill="#1C1310"/><circle cx="144" cy="120" r="2.5" fill="#1C1310"/>
      <circle cx="94.4" cy="118.2" r="1.5" fill="#FFFFFF" opacity="0.9"/>
      <circle cx="142.4" cy="118.2" r="1.5" fill="#FFFFFF" opacity="0.9"/>
      <path d="M82,120 Q96,114 110,120" fill="none" stroke="#3E2C24" stroke-width="2" stroke-linecap="round"/>
      <path d="M130,120 Q144,114 158,120" fill="none" stroke="#3E2C24" stroke-width="2" stroke-linecap="round"/>
      <path d="M84,127 Q96,132 108,127" fill="none" stroke="#B87C5A" stroke-width="1.3" opacity="0.6"/>
      <path d="M132,127 Q144,132 156,127" fill="none" stroke="#B87C5A" stroke-width="1.3" opacity="0.6"/>
      <path d="M104,124 Q100,130 97,131" fill="none" stroke="#C98A68" stroke-width="1.2" opacity="0.7"/>
      <path d="M136,124 Q140,130 143,131" fill="none" stroke="#C98A68" stroke-width="1.2" opacity="0.7"/>
      <path d="M110,136 Q120,133 130,136" fill="none" stroke="#B47A56" stroke-width="1.6" opacity="0.6"/>
      <path d="M76,134 C76,174 99,195 120,195 C141,195 164,174 164,134 C164,126 156,121 148,124 C138,128 128,131 120,131 C112,131 102,128 92,124 C84,121 76,126 76,134 Z" fill="url(#sgMask)"/>
      <path d="M78,136 C100,146 140,146 162,136" fill="none" stroke="#6E958F" stroke-width="1.7" opacity="0.75"/>
      <path d="M82,154 C102,164 138,164 158,154" fill="none" stroke="#6E958F" stroke-width="1.4" opacity="0.55"/>
      <path d="M87,170 C104,178 136,178 153,170" fill="none" stroke="#6E958F" stroke-width="1.3" opacity="0.45"/>
      <path d="M76,138 C68,134 64,128 64,120" fill="none" stroke="#D9ECE7" stroke-width="2" opacity="0.9"/>
      <path d="M164,138 C172,134 176,128 176,120" fill="none" stroke="#D9ECE7" stroke-width="2" opacity="0.9"/>
      <path d="M104,130 C110,126 130,126 136,130" fill="none" stroke="#4A7A72" stroke-width="1.6" opacity="0.8"/>
      <path d="M92,202 Q120,212 148,202 L148,218 Q120,228 92,218 Z" fill="#0A1E1B" opacity="0.24"/>
      <path d="M24,236 C60,252 180,252 216,236" fill="none" stroke="#4D8177" stroke-width="3" opacity="0.45"/>
      <path d="M40,262 C80,276 160,276 200,262" fill="none" stroke="#3C6E64" stroke-width="2.4" opacity="0.4"/>
      <g transform="rotate(3 78 268)">
        <rect x="58" y="246" width="40" height="50" rx="5" fill="#E7F0EE" opacity="0.9"/>
        <rect x="58" y="246" width="40" height="9" rx="4" fill="#2F7C6E"/>
        <rect x="63" y="261" width="30" height="3" rx="1.5" fill="#9FB8B2"/>
        <rect x="63" y="269" width="24" height="3" rx="1.5" fill="#B9CCC7"/>
        <circle cx="66" cy="287" r="6" fill="#C6DAD5"/>
      </g>
      <rect x="0" y="290" width="240" height="30" fill="url(#sgShadow)"/>
    </svg>
    `;
  },

  /* 学员（本人视角，用于显示自己的话） */
  self() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="学员">
      <defs>
        <linearGradient id="plCoat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F6F9FD"/><stop offset="100%" stop-color="#D8E2ED"/>
        </linearGradient>
        <linearGradient id="plSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F8D8BE"/><stop offset="100%" stop-color="#E6B896"/>
        </linearGradient>
      </defs>
      <path d="M50,320 Q52,236 94,218 L146,218 Q188,236 190,320 Z" fill="url(#plCoat)"/>
      <path d="M94,218 L120,258 L146,218" fill="#EAF0F7" stroke="#C4D0DE" stroke-width="2.4"/>
      <rect x="104" y="182" width="32" height="44" rx="14" fill="#E2B292"/>
      <ellipse cx="120" cy="134" rx="52" ry="60" fill="url(#plSkin)"/>
      <ellipse cx="68" cy="140" rx="8" ry="13" fill="#E2B292"/>
      <ellipse cx="172" cy="140" rx="8" ry="13" fill="#E2B292"/>
      <path d="M68,118 Q70,62 120,58 Q170,62 172,118 Q168,90 120,86 Q72,90 68,118 Z" fill="#2E3442"/>
      <path d="M86,122 Q100,116 114,122" stroke="#2E3442" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M126,122 Q140,116 154,122" stroke="#2E3442" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="102" cy="140" rx="7" ry="8" fill="#2B3140"/>
      <ellipse cx="138" cy="140" rx="7" ry="8" fill="#2B3140"/>
      <circle cx="104.5" cy="137" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <circle cx="140.5" cy="137" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <path d="M120,148 L120,162" stroke="#D29D7A" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M111,174 Q120,179 129,174" stroke="#A8605E" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  },

  /* ============ 场景背景 ============ */

  sceneNICU() {
    return `<div class="scene-photo scene-nicu"
                 style="background-image:url('assets/real/bg_nicu.jpg')"
                 aria-hidden="true"></div>`;
  },

  sceneOR() {
    /* 手术室：无影灯暗场。仅 2 句台词使用，用光晕营造氛围，避免与写实照片风格冲突 */
    return `<div class="scene-or" aria-hidden="true"></div>`;
  }
};
