'use strict';

const PLANETS_ORDER = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
let ppTypewriterTimer = null;

const PP_STATS = {
  mercury: { 'Đường kính':'4.879 km', 'Khối lượng':'3,30×10²³ kg', 'Vệ tinh':'0', 'Khoảng cách':'57,9 triệu km', 'Nhiệt độ':'430°C / −180°C', 'Chu kỳ':'88 ngày' },
  venus:   { 'Đường kính':'12.104 km', 'Khối lượng':'4,87×10²⁴ kg', 'Vệ tinh':'0', 'Khoảng cách':'108,2 triệu km', 'Nhiệt độ':'465°C', 'Chu kỳ':'225 ngày' },
  earth:   { 'Đường kính':'12.742 km', 'Khối lượng':'5,97×10²⁴ kg', 'Vệ tinh':'1', 'Khoảng cách':'149,6 triệu km', 'Nhiệt độ':'15°C tb', 'Chu kỳ':'365,25 ngày' },
  mars:    { 'Đường kính':'6.779 km', 'Khối lượng':'6,39×10²³ kg', 'Vệ tinh':'2', 'Khoảng cách':'227,9 triệu km', 'Nhiệt độ':'−28°C tb', 'Chu kỳ':'687 ngày' },
  jupiter: { 'Đường kính':'139.820 km', 'Khối lượng':'1,90×10²⁷ kg', 'Vệ tinh':'95', 'Khoảng cách':'778,5 triệu km', 'Nhiệt độ':'−108°C', 'Chu kỳ':'11,86 năm' },
  saturn:  { 'Đường kính':'116.460 km', 'Khối lượng':'5,68×10²⁶ kg', 'Vệ tinh':'146', 'Khoảng cách':'1,43 tỷ km', 'Nhiệt độ':'−139°C', 'Chu kỳ':'29,46 năm' },
  uranus:  { 'Đường kính':'50.724 km', 'Khối lượng':'8,68×10²⁵ kg', 'Vệ tinh':'28', 'Khoảng cách':'2,87 tỷ km', 'Nhiệt độ':'−197°C', 'Chu kỳ':'84 năm' },
  neptune: { 'Đường kính':'49.244 km', 'Khối lượng':'1,02×10²⁶ kg', 'Vệ tinh':'16', 'Khoảng cách':'4,5 tỷ km', 'Nhiệt độ':'−201°C', 'Chu kỳ':'164,8 năm' },
};

const PP_NAMES = {
  mercury:'SAO THỦY', venus:'SAO KIM', earth:'TRÁI ĐẤT', mars:'SAO HỎA',
  jupiter:'SAO MỘC', saturn:'SAO THỔ', uranus:'SAO THIÊN VƯƠNG', neptune:'SAO HẢI VƯƠNG'
};
const PP_SUBTITLES = {
  mercury:'Hành tinh cận Mặt Trời', venus:'Sao Mai dịu dàng', earth:'Hành tinh xanh của sự sống', mars:'Hành tinh đỏ rực lửa',
  jupiter:'Người khổng lồ của vũ trụ', saturn:'Vành đai huyền bí', uranus:'Người khách băng giá', neptune:'Thế giới xa xôi tăm tối'
};
const PP_COLORS = {
  mercury:['#8a9ca8','#5a6c78','#c0c8d0','#2a3038'], venus:['#ffb6c1','#ffc0cb','#ffd700','#da70d6'],
  earth:['#1a6abf','#2d8a4f','#4a9edf','#89c4e1'], mars:['#ff4500','#dc143c','#8b0000','#4a0404'],
  jupiter:['#f0e68c','#d8bfd8','#9370db','#4b0082'], saturn:['#f0e0b0','#c8b080','#e0c890','#d4c080'],
  uranus:['#a0f0f0','#40c8c8','#7de8e8','#20a0a0'], neptune:['#1040b0','#3080f0','#2060d0','#4090ff']
};
const PP_GLOW = {
  mercury:'#8a9ca8', venus:'#ffb6c1', earth:'#4a9edf', mars:'#ff4500',
  jupiter:'#f0e68c', saturn:'#e8d598', uranus:'#7de8e8', neptune:'#4080ff'
};
const PP_DESC = {
  mercury:'Sao Thủy là hành tinh nhỏ nhất và gần Mặt Trời nhất trong hệ. Bề mặt phủ đầy hố thiên thạch, nhiệt độ dao động cực đoan — ban ngày cực nóng, ban đêm cực lạnh. Giống như cảm giác bồn chồn, mọi thứ thay đổi không ngừng.',
  venus:'Sao Kim là hành tinh nóng nhất, với nhiệt độ bề mặt đủ để nung chảy chì. Lớp khí quyển dày đặc giữ nhiệt như một vòng ôm ấm áp không bao giờ buông tay.',
  earth:'Trái Đất — ngôi nhà duy nhất của chúng ta trong vũ trụ. Với nước lỏng, từ trường bảo vệ và Mặt Trăng giữ ổn định trục quay, Trái Đất nhắc nhở chúng ta về sức mạnh của sự cân bằng.',
  mars:'Sao Hỏa được gọi là Hành tinh Đỏ bởi lớp ôxit sắt bảo phủ. Nơi đây có Olympus Mons — ngọn núi lửa lớn nhất, và Valles Marineris, hẻ thống hẻm núi dài 4.000 km.',
  jupiter:'Sao Mộc là người khổng lồ của hệ mặt trời — tất cả các hành tinh khác có thể nằm gọn trong nó. Vết Đỏ Lớn là cơn bão đã hoành hành hơn 350 năm.',
  saturn:'Sao Thổ nổi tiếng với hệ thống vành đai tuyệt đẹp — được tạo thành từ băng và đá. Hành tinh này nhẹ đến mức có thể nổi trên mặt nước nếu có đại dương đủ lớn.',
  uranus:'Sao Thiên Vương — người khách băng giá quay nghiêng 98° so với quỹ đạo. Nơi đây có bầu khí quyển lạnh nhất trong hệ mặt trời, giống như sự tê liệt của trống rỗng.',
  neptune:'Sao Hải Vương là hành tinh xa nhất, với những cơn gió mạnh nhất lên tới 2.100 km/giờ. Nơi đây tối tăm và bí ẩn như những nỗi sợ chưa ai từng chạm tới.',
};

const PP_TEXTURE = {
  mercury:'mercury.png', venus:'venus.png', earth:'earth.jpg', mars:'mars.png',
  jupiter:'jupiter.png', saturn:'saturn.png', uranus:'uranus.png', neptune:'neptune.png'
};

// EP_DATA is loaded from planets-enhanced.js (same data)
const PP_EP = typeof EP_DATA !== 'undefined' ? EP_DATA : {};
const PP_FEELINGS = typeof EP_FEELINGS !== 'undefined' ? EP_FEELINGS : [];

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  const id = document.body.dataset.planet;
  if (!id) return;

  ppRenderHero(id);
  ppRenderStats(id);
  ppRenderTabs(id);
  ppRenderNav(id);
  ppInitTabs();
  ppInitBreathing();
  ppInitAi(id);
  ppInitAudio(id);
  ppInitYoutube(id);
  
  // Parallax Scroll Listener
  window.addEventListener('scroll', () => {
    document.body.style.setProperty('--scroll-y', `${window.scrollY}px`);
  });
});

function ppRenderHero(id) {
  const el = (s) => document.getElementById(s);
  el('ppName').textContent = PP_NAMES[id] || id.toUpperCase();
  el('ppSubtitle').textContent = PP_SUBTITLES[id] || '';
  const epData = PP_EP[id];
  if (epData) el('ppEmotion').textContent = epData.emotion;

  // Planet canvas
  const canvas = el('ppPlanetCanvas');
  if (canvas) ppDrawPlanet(canvas, id, 220);
}

function ppDrawPlanet(canvas, id, size) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const cx = size/2, cy = size/2, r = size/2 - 2;

  // Try texture image
  const img = new Image();
  img.onload = () => {
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
    const scale = Math.max(size/img.width, size/img.height);
    const w=img.width*scale, h=img.height*scale;
    ctx.drawImage(img, cx-w/2, cy-h/2, w, h);
    ppAddSphereShading(ctx, cx, cy, r, id);
    ctx.restore();
    ppAddGlow(ctx, cx, cy, r, id);
  };
  img.onerror = () => {
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
    const colors = PP_COLORS[id] || ['#888','#444'];
    const g = ctx.createRadialGradient(cx-r*0.3,cy-r*0.3,r*0.05,cx,cy,r);
    colors.forEach((c,i,a) => g.addColorStop(i/(a.length-1||1),c));
    ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
    ppAddSphereShading(ctx, cx, cy, r, id);
    ctx.restore();
    ppAddGlow(ctx, cx, cy, r, id);
  };
  img.src = '../planets/' + PP_TEXTURE[id];
}

function ppAddSphereShading(ctx, cx, cy, r) {
  const vig = ctx.createRadialGradient(cx,cy,r*0.5,cx,cy,r);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.6)');
  ctx.fillStyle = vig; ctx.fillRect(0,0,cx*2,cy*2);
  const spec = ctx.createRadialGradient(cx-r*0.32,cy-r*0.32,0,cx-r*0.2,cy-r*0.2,r*0.55);
  spec.addColorStop(0,'rgba(255,255,255,0.22)'); spec.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(0,0,cx*2,cy*2);
}

function ppAddGlow(ctx, cx, cy, r, id) {
  const glow = PP_GLOW[id] || '#fff';
  ctx.save();
  ctx.shadowColor = glow; ctx.shadowBlur = r*0.35;
  ctx.beginPath(); ctx.arc(cx,cy,r-0.5,0,Math.PI*2);
  ctx.strokeStyle = glow+'55'; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

function ppRenderStats(id) {
  const grid = document.getElementById('ppStats');
  if (!grid) return;
  const stats = PP_STATS[id] || {};
  grid.innerHTML = Object.entries(stats).map(([k,v]) =>
    `<div class="pp-stat-card"><span class="pp-stat-label">${k}</span><span class="pp-stat-value">${v}</span></div>`
  ).join('');
}

function ppRenderTabs(id) {
  const ep = PP_EP[id];
  if (!ep) return;

  // Overview (Typewriter effect for quote)
  const quoteEl = document.getElementById('ppQuote');
  if (quoteEl && ep.quotes && ep.quotes.length > 0) {
    const text = '"' + ep.quotes[Math.floor(Math.random()*ep.quotes.length)] + '"';
    clearInterval(ppTypewriterTimer);
    quoteEl.textContent = '';
    let i = 0;
    ppTypewriterTimer = setInterval(() => {
      if (i < text.length) {
        quoteEl.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(ppTypewriterTimer);
      }
    }, 40);
  }
  const descEl = document.getElementById('ppDesc');
  if (descEl) descEl.textContent = PP_DESC[id] || '';

  // Lists
  ppFillList('ppSymptoms', ep.symptoms, '⚡');
  ppFillList('ppCauses', ep.causes, '🔍');
  ppFillList('ppAdvice', ep.advice, '💡');

  // Actions
  const actEl = document.getElementById('ppActions');
  if (actEl) actEl.innerHTML = ep.actions.map(a =>
    `<div class="pp-action-step"><div class="pp-step-num">${a.step}</div><span>${a.text}</span></div>`
  ).join('');
}

function ppFillList(elId, items, icon) {
  const el = document.getElementById(elId);
  if (!el || !items) return;
  
  if (elId === 'ppCauses') {
    el.classList.add('pp-constellation');
    el.innerHTML = `
      <svg class="pp-const-lines" width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="none">
        <polyline points="15%,75% 50%,25% 85%,60%" fill="none" stroke="rgba(var(--acc-rgb),0.4)" stroke-width="1.5" stroke-dasharray="4 4"/>
      </svg>
      <div class="pp-star-node" style="left: 15%; top: 75%;">
        <div class="pp-star-dot"></div>
        <div class="pp-star-tooltip">${items[0] || ''}</div>
      </div>
      <div class="pp-star-node" style="left: 50%; top: 25%;">
        <div class="pp-star-dot"></div>
        <div class="pp-star-tooltip">${items[1] || ''}</div>
      </div>
      <div class="pp-star-node" style="left: 85%; top: 60%;">
        <div class="pp-star-dot"></div>
        <div class="pp-star-tooltip">${items[2] || ''}</div>
      </div>
    `;
    return;
  }

  el.innerHTML = items.map(t =>
    `<li class="pp-list-item"><span class="pp-list-icon">${icon}</span><span>${t}</span></li>`
  ).join('');
}

function ppRenderNav(id) {
  const idx = PLANETS_ORDER.indexOf(id);
  const dots = document.getElementById('ppDots');
  if (dots) {
    dots.innerHTML = PLANETS_ORDER.map((pid, i) => {
      const cls = pid === id ? 'pp-nav-dot active' : 'pp-nav-dot';
      return `<a href="${pid}.html" class="${cls}" title="${PP_NAMES[pid]}"><canvas data-pid="${pid}" width="20" height="20"></canvas></a>`;
    }).join('');
    dots.querySelectorAll('canvas').forEach(c => {
      ppDrawPlanet(c, c.dataset.pid, 20);
    });
  }
  // Back → always go to main page
  const back = document.getElementById('ppBack');
  if (back) back.addEventListener('click', e => {
    e.preventDefault();
    document.body.classList.add('page-exit');
    setTimeout(() => { location.href = 'index.html'; }, 350);
  });
}

// ── Tabs ──
function ppInitTabs() {
  document.querySelectorAll('.pp-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pp-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pp-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.querySelector(`.pp-tab-panel[data-tab="${btn.dataset.tab}"]`);
      if (panel) panel.classList.add('active');
    });
  });
}

// ── Breathing ──
const BREATH = [
  {name:'Hít vào',cls:'inhale',secs:4},{name:'Giữ lại',cls:'hold',secs:4},
  {name:'Thở ra',cls:'exhale',secs:4},{name:'Nghỉ',cls:'hold',secs:2}
];
let breathActive=false, breathTimer=null, breathIdx=0, breathCycles=0;

function ppInitBreathing() {
  const btn = document.getElementById('ppBreathBtn');
  if (btn) btn.addEventListener('click', ppToggleBreath);
}

function ppToggleBreath() {
  if (breathActive) { ppStopBreath(); return; }
  breathActive=true; breathIdx=0; breathCycles=0;
  const btn = document.getElementById('ppBreathBtn');
  if (btn) btn.textContent='DỪNG LẠI';
  ppRunBreath();
}

function ppRunBreath() {
  if (!breathActive) return;
  const p = BREATH[breathIdx];
  const circle = document.getElementById('ppBreathCircle');
  const label = document.getElementById('ppBreathLabel');
  const timer = document.getElementById('ppBreathTimer');
  if (circle) { circle.className = 'pp-breath-circle ' + p.cls; circle.textContent = p.name; }
  if (label) label.textContent = p.name;
  let s = p.secs;
  if (timer) timer.textContent = s + 's';
  breathTimer = setInterval(() => {
    s--;
    if (timer) timer.textContent = s + 's';
    if (s <= 0) {
      clearInterval(breathTimer);
      breathIdx = (breathIdx+1) % BREATH.length;
      if (breathIdx===0) { breathCycles++; if (breathCycles>=4) { ppStopBreath(); return; } }
      ppRunBreath();
    }
  }, 1000);
}

// ── AUDIO & YOUTUBE MODAL ──
let currentAudio = null;
let isAudioPlaying = false;

function ppInitAudio(id) {
  const btn = document.getElementById('ppAudioToggle');
  if (!btn) return;
  const epData = PP_EP[id];
  if (!epData || !epData.audioUrl) {
    btn.style.display = 'none';
    return;
  }
  
  currentAudio = new Audio(epData.audioUrl);
  currentAudio.loop = true;
  
  btn.addEventListener('click', () => {
    if (isAudioPlaying) {
      currentAudio.pause();
      isAudioPlaying = false;
      btn.textContent = '🎵 Âm Thanh: Tắt';
      btn.classList.remove('active');
    } else {
      currentAudio.play().catch(e => console.log('Audio play failed:', e));
      isAudioPlaying = true;
      btn.textContent = '🎵 Âm Thanh: Bật';
      btn.classList.add('active');
    }
  });
}

function ppInitYoutube(id) {
  const btn = document.getElementById('ppYoutubeBtn');
  const modal = document.getElementById('ppYoutubeModal');
  const closeBtn = document.getElementById('ppModalClose');
  const ytList = document.getElementById('ppYtList');
  
  if (!btn || !modal || !ytList) return;
  
  const epData = PP_EP[id];
  if (!epData || !epData.youtubeLinks || !epData.youtubeLinks.length) {
    btn.style.display = 'none';
    return;
  }
  
  ytList.innerHTML = epData.youtubeLinks.map(link => `
    <li>
      <a href="${link.url}" target="_blank" class="pp-yt-item">
        <span class="pp-yt-title">${link.title}</span>
        <span class="pp-yt-link">${link.url}</span>
      </a>
    </li>
  `).join('');
  
  btn.addEventListener('click', () => {
    modal.classList.add('active');
  });
  
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

function ppStopBreath() {
  breathActive=false; clearInterval(breathTimer);
  const circle = document.getElementById('ppBreathCircle');
  const label = document.getElementById('ppBreathLabel');
  const timer = document.getElementById('ppBreathTimer');
  const btn = document.getElementById('ppBreathBtn');
  if (circle) { circle.className='pp-breath-circle'; circle.textContent='●'; }
  if (label) label.textContent='Nhấn bắt đầu';
  if (timer) timer.textContent='—';
  if (btn) btn.textContent='BẮT ĐẦU';
}

// ── AI ──
function ppInitAi(id) {
  const btn = document.getElementById('ppAiSend');
  const input = document.getElementById('ppAiInput');
  const resp = document.getElementById('ppAiResponse');
  if (!btn||!input||!resp) return;
  btn.addEventListener('click', () => {
    if (!input.value.trim()) return;
    const ep = PP_EP[id];
    const pool = ep?.aiResponses || ['Cảm ơn bạn đã chia sẻ.'];
    resp.textContent = pool[Math.floor(Math.random()*pool.length)];
    resp.classList.add('visible');
    input.value = '';
  });
  const slider = document.getElementById('ppSlider');
  const sliderVal = document.getElementById('ppSliderVal');
  if (slider && sliderVal) {
    slider.addEventListener('input', () => { sliderVal.textContent = slider.value + ' / 10'; });
  }
}
