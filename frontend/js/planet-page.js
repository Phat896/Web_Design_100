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
  ppRenderContent(id);      // replaces ppRenderTabs
  ppRenderNav(id);
  ppInitBreathing();
  ppInitAi(id);
  ppInitAudio(id);
  ppInitYoutube(id);
  ppInitScrollReveal();
  ppInitStarCanvas();
  ppInitCustomWidgets(id);

  // Scroll listener for parallax
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
  if (canvas) ppDrawPlanet(canvas, id, 440);
}

function ppDrawPlanet(canvas, id, size) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  const ctx = canvas.getContext('2d');

  const cx = size/2, cy = size/2, r = size/2 - 2;

  // Try texture image
  const img = new Image();
  let isLoaded = false;
  let offsetX = 0;
  const speed = 0.35; // Adjust rotation speed

  img.onload = () => {
    isLoaded = true;
    if (size <= 40) {
      // Draw statically once for nav dots to save CPU/GPU resources
      ctx.scale(dpr, dpr);
      ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip();
      const scale = Math.max(size/img.width, size/img.height);
      const w=img.width*scale, h=img.height*scale;
      ctx.drawImage(img, cx-w/2, cy-h/2, w, h);
      ppAddSphereShading(ctx, cx, cy, r, id);
      ctx.restore();
      ppAddGlow(ctx, cx, cy, r, id);
    } else {
      // Run continuous render loop for main planet
      tick();
    }
  };

  img.onerror = () => {
    ctx.scale(dpr, dpr);
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

  function tick() {
    if (!isLoaded) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(dpr, dpr);
    
    // Clip to circle sphere
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    
    // Draw sliding texture
    const scale = size / img.height;
    const w = img.width * scale;
    const h = img.height * scale;
    
    offsetX = (offsetX + speed) % w;
    
    ctx.drawImage(img, -offsetX, cy - h/2, w, h);
    if (offsetX > 0) {
      ctx.drawImage(img, w - offsetX, cy - h/2, w, h);
    }
    
    ppAddSphereShading(ctx, cx, cy, r, id);
    ctx.restore();
    
    ctx.save();
    ctx.scale(dpr, dpr);
    ppAddGlow(ctx, cx, cy, r, id);
    ctx.restore();
    
    requestAnimationFrame(tick);
  }
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

// ── ppRenderContent — replaces tab system with direct section rendering ──
function ppRenderContent(id) {
  const ep = PP_EP[id];
  if (!ep) return;

  // Typewriter quote
  const quoteEl = document.getElementById('ppQuote');
  if (quoteEl && ep.quotes && ep.quotes.length > 0) {
    const text = '"' + ep.quotes[Math.floor(Math.random() * ep.quotes.length)] + '"';
    clearInterval(ppTypewriterTimer);
    quoteEl.textContent = '';
    let i = 0;
    ppTypewriterTimer = setInterval(() => {
      if (i < text.length) { quoteEl.textContent += text.charAt(i); i++; }
      else clearInterval(ppTypewriterTimer);
    }, 38);
  }

  // Description
  const descEl = document.getElementById('ppDesc');
  if (descEl) descEl.textContent = PP_DESC[id] || '';

  // Signs (symptoms)
  ppFillSigns('ppSymptoms', ep.symptoms);

  // Causes timeline
  ppFillTimeline('ppCauses', ep.causes);

  // Advice list (reuse signs)
  ppFillSigns('ppAdvice', ep.advice);

  // Actions
  const actEl = document.getElementById('ppActions');
  if (actEl) actEl.innerHTML = ep.actions.map(a =>
    `<div class="pp-action-step"><div class="pp-step-num">${a.step}</div><span class="pp-action-text">${a.text}</span></div>`
  ).join('');
}

// Fill signs/symptoms as icon grid
function ppFillSigns(elId, items) {
  const el = document.getElementById(elId);
  if (!el || !items) return;
  const icons = ['⚡','🌀','💫','🔥','❄️','🌊','💢','🫀'];
  el.innerHTML = items.map((t, i) =>
    `<div class="pp-sign-item"><span class="pp-sign-icon">${icons[i % icons.length]}</span><span class="pp-sign-text">${t}</span></div>`
  ).join('');
}

// Fill causes as timeline
function ppFillTimeline(elId, items) {
  const el = document.getElementById(elId);
  if (!el || !items) return;
  el.innerHTML = items.map((t, i) =>
    `<div class="pp-timeline-item">
      <div class="pp-timeline-dot">0${i+1}</div>
      <div class="pp-timeline-body">
        <div class="pp-timeline-cause-text">${t}</div>
      </div>
    </div>`
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

  // Navbar planet dots
  const navDots = document.querySelector('.pp-nav-planet-nav');
  if (navDots) {
    navDots.innerHTML = PLANETS_ORDER.map(pid => {
      const cls = pid === id ? 'current' : '';
      return `<a href="${pid}.html" class="${cls}" title="${PP_NAMES[pid]}"><canvas data-pid="${pid}" width="18" height="18"></canvas></a>`;
    }).join('');
    navDots.querySelectorAll('canvas').forEach(c => {
      ppDrawPlanet(c, c.dataset.pid, 18);
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

// ── Scroll Reveal ──────────────────────────────────────────
function ppInitScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── Star Canvas ─────────────────────────────────────────────
function ppInitStarCanvas() {
  const canvas = document.getElementById('ppStarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId;
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 220 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.2,
    a: Math.random() * 0.6 + 0.15,
    tw: Math.random() * Math.PI * 2,
    sp: Math.random() * 0.03 + 0.005,
  }));

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.tw += s.sp;
      const alpha = s.a * (0.6 + 0.4 * Math.sin(s.tw));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,225,255,${alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(render);
  };
  render();
}

// ── ppInitTabs (kept for legacy, no-op now) ──────────────────
function ppInitTabs() { /* noop - tabs removed */ }

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

// ── SIGNAL SYSTEM ──
const SIGNAL_LEVELS = [
  { level: 1, multiplier: '1x', name: 'Tiếng thì thầm không gian', icon: '🌑', detail: 'Tần số dao động cực nhỏ, chỉ như một tiếng thì thầm lan tỏa trong hư vô.' },
  { level: 2, multiplier: '2x', name: 'Sóng vô tuyến ổn định', icon: '📻', detail: 'Tín hiệu rõ ràng, phát đi thông điệp cơ bản về tần số cảm xúc hiện tại.' },
  { level: 3, multiplier: '4x', name: 'Bức xạ năng lượng cao', icon: '📡', detail: 'Cường độ gấp đôi trung bình, tỏa ra năng lượng mạnh mẽ gây nhiễu sóng xung quanh.' },
  { level: 4, multiplier: '8x', name: 'Vết lóa mặt trời bùng nổ', icon: '☀️', detail: 'Tín hiệu cực lớn bùng nổ như bão mặt trời, truyền tải năng lượng đi xa hàng triệu năm ánh sáng.' },
  { level: 5, multiplier: '16x', name: 'Siêu tân tinh phát sáng', icon: '💥', detail: 'Cường độ mạnh nhất! Tín hiệu giải phóng năng lượng khổng lồ làm rung chuyển không gian.' },
];

function ppUpdateSignalDesc(level) {
  const data = SIGNAL_LEVELS[level - 1];
  const nameEl = document.getElementById('ppSignalName');
  const detailEl = document.getElementById('ppSignalDetail');
  const barsEl = document.getElementById('ppSignalBars');
  const valEl = document.getElementById('ppSliderVal');
  const descEl = document.getElementById('ppSignalDesc');

  if (nameEl) nameEl.textContent = data.icon + ' ' + data.name + ' (' + data.multiplier + ')';
  if (detailEl) detailEl.textContent = data.detail;
  if (valEl) valEl.textContent = 'Cấp ' + level + ' / 5';
  if (barsEl) {
    barsEl.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const bar = document.createElement('span');
      bar.className = 'bar' + (i <= level ? ' active' : '');
      barsEl.appendChild(bar);
    }
  }
  if (descEl) {
    descEl.className = 'pp-signal-desc';
    descEl.classList.add('level-' + level);
  }
}

function ppInitAi(id) {
  // Dynamic API configuration
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://project-web-bwm.onrender.com/';

  const btn = document.getElementById('ppAiSend');
  const input = document.getElementById('ppAiInput');
  const resp = document.getElementById('ppAiResponse');
  if (!btn||!input||!resp) return;

  // Signal slider with 5-level descriptions
  const slider = document.getElementById('ppSlider');
  if (slider) {
    ppUpdateSignalDesc(parseInt(slider.value) || 3);
    slider.addEventListener('input', () => {
      ppUpdateSignalDesc(parseInt(slider.value));
    });
  }

  // Send signal button
  btn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;

    const signalLevel = slider ? parseInt(slider.value) : 3;
    const token = localStorage.getItem('stellar_auth_token') || null;
    const username = localStorage.getItem('stellar_auth_username') || null;

    // Prepare data
    const bodyData = {
      text: text,
      planet: id,
      signalLevel: signalLevel,
      isAnon: !token,
      author: username || ('Phi_Hanh_Gia_' + Math.floor(Math.random() * 900 + 100))
    };

    // Show loading state
    btn.disabled = true;
    btn.textContent = '📡 ĐANG PHÁT SÓNG...';

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;

      const response = await fetch(API_BASE + '/comments', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (data.success) {
        const levelData = SIGNAL_LEVELS[signalLevel - 1];
        resp.innerHTML = '<div class="pp-signal-success">' +
          '<div class="pp-success-icon">✨</div>' +
          '<div class="pp-success-title">Tín hiệu đã được phát sóng thành công!</div>' +
          '<div class="pp-success-detail">Cường độ: ' + levelData.name + ' (' + levelData.multiplier + ') — Từ ' + (PP_NAMES[id] || id) + '</div>' +
          '<a href="community.html" class="pp-success-link">🌌 Xem tại Trạm Cộng Đồng →</a>' +
          '</div>';
        resp.classList.add('visible');
        input.value = '';
      } else {
        resp.innerHTML = '<div style="color:#ff6060;">⚠️ ' + (data.message || 'Không thể phát tín hiệu. Vui lòng thử lại.') + '</div>';
        resp.classList.add('visible');
      }
    } catch (err) {
      resp.innerHTML = '<div style="color:#ff6060;">⚠️ Không thể kết nối tới trạm vũ trụ. Kiểm tra lại kết nối mạng hoặc khởi động backend.</div>';
      resp.classList.add('visible');
    } finally {
      btn.disabled = false;
      btn.textContent = '📡 GỬI TÍN HIỆU VÀO VŨ TRỤ';
    }
  });
}

// ── CUSTOM EMOTION WIDGETS ──
function ppInitCustomWidgets(id) {
  if (id === 'mercury') ppInitMercuryWidget();
  if (id === 'venus') ppInitVenusWidget();
  if (id === 'earth') ppInitEarthWidget();
  if (id === 'mars') ppInitMarsWidget();
  if (id === 'jupiter') ppInitJupiterWidget();
  if (id === 'saturn') ppInitSaturnWidget();
  if (id === 'uranus') ppInitUranusWidget();
  if (id === 'neptune') ppInitNeptuneWidget();
}

// 1. Mercury (Cô Đơn) - Trạm phát sóng Sonar
function ppInitMercuryWidget() {
  const center = document.getElementById('ppMercuryCenter');
  const radar = document.getElementById('ppMercuryRadar');
  const status = document.getElementById('ppMercuryStatus');
  if (!center || !radar || !status) return;

  let active = false;
  center.addEventListener('click', () => {
    if (active) return;
    active = true;
    
    // Tạo hiệu ứng sóng radar tỏa ra
    const wave = document.createElement('div');
    wave.className = 'pp-sonar-wave';
    radar.appendChild(wave);
    status.innerHTML = '📡 <em>Đang phát sóng vô tuyến tìm kiếm kết nối trong không gian...</em>';

    setTimeout(() => {
      wave.remove();
      status.innerHTML = '✉️ <strong>Tín hiệu hồi đáp nhận được:</strong> "Một phi hành gia khác ở tinh cầu xa xôi nhắn nhủ: Bạn không đơn độc đâu. Vũ trụ bao la nhưng luôn có những tâm hồn cộng hưởng cùng bạn."';
      active = false;
    }, 3000);
  });
}

// 2. Venus (Yêu Thương) - Trắc nghiệm Phong cách Gắn bó (Attachment Style Quiz)
function ppInitVenusWidget() {
  const cards = document.querySelectorAll('.pp-love-quiz-card');
  const result = document.getElementById('ppLoveResult');
  if (!cards.length || !result) return;

  cards.forEach(c => {
    c.addEventListener('click', () => {
      cards.forEach(x => x.classList.remove('selected'));
      c.classList.add('selected');
      const val = c.dataset.value;
      let text = '';
      if (val === 'anxious') {
        text = '🦖 <strong>Phong cách Gắn bó Lo âu (Anxious):</strong> Bạn khao khát kết nối mãnh liệt nhưng hay lo sợ đối phương sẽ xa lánh. Lời khuyên: Hãy nuôi dưỡng sự tự tin nội tại và hiểu rằng bạn xứng đáng được trân trọng và yêu thương một cách ổn định.';
      } else if (val === 'avoidant') {
        text = '🦅 <strong>Phong cách Gắn bó Né tránh (Avoidant):</strong> Bạn đề cao sự độc lập tuyệt đối và có xu hướng khép lòng khi mối quan hệ trở nên quá gần gũi. Lời khuyên: Hãy thử mở lòng từng bước nhỏ, việc chia sẻ sự tổn thương chính là sức mạnh kết nối.';
      } else if (val === 'secure') {
        text = '🌟 <strong>Phong cách Gắn bó An toàn (Secure):</strong> Bạn tự tin khi chia sẻ tình cảm, có khả năng đặt ranh giới lành mạnh và xây dựng mối quan hệ tin cậy. Hãy tiếp tục lan tỏa năng lượng kết nối ấm áp và tích cực này!';
      }
      result.innerHTML = text;
      result.style.display = 'block';
    });
  });
}

// 3. Earth (Lo Âu) - Trạm hít thở tiếp đất
function ppInitEarthWidget() {
  // Box breathing được tích hợp trực tiếp qua ppInitBreathing và liên kết giao diện
  const btn = document.getElementById('ppBreathBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const status = document.getElementById('ppEarthBreathStatus');
      if (status) {
        status.textContent = breathActive ? '🧘 Đang điều hòa sinh học... Hít thở đều' : 'Nhấn nút để bắt đầu bài tập Box Breathing';
      }
    });
  }
}

// 4. Mars (Giận Dữ) - Van xả Áp suất
function ppInitMarsWidget() {
  const btn = document.getElementById('ppMarsAngerBtn');
  const status = document.getElementById('ppMarsAngerStatus');
  if (!btn || !status) return;

  let clicks = 0;
  btn.addEventListener('click', () => {
    if (clicks >= 10) return;
    clicks++;
    
    // Hiệu ứng lò xo nén cơ học
    btn.style.transform = `scale(${1 - clicks * 0.03}) rotate(${Math.sin(clicks) * 12}deg)`;
    
    if (clicks < 10) {
      status.textContent = `Năng lượng tích tụ: Nhấn mạnh ${10 - clicks} lần nữa để xả van hơi nước áp lực!`;
    } else {
      btn.classList.add('pp-anger-cool-state');
      btn.style.transform = 'scale(1.1)';
      btn.innerHTML = '💨 VAN XẢ MỞ';
      status.innerHTML = '💨 <strong>Đã giải phóng áp suất cơ học!</strong> Năng lượng giận dữ dư thừa đã xì hết ra ngoài, trả lại cho bạn sự nguội lạnh, điềm tĩnh và thông suốt.';
    }
  });
}

// 5. Jupiter (Áp Lực) - Hố đen Tiêu biến Gánh nặng
function ppInitJupiterWidget() {
  const cards = document.querySelectorAll('.pp-weight-card');
  const bin = document.getElementById('ppJupiterBlackhole');
  const status = document.getElementById('ppJupiterStatus');
  if (!cards.length || !bin || !status) return;

  let count = 0;
  cards.forEach(c => {
    c.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', c.id);
    });
  });

  bin.addEventListener('dragover', (e) => {
    e.preventDefault();
    bin.style.transform = 'scale(1.15) rotate(10deg)';
    bin.style.boxShadow = '0 0 40px rgba(251, 191, 36, 0.6)';
  });

  bin.addEventListener('dragleave', () => {
    bin.style.transform = 'scale(1) rotate(0deg)';
    bin.style.boxShadow = 'none';
  });

  bin.addEventListener('drop', (e) => {
    e.preventDefault();
    bin.style.transform = 'scale(1) rotate(0deg)';
    bin.style.boxShadow = 'none';
    
    const id = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(id);
    if (card) {
      card.style.transform = 'scale(0) rotate(720deg)';
      card.style.opacity = '0';
      setTimeout(() => { card.remove(); }, 500);
      count++;
      status.textContent = `Đã tiêu hủy gánh nặng: ${count} / ${cards.length}`;
      if (count === cards.length) {
        status.innerHTML = '✨ <strong>Tuyệt vời!</strong> Bạn đã trút bỏ toàn bộ gánh nặng kỳ vọng ảo tưởng. Bạn chỉ thuộc về chính bạn và tự do tự tại.';
      }
    }
  });
}

// 6. Saturn (Trầm Cảm) - Thắp sáng Tinh tú
function ppInitSaturnWidget() {
  const stars = document.querySelectorAll('.pp-saturn-star');
  const svg = document.getElementById('ppSaturnConstSvg');
  const status = document.getElementById('ppSaturnStatus');
  if (!stars.length || !svg || !status) return;

  let activeCount = 0;
  stars.forEach(s => {
    s.addEventListener('click', () => {
      if (s.classList.contains('active')) return;
      s.classList.add('active');
      activeCount++;
      status.textContent = `Tinh tú được thắp sáng: ${activeCount} / 5. Hãy chạm tiếp...`;

      if (activeCount === 5) {
        const points = [];
        stars.forEach(st => {
          const left = parseFloat(st.style.left);
          const top = parseFloat(st.style.top);
          points.push(`${left}%,${top}%`);
        });
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        line.setAttribute('points', points.join(' '));
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', 'rgba(226, 201, 138, 0.9)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '6 6');
        svg.appendChild(line);
        status.innerHTML = '✨ <strong>Chòm sao Hy Vọng đã thắp sáng!</strong> Cơn đóng băng cảm xúc đang được sưởi ấm bằng hành động siêu nhỏ.';
      }
    });
  });
}

// 7. Uranus (Tự Ti) - Lăng kính lọc suy nghĩ
function ppInitUranusWidget() {
  const input = document.getElementById('ppUranusInput');
  const btn = document.getElementById('ppUranusFilterBtn');
  const output = document.getElementById('ppUranusOutput');
  if (!input || !btn || !output) return;

  btn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;

    output.innerHTML = '🔮 <em>Lăng kính đang khúc xạ và phân tích lỗi nhận thức...</em>';
    btn.disabled = true;

    setTimeout(() => {
      let reframing = 'Bạn đang nỗ lực học hỏi và xây dựng bản thân. Bạn không cần phải hoàn hảo để trở nên có giá trị.';
      const lowText = text.toLowerCase();
      if (lowText.includes('kém') || lowText.includes('ngu') || lowText.includes('dốt') || lowText.includes('tệ')) {
        reframing = 'Khả năng học hỏi của bạn là không giới hạn. Sai sót chỉ là dữ liệu để bạn tối ưu hóa cuộc đời.';
      } else if (lowText.includes('xấu') || lowText.includes('mập') || lowText.includes('béo') || lowText.includes('gầy')) {
        reframing = 'Cơ thể bạn là ngôi đền độc nhất che chở tâm hồn. Bạn đáng được trân trọng bởi nét đẹp nguyên bản và sự tử tế.';
      } else if (lowText.includes('thất bại') || lowText.includes('thua') || lowText.includes('hỏng')) {
        reframing = 'Một thất bại chỉ là phép thử sai trong tiến trình phát triển. Nó không định hình giá trị vĩnh viễn của con người bạn.';
      }

      output.innerHTML = `✨ <strong>Lăng kính sự thật phản ánh:</strong> <br> "${reframing}"`;
      btn.disabled = false;
      input.value = '';
    }, 1500);
  });
}

// 8. Neptune (Mất Phương Hướng) - La bàn Giá trị Cốt lõi
function ppInitNeptuneWidget() {
  const items = document.querySelectorAll('.pp-compass-val-item');
  const compass = document.getElementById('ppNeptuneCompass');
  const status = document.getElementById('ppNeptuneCompassStatus');
  if (!items.length || !compass || !status) return;

  let selected = [];
  items.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.dataset.value;
      if (item.classList.contains('selected')) {
        item.classList.remove('selected');
        selected = selected.filter(x => x !== val);
      } else {
        if (selected.length >= 3) return; // Tối đa 3 giá trị
        item.classList.add('selected');
        selected.push(val);
      }

      if (selected.length === 0) {
        status.innerHTML = 'Chọn 3 giá trị sống cốt lõi nhất đối với bạn lúc này để cân chỉnh la bàn.';
        compass.style.transform = 'rotate(0deg)';
      } else {
        const angle = selected.length * 120;
        compass.style.transform = `rotate(${angle}deg)`;
        status.innerHTML = `🧭 <strong>La bàn đã khóa mục tiêu hành trình:</strong> Ưu tiên của bạn là <strong>${selected.join(' &rarr; ')}</strong>. Hãy bám sát 3 giá trị này làm kim chỉ nam trước mọi quyết định.`;
      }
    });
  });
}
