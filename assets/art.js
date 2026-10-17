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

  /* 新生儿科医师 —— 白大褂，沉稳 */
  neonatologist() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="新生儿科医师">
      <defs>
        <linearGradient id="pnCoat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F4F8FC"/><stop offset="100%" stop-color="#D5DEE9"/>
        </linearGradient>
        <linearGradient id="pnSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F7D6BA"/><stop offset="100%" stop-color="#E4B592"/>
        </linearGradient>
      </defs>
      <path d="M50,320 Q52,236 94,218 L146,218 Q188,236 190,320 Z" fill="url(#pnCoat)"/>
      <path d="M94,218 L120,258 L146,218" fill="#E8EEF6" stroke="#C2CEDD" stroke-width="2.4"/>
      <path d="M120,258 L120,320" stroke="#C2CEDD" stroke-width="2"/>
      <rect x="104" y="182" width="32" height="44" rx="14" fill="#E0AE8A"/>
      <ellipse cx="120" cy="134" rx="52" ry="60" fill="url(#pnSkin)"/>
      <ellipse cx="68" cy="140" rx="8" ry="13" fill="#E0AE8A"/>
      <ellipse cx="172" cy="140" rx="8" ry="13" fill="#E0AE8A"/>
      <path d="M68,120 Q70,64 120,60 Q170,64 172,120 Q166,90 120,86 Q74,90 68,120 Z" fill="#3A3F4C"/>
      <path d="M84,120 Q100,112 114,118" stroke="#3A3F4C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M126,118 Q140,112 156,120" stroke="#3A3F4C" stroke-width="4" fill="none" stroke-linecap="round"/>
      <ellipse cx="102" cy="138" rx="7" ry="8" fill="#2B3140"/>
      <ellipse cx="138" cy="138" rx="7" ry="8" fill="#2B3140"/>
      <circle cx="104.5" cy="135" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <circle cx="140.5" cy="135" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <g fill="none" stroke="#5E6A7C" stroke-width="2.2">
        <rect x="88" y="128" width="28" height="20" rx="7"/>
        <rect x="124" y="128" width="28" height="20" rx="7"/>
        <path d="M116,138 L124,138"/>
      </g>
      <path d="M120,146 L120,160" stroke="#D09B78" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M110,172 Q120,178 130,172" stroke="#A8605E" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M94,240 Q120,252 146,240" fill="none" stroke="#8FA3BB" stroke-width="3"/>
      <circle cx="120" cy="286" r="11" fill="#7C8DA6"/>
      <circle cx="120" cy="286" r="5" fill="#B9C8DA"/>
    </svg>`;
  },

  /* 新生儿外科医师 —— 白大褂 + 手术帽 */
  surgeon() {
    return `
    <svg viewBox="0 0 240 320" class="portrait-svg" role="img" aria-label="新生儿外科医师">
      <defs>
        <linearGradient id="psCoat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F2F6FB"/><stop offset="100%" stop-color="#D0DAE6"/>
        </linearGradient>
        <linearGradient id="psSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F0CBAE"/><stop offset="100%" stop-color="#DDAE8B"/>
        </linearGradient>
      </defs>
      <path d="M50,320 Q52,236 94,218 L146,218 Q188,236 190,320 Z" fill="url(#psCoat)"/>
      <path d="M94,218 L120,258 L146,218" fill="#E6EDF5" stroke="#BECBDA" stroke-width="2.4"/>
      <rect x="104" y="182" width="32" height="44" rx="14" fill="#DCA882"/>
      <ellipse cx="120" cy="134" rx="52" ry="60" fill="url(#psSkin)"/>
      <ellipse cx="68" cy="140" rx="8" ry="13" fill="#DCA882"/>
      <ellipse cx="172" cy="140" rx="8" ry="13" fill="#DCA882"/>
      <path d="M66,116 Q68,58 120,54 Q172,58 174,116 Q174,86 120,82 Q66,86 66,116 Z" fill="#5B8FC7"/>
      <path d="M66,116 Q92,102 120,104 Q148,102 174,116" fill="none" stroke="#4278B0" stroke-width="3"/>
      <path d="M84,124 Q100,118 114,124" stroke="#3A3F4C" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <path d="M126,124 Q140,118 156,124" stroke="#3A3F4C" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <ellipse cx="102" cy="142" rx="7" ry="8" fill="#2B3140"/>
      <ellipse cx="138" cy="142" rx="7" ry="8" fill="#2B3140"/>
      <circle cx="104.5" cy="139" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <circle cx="140.5" cy="139" r="2.2" fill="#FFFFFF" opacity="0.85"/>
      <path d="M120,150 L120,164" stroke="#CE9873" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M108,176 Q120,182 132,176" stroke="#A8605E" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M94,244 Q120,256 146,244" fill="none" stroke="#8FA3BB" stroke-width="3"/>
      <path d="M62,214 L78,244" stroke="#4278B0" stroke-width="3.4" stroke-linecap="round" opacity="0.7"/>
    </svg>`;
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
    return `
    <svg viewBox="0 0 800 400" class="scene-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="scNicu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#132234"/><stop offset="100%" stop-color="#080F1A"/>
        </linearGradient>
        <radialGradient id="scNicuGlow" cx="62%" cy="42%" r="46%">
          <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.26"/>
          <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#scNicu)"/>
      <rect width="800" height="400" fill="url(#scNicuGlow)"/>

      <!-- 地面线 -->
      <path d="M0,306 L800,306" stroke="#1E3348" stroke-width="2"/>

      <!-- 暖箱 -->
      <g opacity="0.9">
        <rect x="472" y="188" width="212" height="118" rx="14" fill="#0E1B2B" stroke="#2C4A66" stroke-width="2"/>
        <rect x="484" y="200" width="188" height="94" rx="10" fill="#123049" opacity="0.85"/>
        <path d="M500,268 Q560,250 620,268" stroke="#1E4A6B" stroke-width="2" fill="none"/>
        <ellipse cx="578" cy="256" rx="42" ry="18" fill="#1B4A66" opacity="0.55"/>
        <rect x="462" y="302" width="232" height="14" rx="7" fill="#1B2E42"/>
        <rect x="500" y="316" width="14" height="30" fill="#1B2E42"/>
        <rect x="642" y="316" width="14" height="30" fill="#1B2E42"/>
        <circle cx="578" cy="212" r="7" fill="#22D3EE" opacity="0.6"/>
      </g>

      <!-- 监护仪 -->
      <g>
        <rect x="128" y="152" width="176" height="132" rx="10" fill="#0C1826" stroke="#2A445C" stroke-width="2"/>
        <rect x="142" y="166" width="148" height="86" rx="6" fill="#07131F"/>
        <path class="scene-ecg" d="M150,212 L176,212 L184,190 L192,232 L200,212 L246,212 L254,196 L262,228 L270,212 L282,212"
              fill="none" stroke="#22D3EE" stroke-width="2.2" stroke-linecap="round" opacity="0.85"/>
        <rect x="142" y="262" width="46" height="12" rx="6" fill="#1B4A66"/>
        <rect x="196" y="262" width="46" height="12" rx="6" fill="#1B4A66"/>
        <rect x="250" y="262" width="40" height="12" rx="6" fill="#1B4A66"/>
      </g>

      <!-- 输液架 -->
      <g stroke="#26405A" stroke-width="3" opacity="0.8">
        <path d="M360,112 L360,306"/>
        <path d="M338,112 L382,112"/>
        <rect x="346" y="122" width="28" height="46" rx="6" fill="#0E1B2B" stroke-width="2"/>
      </g>

      <!-- 背景设备剪影 -->
      <g opacity="0.34">
        <rect x="40" y="216" width="70" height="90" rx="8" fill="#16293E"/>
        <rect x="716" y="228" width="62" height="78" rx="8" fill="#16293E"/>
      </g>
    </svg>`;
  },

  sceneOR() {
    return `
    <svg viewBox="0 0 800 400" class="scene-svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="scOR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#101C2B"/><stop offset="100%" stop-color="#060A12"/>
        </linearGradient>
        <radialGradient id="scORGlow" cx="50%" cy="26%" r="50%">
          <stop offset="0%" stop-color="#8FE9FF" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#8FE9FF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#scOR)"/>
      <rect width="800" height="400" fill="url(#scORGlow)"/>

      <g>
        <path d="M400,6 L400,52" stroke="#2C3E55" stroke-width="4"/>
        <ellipse cx="400" cy="70" rx="120" ry="32" fill="#0D1826" stroke="#33465E" stroke-width="2"/>
        <ellipse cx="400" cy="70" rx="86" ry="20" fill="#1A2B3E"/>
        <circle cx="352" cy="70" r="8" fill="#CFF3FF" opacity="0.85"/>
        <circle cx="400" cy="76" r="8" fill="#CFF3FF" opacity="0.85"/>
        <circle cx="448" cy="70" r="8" fill="#CFF3FF" opacity="0.85"/>
      </g>

      <!-- 手术台 -->
      <g>
        <rect x="248" y="238" width="304" height="26" rx="8" fill="#132133" stroke="#2A3E56" stroke-width="2"/>
        <rect x="238" y="264" width="324" height="12" rx="5" fill="#16283C"/>
        <rect x="292" y="276" width="14" height="66" fill="#142536"/>
        <rect x="494" y="276" width="14" height="66" fill="#142536"/>
      </g>
      <path d="M0,344 L800,344" stroke="#1B2C40" stroke-width="2"/>

      <!-- 器械台 -->
      <g opacity="0.8">
        <rect x="80" y="268" width="132" height="10" rx="4" fill="#182A3E"/>
        <rect x="88" y="278" width="9" height="64" fill="#142536"/>
        <rect x="196" y="278" width="9" height="64" fill="#142536"/>
      </g>

      <g opacity="0.26">
        <rect x="616" y="204" width="120" height="140" rx="8" fill="#17293D"/>
      </g>
    </svg>`;
  }
};
