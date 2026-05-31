/* ================================================================
   SOLAR SYSTEM — Interactive Space Explorer  v2.0
   Full premium interactive orrery with:
   - Accurate camera transform + hit-testing
   - Asteroid belt (Mars–Jupiter)
   - Shooting stars
   - Planet light trails
   - Smooth camera tracking of selected planet
   - Glassmorphism information panel
   - Keyboard shortcuts
   ================================================================ */

'use strict';

// ─────────────────────────────────────
//  PLANET DATA
// ─────────────────────────────────────
const PLANETS = [
  {
    id: 'mercury', name: 'MERCURY', subtitle: 'HÀNH TINH CẬN MẶT TRỜI', type: 'Hành tinh đất đá',
    radius: 5,  orbitRadius: 80,  speed: 0.0241,
    colors: ['#c4a882','#8a7060','#b09070','#4a3828'], angle: 0.5,
    glowColor: '#c4a882',
    stats: { 'Đường kính':'4.879 km', 'Khối lượng':'3,30×10²³ kg', 'Vệ tinh':'0', 'Khoảng cách':'57,9 triệu km', 'Nhiệt độ':'430°C / −180°C', 'Chu kỳ quỹ đạo':'88 ngày' },
    description: 'Hành tinh nhỏ nhất và gần Mặt Trời nhất. Bề mặt đầy hố thiên thạch, Mercury có sự biến động nhiệt độ cực độ — thiêu đốt ban ngày, đóng băng ban đêm — và không có bầu khí quyển để bảo vệ.',
  },
  {
    id: 'venus',   name: 'VENUS',   subtitle: 'SAO MAI DỊU DÀNG',  type: 'Hành tinh đất đá',
    radius: 9,  orbitRadius: 122, speed: 0.0175,
    colors: ['#f0d890','#c8a848','#e0bc60','#8a6010'], angle: 1.2,
    glowColor: '#e8c860',
    stats: { 'Đường kính':'12.104 km', 'Khối lượng':'4,87×10²⁴ kg', 'Vệ tinh':'0', 'Khoảng cách':'108,2 triệu km', 'Nhiệt độ':'465°C', 'Chu kỳ quỹ đạo':'225 ngày' },
    description: 'Hành tinh nóng nhất, với nhiệt độ bề mặt đủ nóng để làm nóng chảy chì. Dù không phải gần Mặt Trời nhất, bầu khí quyển CO₂ dày đặc của Venus giữ nhiệt trong một hiệu ứng nhà kính mất kiểm soát.',
  },
  {
    id: 'earth',   name: 'EARTH',   subtitle: 'HÀNH TINH XANH CỦA SỰ SỐNG',   type: 'Hành tinh đất đá',
    radius: 10, orbitRadius: 168, speed: 0.0150,
    colors: ['#1a6abf','#2d8a4f','#4a9edf','#89c4e1','#1e5c2a'], angle: 0.8,
    glowColor: '#4a9edf',
    stats: { 'Đường kính':'12.742 km', 'Khối lượng':'5,97×10²⁴ kg', 'Vệ tinh':'1', 'Khoảng cách':'149,6 triệu km', 'Nhiệt độ':'15°C trung bình', 'Chu kỳ quỹ đạo':'365,25 ngày' },
    description: 'Ngôi nhà của chúng ta — hành tinh duy nhất được biết đến có sự sống. Earth có nước lỏng, từ trường bảo vệ và một Mặt Trăng giúp ổn định độ nghiêng trục, giúp sự sống phức tạp có thể tồn tại.',
  },
  {
    id: 'mars',    name: 'MARS',    subtitle: 'HÀNH TINH ĐỎ',    type: 'Hành tinh đất đá',
    radius: 7,  orbitRadius: 218, speed: 0.0122,
    colors: ['#d4562a','#9a3010','#c04020','#5a1808'], angle: 2.0,
    glowColor: '#d4562a',
    stats: { 'Đường kính':'6.779 km', 'Khối lượng':'6,39×10²³ kg', 'Vệ tinh':'2', 'Khoảng cách':'227,9 triệu km', 'Nhiệt độ':'−28°C trung bình', 'Chu kỳ quỹ đạo':'687 ngày' },
    description: 'Được gọi là Hành tinh Đỏ nhờ bề mặt giàu oxit sắt. Mars có Olympus Mons — ngọn núi lửa lớn nhất trong hệ Mặt Trời — và Valles Marineris, hệ thống thung lũng dài tới 4.000 km.',
  },
  {
    id: 'jupiter', name: 'JUPITER', subtitle: 'HÀNH TINH KHỔNG LỒ',  type: 'Khổng lồ khí',
    radius: 28, orbitRadius: 298, speed: 0.0065,
    colors: ['#d4a850','#a06828','#c0903c','#e8c070','#8a5820','#d4b460'], angle: 3.4,
    glowColor: '#d4a850',
    stats: { 'Đường kính':'139.820 km', 'Khối lượng':'1,90×10²⁷ kg', 'Vệ tinh':'95', 'Khoảng cách':'778,5 triệu km', 'Nhiệt độ':'−108°C', 'Chu kỳ quỹ đạo':'11,86 năm' },
    description: 'Gã khổng lồ của hệ Mặt Trời — tất cả các hành tinh khác có thể xếp gọn bên trong nó. Vết Đỏ Lớn của Jupiter là một cơn bão lớn gấp đôi Trái Đất, đã hoành hành hơn 350 năm. Lực hấp dẫn mạnh mẽ của nó bảo vệ Earth khỏi các sao chổi.',
  },
  {
    id: 'saturn',  name: 'SATURN',  subtitle: 'HÀNH TINH CÓ VÀNH ĐAI', type: 'Khổng lồ khí',
    radius: 23, orbitRadius: 378, speed: 0.0046,
    colors: ['#f0e0b0','#c8b080','#e0c890','#d4c080','#a09050'], angle: 5.0,
    glowColor: '#e8d598',
    hasRings: true, ringColor: 'rgba(220,195,140,', ringThin: false,
    stats: { 'Đường kính':'116.460 km', 'Khối lượng':'5,68×10²⁶ kg', 'Vệ tinh':'146', 'Khoảng cách':'1,43 tỷ km', 'Nhiệt độ':'−139°C', 'Chu kỳ quỹ đạo':'29,46 năm' },
    description: 'Nổi tiếng với hệ thống vành đai tuyệt đẹp — làm từ băng và đá từ những hạt bụi nhỏ đến những khối lớn bằng ngôi nhà. Saturn nhẹ đến mức nó sẽ nổi trên nước nếu có một đại dương đủ lớn.',
  },
  {
    id: 'uranus',  name: 'URANUS',  subtitle: 'HÀNH TINH BĂNG KHỔNG LỒ',    type: 'Khổng lồ băng',
    radius: 16, orbitRadius: 442, speed: 0.0032,
    colors: ['#a0f0f0','#40c8c8','#7de8e8','#20a0a0'], angle: 1.5,
    glowColor: '#7de8e8',
    hasRings: true, ringColor: 'rgba(120,220,220,', ringThin: true,
    stats: { 'Đường kính':'50.724 km', 'Khối lượng':'8,68×10²⁵ kg', 'Vệ tinh':'28', 'Khoảng cách':'2,87 tỷ km', 'Nhiệt độ':'−197°C', 'Chu kỳ quỹ đạo':'84 năm' },
    description: 'Hành tinh băng khổng lồ tự quay theo chiều nằm ngang, với độ nghiêng trục lên tới 98°. Uranus hầu như không tỏa nhiệt lượng nội tại — tạo nên bầu khí quyển hành tinh lạnh nhất trong hệ Mặt Trời dù nằm gần hơn Neptune.',
  },
  {
    id: 'neptune', name: 'NEPTUNE', subtitle: 'HÀNH TINH XA XÔI', type: 'Khổng lồ băng',
    radius: 15, orbitRadius: 494, speed: 0.0020,
    colors: ['#1040b0','#3080f0','#2060d0','#4090ff','#0830a0'], angle: 4.0,
    glowColor: '#4080ff',
    stats: { 'Đường kính':'49.244 km', 'Khối lượng':'1,02×10²⁶ kg', 'Vệ tinh':'16', 'Khoảng cách':'4,5 tỷ km', 'Nhiệt độ':'−201°C', 'Chu kỳ quỹ đạo':'164,8 năm' },
    description: 'Hành tinh xa xôi nhất, sở hữu những cơn gió mạnh nhất hệ Mặt Trời — lên tới 2.100 km/h. Neptune có một cơn bão khổng lồ gọi là Vết Tối Lớn và vệ tinh Triton của nó có quỹ đạo quay ngược chiều độc đáo.',
  },
];

const SUN = { radius: 44 };

// ─────────────────────────────────────
//  UI PLANET TEXTURE SYSTEM
// ─────────────────────────────────────
const planetTextures = {};
// UI-only planet images. The cinematic solar-system background is locked
// to procedural rendering and must never consume these files.
const TEXTURE_FILES = {
  mercury: '../planets/mercury.png',
  venus:   '../planets/venus.png',
  earth:   '../planets/earth.jpg',
  mars:    '../planets/mars.png',
  jupiter: '../planets/jupiter.png',
  saturn:  '../planets/saturn.png',
  uranus:  '../planets/uranus.png',
  neptune: '../planets/neptune.png',
};

function preloadTextures() {
  return new Promise(resolve => {
    const ids    = Object.keys(TEXTURE_FILES);
    let   loaded = 0;
    const done   = () => { if (++loaded === ids.length) resolve(); };
    ids.forEach(id => {
      const img   = new Image();
      img.onload  = () => { planetTextures[id] = img; done(); };
      img.onerror = done;   // graceful fallback on missing file
      img.src     = TEXTURE_FILES[id];
    });
  });
}

function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(255,255,255,${alpha})`;
  let value = hex.replace('#', '').trim();
  if (value.length === 3) value = value.split('').map(ch => ch + ch).join('');
  const int = Number.parseInt(value.slice(0, 6), 16);
  if (Number.isNaN(int)) return `rgba(255,255,255,${alpha})`;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawImageCover(ctx, img, dx, dy, dw, dh) {
  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;
  if (!sw || !sh) return;

  const scale = Math.max(dw / sw, dh / sh);
  const rw = sw * scale;
  const rh = sh * scale;
  const ox = dx + (dw - rw) / 2;
  const oy = dy + (dh - rh) / 2;
  ctx.drawImage(img, ox, oy, rw, rh);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// ─────────────────────────────────────
//  APPLICATION STATE
// ─────────────────────────────────────
const state = {
  paused:          false,
  speedMultiplier: 1,
  speedLevels:     [0.5, 1, 2, 5],
  speedIndex:      1,

  selectedPlanet:  null,
  hoveredPlanet:   null,
  sidebarOffset:   0,

  camera: { x: 0, y: 0, scale: 1, targetX: 0, targetY: 0, targetScale: 1 },
  mouse:  { x: 0, y: 0 },
  parallax: { x: 0, y: 0 },

  time: 0,
  planets: PLANETS.map(p => ({
    ...p,
    px: Math.cos(p.angle) * p.orbitRadius,
    py: Math.sin(p.angle) * p.orbitRadius * 0.36,
  })),

  asteroids:    [],
  shootingStars:[],
};

// ─────────────────────────────────────
//  CANVAS SETUP
// ─────────────────────────────────────
const starCanvas  = document.getElementById('starfield');
const solarCanvas = document.getElementById('solarSystem');
const starCtx     = starCanvas.getContext('2d');
const solarCtx    = solarCanvas.getContext('2d');

let W = 0, H = 0, CX = 0, CY = 0;

function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  CX = W / 2;
  CY = H / 2;
  starCanvas.width  = solarCanvas.width  = W;
  starCanvas.height = solarCanvas.height = H;
  generateStaticStarfield();
  initParallaxStars();
}

// ─────────────────────────────────────
//  STATIC STARFIELD (star canvas layer)
// ─────────────────────────────────────
function generateStaticStarfield() {
  starCtx.clearRect(0, 0, W, H);
  starCtx.save();
  starCtx.globalCompositeOperation = 'screen';

  const galaxy = starCtx.createLinearGradient(W * 0.12, H * 0.08, W * 0.84, H * 0.74);
  galaxy.addColorStop(0, 'rgba(140,90,255,0)');
  galaxy.addColorStop(0.3, 'rgba(90,140,255,0.035)');
  galaxy.addColorStop(0.5, 'rgba(255,180,120,0.06)');
  galaxy.addColorStop(0.7, 'rgba(90,210,255,0.03)');
  galaxy.addColorStop(1, 'rgba(140,90,255,0)');
  starCtx.translate(W * 0.54, H * 0.42);
  starCtx.rotate(-0.35);
  starCtx.scale(1, 0.22);
  starCtx.beginPath();
  starCtx.ellipse(0, 0, W * 0.44, H * 0.9, 0, 0, Math.PI * 2);
  starCtx.fillStyle = galaxy;
  starCtx.fill();
  starCtx.setTransform(1, 0, 0, 1, 0, 0);

  const clouds = [
    { x: W * 0.16, y: H * 0.22, r: Math.max(W, H) * 0.24, color: 'rgba(70,120,255,0.08)' },
    { x: W * 0.77, y: H * 0.18, r: Math.max(W, H) * 0.22, color: 'rgba(0,220,255,0.055)' },
    { x: W * 0.68, y: H * 0.74, r: Math.max(W, H) * 0.28, color: 'rgba(255,120,60,0.04)' },
    { x: W * 0.3, y: H * 0.82, r: Math.max(W, H) * 0.18, color: 'rgba(100,70,255,0.04)' },
  ];

  for (const cloud of clouds) {
    const glow = starCtx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.r);
    glow.addColorStop(0, cloud.color);
    glow.addColorStop(0.45, cloud.color.replace(/0?\.\d+\)/, '0.028)'));
    glow.addColorStop(1, cloud.color.replace(/0?\.\d+\)/, '0)'));
    starCtx.beginPath();
    starCtx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
    starCtx.fillStyle = glow;
    starCtx.fill();
  }
  starCtx.restore();

  const count = Math.floor(W * H / 1200);
  for (let i = 0; i < count; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random();
    const radius = r < 0.72 ? 0.4 : r < 0.92 ? 0.8 : 1.4;
    const alpha  = 0.25 + Math.random() * 0.75;
    // Occasionally a brighter "diamond" star
    if (Math.random() < 0.04) {
      starCtx.save();
      starCtx.globalAlpha = alpha * 0.9;
      const s = radius * 2.5;
      const grd = starCtx.createRadialGradient(x, y, 0, x, y, s);
      grd.addColorStop(0, '#e8f4ff');
      grd.addColorStop(1, 'rgba(200,230,255,0)');
      starCtx.beginPath(); starCtx.arc(x, y, s, 0, Math.PI * 2);
      starCtx.fillStyle = grd; starCtx.fill();
      starCtx.restore();
    }
    starCtx.beginPath();
    starCtx.arc(x, y, radius, 0, Math.PI * 2);
    const tint = Math.random();
    starCtx.fillStyle = tint < 0.12
      ? `rgba(255,228,196,${alpha})`
      : tint > 0.88
        ? `rgba(180,220,255,${alpha})`
        : `rgba(220,238,255,${alpha})`;
    starCtx.fill();
  }
}

// ─────────────────────────────────────
//  PARALLAX / TWINKLING STARS
// ─────────────────────────────────────
let pxStars = [];
function initParallaxStars() {
  pxStars = [];
  const count = Math.min(220, Math.floor(W * H / 5000));
  for (let i = 0; i < count; i++) {
    pxStars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() < 0.65 ? 0.35 : 0.75,
      a: 0.15 + Math.random() * 0.5,
      pf: 0.018 + Math.random() * 0.07,   // parallax factor
      tp: Math.random() * Math.PI * 2,    // twinkle phase
      ts: 0.4 + Math.random() * 1.2,     // twinkle speed
    });
  }
}

function drawParallaxStars(ctx, px, py, t) {
  ctx.save();
  for (const s of pxStars) {
    const sx = ((s.x + px * s.pf * 60 + W * 10) % W);
    const sy = ((s.y + py * s.pf * 60 + H * 10) % H);
    const tw = 0.65 + 0.35 * Math.sin(t * s.ts + s.tp);
    if (s.r > 0.6) {
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5.5);
      glow.addColorStop(0, `rgba(220,245,255,${s.a * tw * 0.42})`);
      glow.addColorStop(1, 'rgba(220,245,255,0)');
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r * 5.5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }
    ctx.globalAlpha = s.a * tw;
    ctx.beginPath();
    ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
    ctx.fillStyle = '#c8e8ff';
    ctx.fill();
  }
  ctx.restore();
}

function drawDeepSpaceBackdrop(ctx, t) {
  const driftX = state.parallax.x * 32;
  const driftY = state.parallax.y * 24;
  const fields = [
    { x: W * 0.18 + driftX * 0.9, y: H * 0.24 + driftY * 0.7, r: Math.max(W, H) * 0.24, color: 'rgba(70,120,255,0.08)' },
    { x: W * 0.8 + driftX * 0.55, y: H * 0.16 - driftY * 0.4, r: Math.max(W, H) * 0.22, color: 'rgba(0,220,255,0.05)' },
    { x: W * 0.7 - driftX * 0.3, y: H * 0.74 + driftY * 0.4, r: Math.max(W, H) * 0.3, color: 'rgba(255,120,60,0.03)' },
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (const field of fields) {
    const grad = ctx.createRadialGradient(field.x, field.y, 0, field.x, field.y, field.r);
    grad.addColorStop(0, field.color);
    grad.addColorStop(0.55, field.color.replace(/0?\.\d+\)/, '0.018)'));
    grad.addColorStop(1, field.color.replace(/0?\.\d+\)/, '0)'));
    ctx.beginPath();
    ctx.arc(field.x, field.y, field.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.translate(W * 0.57 + driftX * 0.2, H * 0.38 + Math.sin(t * 0.03) * 8);
  ctx.rotate(-0.34);
  ctx.scale(1, 0.18);
  const band = ctx.createLinearGradient(-W * 0.4, 0, W * 0.4, 0);
  band.addColorStop(0, 'rgba(100,180,255,0)');
  band.addColorStop(0.28, 'rgba(120,170,255,0.02)');
  band.addColorStop(0.5, 'rgba(255,196,140,0.06)');
  band.addColorStop(0.72, 'rgba(120,220,255,0.03)');
  band.addColorStop(1, 'rgba(100,180,255,0)');
  ctx.beginPath();
  ctx.ellipse(0, 0, W * 0.42, H * 0.78, 0, 0, Math.PI * 2);
  ctx.fillStyle = band;
  ctx.fill();
  ctx.restore();

  ctx.save();
  const vignette = ctx.createRadialGradient(CX, CY, Math.min(W, H) * 0.18, CX, CY, Math.max(W, H) * 0.75);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.7, 'rgba(0,8,22,0.08)');
  vignette.addColorStop(1, 'rgba(0,4,12,0.26)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

// ─────────────────────────────────────
//  ASTEROID BELT
// ─────────────────────────────────────
function generateAsteroids(count = 260) {
  state.asteroids = [];
  for (let i = 0; i < count; i++) {
    const angle  = Math.random() * Math.PI * 2;
    const spread = 22; // belt width in px
    const r      = 252 + Math.random() * spread;  // between Mars(218) and Jupiter(298)
    state.asteroids.push({
      angle,
      r,
      speed:  (0.0008 + Math.random() * 0.0012) * (Math.random() < 0.5 ? 1 : -1),
      size:   0.4 + Math.random() * 1.4,
      alpha:  0.25 + Math.random() * 0.55,
      color:  Math.random() < 0.5 ? '#a09080' : '#887060',
    });
  }
}

function updateAsteroids() {
  for (const a of state.asteroids) {
    a.angle += a.speed * state.speedMultiplier;
  }
}

function drawAsteroids(ctx, sunX, sunY) {
  ctx.save();
  const ellipseY = 0.36;
  ctx.globalAlpha = 0.65;
  for (const a of state.asteroids) {
    const x = sunX + Math.cos(a.angle) * a.r;
    const y = sunY + Math.sin(a.angle) * a.r * ellipseY;
    ctx.globalAlpha = a.alpha;
    ctx.beginPath();
    ctx.arc(x, y, a.size, 0, Math.PI * 2);
    ctx.fillStyle = a.color;
    ctx.fill();
  }
  ctx.restore();
}

// ─────────────────────────────────────
//  SHOOTING STARS
// ─────────────────────────────────────
function spawnShootingStar() {
  if (state.shootingStars.length >= 4) return;
  const side   = Math.floor(Math.random() * 2); // top or right
  let x, y, vx, vy;
  const speed  = 6 + Math.random() * 10;
  const angle  = (Math.PI / 6) + Math.random() * (Math.PI / 6); // 30–60°
  if (side === 0) { x = Math.random() * W; y = -10; }
  else            { x = W + 10; y = Math.random() * H * 0.6; }
  vx = -Math.cos(angle) * speed;
  vy =  Math.sin(angle) * speed;
  state.shootingStars.push({
    x, y, vx, vy,
    life: 1,
    decay: 0.012 + Math.random() * 0.018,
    len:  60 + Math.random() * 120,
    alpha: 0.7 + Math.random() * 0.3,
  });
}

function updateShootingStars() {
  for (let i = state.shootingStars.length - 1; i >= 0; i--) {
    const s = state.shootingStars[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;
    if (s.life <= 0 || s.x < -50 || s.y > H + 50) {
      state.shootingStars.splice(i, 1);
    }
  }
  if (Math.random() < 0.004) spawnShootingStar();
}

function drawShootingStars(ctx) {
  for (const s of state.shootingStars) {
    const mag   = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
    const nx    = s.vx / mag;
    const ny    = s.vy / mag;
    const tx    = s.x - nx * s.len;
    const ty    = s.y - ny * s.len;

    ctx.save();
    ctx.globalAlpha = s.life * s.alpha;
    const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
    grad.addColorStop(0,   'rgba(200,240,255,0)');
    grad.addColorStop(0.6, 'rgba(180,230,255,0.15)');
    grad.addColorStop(1,   'rgba(255,255,255,0.9)');
    ctx.strokeStyle = grad;
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();

    // Glow head
    const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
    grd.addColorStop(0, 'rgba(220,245,255,0.9)');
    grd.addColorStop(1, 'rgba(100,200,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─────────────────────────────────────
//  PLANET LIGHT TRAILS
// ─────────────────────────────────────
const trails   = [];
const TRAIL_LEN = 55;

function updateTrails() {
  state.planets.forEach((p, i) => {
    if (!trails[i]) trails[i] = [];
    trails[i].push({ x: p.px, y: p.py });
    if (trails[i].length > TRAIL_LEN) trails[i].shift();
  });
}

function drawTrails(ctx, sunX, sunY) {
  state.planets.forEach((p, i) => {
    const trail = trails[i];
    if (!trail || trail.length < 3) return;
    const isActive = i === state.selectedPlanet;
    if (!isActive) return;

    ctx.save();
    for (let j = 2; j < trail.length; j++) {
      const ratio  = j / trail.length;
      const alpha  = ratio * 0.55;
      const width  = p.radius * 0.3 * ratio;
      const t0     = trail[j - 1];
      const t1     = trail[j];
      ctx.globalAlpha = alpha;
      ctx.strokeStyle  = p.glowColor;
      ctx.lineWidth    = width;
      ctx.lineCap      = 'round';
      ctx.beginPath();
      ctx.moveTo(sunX + t0.x, sunY + t0.y);
      ctx.lineTo(sunX + t1.x, sunY + t1.y);
      ctx.stroke();
    }
    ctx.restore();
  });
}

// ─────────────────────────────────────
//  SOLAR FLARE PARTICLES
// ─────────────────────────────────────
const solarParticles = [];
const MAX_SP = 90;

function emitSolarParticle() {
  if (solarParticles.length >= MAX_SP) return;
  const ang   = Math.random() * Math.PI * 2;
  const spd   = 0.15 + Math.random() * 0.55;
  const r     = SUN.radius + 2 + Math.random() * 8;
  solarParticles.push({
    x: Math.cos(ang) * r,
    y: Math.sin(ang) * r,
    vx: Math.cos(ang) * spd,
    vy: Math.sin(ang) * spd,
    life: 1,
    decay: 0.018 + Math.random() * 0.025,
    radius: 0.5 + Math.random() * 1.8,
    hue: 20 + Math.random() * 30, // orange-yellow
  });
}

// Update solar flares
function updateSolarParticles() {
  for (let i = solarParticles.length - 1; i >= 0; i--) {
    const p = solarParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life -= p.decay;
    if (p.life <= 0) solarParticles.splice(i, 1);
  }
}

function drawSolarParticles(ctx, sunX, sunY) {
  ctx.save();
  for (const p of solarParticles) {
    ctx.globalAlpha = p.life * 0.65;
    ctx.beginPath();
    ctx.arc(sunX + p.x, sunY + p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${p.hue}, 100%, ${60 + p.life * 20}%)`;
    ctx.fill();
  }
  ctx.restore();
}

// ─────────────────────────────────────
//  DRAW UTILITIES
// ─────────────────────────────────────

function drawPlanetBands(ctx, x, y, r, colors, t, intensity, tilt) {
  const bandCount = Math.max(colors.length * 2, 6);
  const alpha = intensity ?? 0.8;
  const rotation = tilt ?? -0.12;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  for (let i = 0; i < bandCount; i++) {
    const colorA = colors[i % colors.length];
    const colorB = colors[(i + 1) % colors.length];
    const bandH = (r * 2.35) / bandCount;
    const yy = -r * 1.18 + i * bandH + Math.sin(t * 0.18 + i * 0.95) * r * 0.035;
    const grad = ctx.createLinearGradient(-r * 1.2, yy, r * 1.2, yy + bandH);
    grad.addColorStop(0, hexToRgba(colorA, alpha * 0.12));
    grad.addColorStop(0.2, hexToRgba(colorA, alpha * 0.46));
    grad.addColorStop(0.5, hexToRgba(colorB, alpha * 0.8));
    grad.addColorStop(0.8, hexToRgba(colorA, alpha * 0.36));
    grad.addColorStop(1, hexToRgba(colorA, alpha * 0.1));
    ctx.fillStyle = grad;
    ctx.fillRect(-r * 1.35, yy, r * 2.7, bandH * 1.22);
  }

  ctx.restore();
}

function drawPlanetSpot(ctx, x, y, rx, ry, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, ry / rx);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  grad.addColorStop(0, hexToRgba(color, alpha));
  grad.addColorStop(0.7, hexToRgba(color, alpha * 0.35));
  grad.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, rx, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawProceduralPlanetSurface(ctx, x, y, r, planet, t) {
  const drift = t * planet.speed * 24;
  const base = ctx.createRadialGradient(x - r * 0.4, y - r * 0.42, r * 0.08, x, y, r * 1.02);
  planet.colors.forEach((color, index, list) => {
    base.addColorStop(index / (list.length - 1 || 1), color);
  });
  ctx.fillStyle = base;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  switch (planet.id) {
    case 'mercury':
      drawPlanetBands(ctx, x, y, r, ['#d2b48c', '#8c735d', '#6a5544'], drift, 0.55, -0.08);
      for (let i = 0; i < 10; i++) {
        const ang = i * 0.78 + drift * 0.04;
        const dist = r * (0.14 + (i % 4) * 0.13);
        const cx = x + Math.cos(ang) * dist - r * 0.18;
        const cy = y + Math.sin(ang * 1.4) * dist * 0.62;
        const crater = r * (0.08 + (i % 3) * 0.025);
        drawPlanetSpot(ctx, cx, cy, crater, crater * 0.8, '#4a3828', 0.22);
      }
      break;

    case 'venus':
      drawPlanetBands(ctx, x, y, r, ['#f8edc0', '#ddb567', '#c88f2f', '#f3d590'], drift, 0.95, -0.22);
      drawPlanetSpot(ctx, x - r * 0.08 + Math.sin(drift * 0.12) * r * 0.08, y - r * 0.18, r * 0.8, r * 0.18, '#fff2c8', 0.17);
      drawPlanetSpot(ctx, x + r * 0.2, y + r * 0.1, r * 0.68, r * 0.16, '#fff6da', 0.12);
      break;

    case 'earth': {
      const ocean = ctx.createRadialGradient(x - r * 0.34, y - r * 0.4, 0, x, y, r);
      ocean.addColorStop(0, '#67c8ff');
      ocean.addColorStop(0.42, '#1d78c6');
      ocean.addColorStop(1, '#0b2f70');
      ctx.fillStyle = ocean;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);

      drawPlanetSpot(ctx, x - r * 0.14 + Math.sin(drift * 0.08) * r * 0.05, y - r * 0.02, r * 0.34, r * 0.2, '#2a8d4f', 0.92);
      drawPlanetSpot(ctx, x + r * 0.18, y + r * 0.14, r * 0.24, r * 0.14, '#1f5c2b', 0.82);
      drawPlanetSpot(ctx, x + r * 0.08, y - r * 0.26, r * 0.14, r * 0.08, '#7dcf74', 0.5);

      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.lineWidth = r * 0.12;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(
          x - r * 0.1 + i * r * 0.16,
          y - r * 0.16 + i * r * 0.09,
          r * (0.38 - i * 0.06),
          Math.PI * (0.92 + i * 0.04),
          Math.PI * (1.38 + i * 0.05)
        );
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case 'mars':
      drawPlanetBands(ctx, x, y, r, ['#dd6b36', '#ba3f1f', '#6a1c0c'], drift, 0.5, -0.08);
      drawPlanetSpot(ctx, x - r * 0.16, y - r * 0.12, r * 0.26, r * 0.16, '#6a1c0c', 0.34);
      drawPlanetSpot(ctx, x + r * 0.22, y + r * 0.16, r * 0.18, r * 0.12, '#7f2814', 0.26);
      drawPlanetSpot(ctx, x, y - r * 0.42, r * 0.14, r * 0.08, '#fff1dc', 0.18);
      break;

    case 'jupiter':
      drawPlanetBands(ctx, x, y, r, ['#f0d39a', '#c48b4c', '#9f5f2a', '#e8c38a', '#7c4a20'], drift, 1.15, -0.12);
      drawPlanetSpot(ctx, x + r * 0.18 + Math.sin(drift * 0.06) * r * 0.03, y + r * 0.16, r * 0.34, r * 0.15, '#c56f4d', 0.42);
      drawPlanetSpot(ctx, x + r * 0.19, y + r * 0.16, r * 0.18, r * 0.08, '#f1bc8f', 0.16);
      break;

    case 'saturn':
      drawPlanetBands(ctx, x, y, r, ['#f6ebc0', '#dbc48c', '#c4a76a', '#f1ddae'], drift, 0.84, -0.14);
      drawPlanetSpot(ctx, x - r * 0.12, y - r * 0.18, r * 0.44, r * 0.08, '#fff7dc', 0.11);
      break;

    case 'uranus':
      drawPlanetBands(ctx, x, y, r, ['#d3ffff', '#84ebeb', '#4dc8c8', '#9af5f5'], drift, 0.45, -0.05);
      drawPlanetSpot(ctx, x - r * 0.08, y - r * 0.22, r * 0.5, r * 0.12, '#efffff', 0.08);
      break;

    case 'neptune':
      drawPlanetBands(ctx, x, y, r, ['#5aa4ff', '#2454c6', '#12308f', '#3f82ea'], drift, 0.72, -0.1);
      drawPlanetSpot(ctx, x + r * 0.14, y + r * 0.12, r * 0.22, r * 0.12, '#0a2474', 0.4);
      drawPlanetSpot(ctx, x - r * 0.02, y - r * 0.18, r * 0.45, r * 0.08, '#d7ebff', 0.12);
      break;
  }

  const bounce = ctx.createRadialGradient(x - r * 0.42, y - r * 0.45, 0, x - r * 0.18, y - r * 0.22, r * 0.95);
  bounce.addColorStop(0, 'rgba(255,255,255,0.18)');
  bounce.addColorStop(0.5, 'rgba(255,255,255,0.05)');
  bounce.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = bounce;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  const shadow = ctx.createLinearGradient(x - r * 0.2, y - r * 0.45, x + r * 0.9, y + r * 0.6);
  shadow.addColorStop(0, 'rgba(0,0,0,0)');
  shadow.addColorStop(0.5, 'rgba(0,0,0,0.12)');
  shadow.addColorStop(1, 'rgba(0,0,0,0.56)');
  ctx.fillStyle = shadow;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function getPlanetLightVector(planet) {
  const length = Math.hypot(planet.px, planet.py) || 1;
  return {
    lx: -planet.px / length,
    ly: -planet.py / length,
  };
}

/* Locked background renderer: do not use provided UI planet images here. */
function drawPlanetSphere(ctx, x, y, r, planet, isHovered, isSelected, t) {
  const { glowColor } = planet;
  const { lx, ly } = getPlanetLightVector(planet);

  // ── Selected: pulsing aura + highlight ring
  if (isSelected) {
    const pulse = 0.55 + 0.2 * Math.sin(t * 2.2);
    ctx.save();
    ctx.globalAlpha = pulse;
    const aura = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 3.4);
    aura.addColorStop(0,   glowColor + 'bb');
    aura.addColorStop(0.35, glowColor + '44');
    aura.addColorStop(1,   glowColor + '00');
    ctx.beginPath(); ctx.arc(x, y, r * 3.4, 0, Math.PI * 2);
    ctx.fillStyle = aura; ctx.fill();
    ctx.restore();
    // Pulsing outer ring
    ctx.save();
    ctx.globalAlpha = 0.7 + 0.25 * Math.sin(t * 2.2);
    ctx.beginPath(); ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
    ctx.strokeStyle = glowColor;
    ctx.lineWidth   = 1.8;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur  = 16;
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.arc(x, y, r * 1.48, 0, Math.PI * 2);
    ctx.lineWidth = 0.7; ctx.stroke();
    ctx.restore();
  }

  // ── Hover: soft halo
  if (isHovered && !isSelected) {
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.12 * Math.sin(t * 3);
    const hg = ctx.createRadialGradient(x, y, r * 0.65, x, y, r * 2.6);
    hg.addColorStop(0, glowColor + '70');
    hg.addColorStop(1, glowColor + '00');
    ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2);
    ctx.fillStyle = hg; ctx.fill();
    ctx.restore();
  }

  // ── Planet body: locked procedural render for the cinematic scene
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  drawProceduralPlanetSurface(ctx, x, y, r, planet, t);

  // Directional light from the sun gives the sphere a harder cinematic terminator.
  const diffuse = ctx.createLinearGradient(
    x + lx * r * 0.95, y + ly * r * 0.95,
    x - lx * r * 1.05, y - ly * r * 1.05
  );
  diffuse.addColorStop(0, 'rgba(255,255,255,0.28)');
  diffuse.addColorStop(0.3, 'rgba(255,255,255,0.12)');
  diffuse.addColorStop(0.55, 'rgba(0,0,0,0.02)');
  diffuse.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = diffuse;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  const terminator = ctx.createRadialGradient(
    x - lx * r * 0.32, y - ly * r * 0.32, r * 0.08,
    x - lx * r * 0.12, y - ly * r * 0.12, r * 1.08
  );
  terminator.addColorStop(0, 'rgba(0,0,0,0)');
  terminator.addColorStop(0.58, 'rgba(0,0,0,0.12)');
  terminator.addColorStop(1, 'rgba(0,0,0,0.52)');
  ctx.fillStyle = terminator;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // ── Space atmosphere at limb (thin coloured rim)
  const atm = ctx.createRadialGradient(x, y, r * 0.82, x, y, r);
  atm.addColorStop(0,   'rgba(0,0,0,0)');
  atm.addColorStop(0.7, 'rgba(0,0,0,0.08)');
  atm.addColorStop(1,   glowColor + '30');
  ctx.fillStyle = atm; ctx.fillRect(x-r, y-r, r*2, r*2);

  const lightRim = ctx.createRadialGradient(
    x + lx * r * 0.5, y + ly * r * 0.5, r * 0.08,
    x + lx * r * 0.42, y + ly * r * 0.42, r * 0.9
  );
  lightRim.addColorStop(0, 'rgba(255,255,255,0.22)');
  lightRim.addColorStop(0.45, hexToRgba(glowColor, 0.12));
  lightRim.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = lightRim;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);

  // ── Edge darkening vignette (keeps photos looking spherical)
  const vig = ctx.createRadialGradient(x, y, r * 0.55, x, y, r);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig; ctx.fillRect(x-r, y-r, r*2, r*2);

  // ── Subtle specular highlight (top-left)
  const spec = ctx.createRadialGradient(
    x + lx * r * 0.5,
    y + ly * r * 0.5 - r * 0.12,
    0,
    x + lx * r * 0.26,
    y + ly * r * 0.26,
    r * 0.7
  );
  spec.addColorStop(0, 'rgba(255,255,255,0.22)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(x-r, y-r, r*2, r*2);

  ctx.restore();
}

/* Saturn / Uranus rings */
function drawRings(ctx, x, y, r, color, thin) {
  const tilt  = 0.26;
  const inner = r * 1.32;
  const outer = thin ? r * 1.88 : r * 2.18;
  ctx.save();
  // We draw rings as an ellipse in current transform
  ctx.scale(1, tilt);
  const ys = y / tilt;

  const layers = thin ? 2 : 3;
  for (let i = 0; i < layers; i++) {
    const t_  = i / (layers - 1 || 1);
    const ri  = inner + t_ * (outer - inner) * 0.55;
    const ro  = ri + (outer - inner) * (thin ? 0.28 : 0.22);
    const opa = thin ? [0.28, 0.45] : [0.45, 0.68];
    const rg  = ctx.createRadialGradient(x, ys, ri, x, ys, ro);
    rg.addColorStop(0,   color + opa[0] + ')');
    rg.addColorStop(0.5, color + opa[1] + ')');
    rg.addColorStop(1,   color + '0.1)');
    ctx.beginPath();
    ctx.ellipse(x, ys, ro, ro, 0, 0, Math.PI * 2);
    ctx.ellipse(x, ys, ri, ri, 0, 0, Math.PI * 2);
    ctx.fillStyle = rg;
    ctx.fill('evenodd');
  }
  ctx.restore();
}

/* Sun with corona, flares, and sunspot texture */
function drawSun(ctx, x, y, t) {
  const r = SUN.radius;

  const farBloomR = r * 7.4 + Math.sin(t * 0.42) * r * 0.55;
  const farBloom = ctx.createRadialGradient(x, y, r * 0.25, x, y, farBloomR);
  farBloom.addColorStop(0, 'rgba(255,235,190,0.3)');
  farBloom.addColorStop(0.16, 'rgba(255,170,45,0.22)');
  farBloom.addColorStop(0.42, 'rgba(255,95,0,0.08)');
  farBloom.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.beginPath(); ctx.arc(x, y, farBloomR, 0, Math.PI * 2);
  ctx.fillStyle = farBloom; ctx.fill();

  const outerCoronaR = r * 4.8 + Math.sin(t * 0.85) * r * 0.28;
  const outerCorona = ctx.createRadialGradient(x, y, r * 0.45, x, y, outerCoronaR);
  outerCorona.addColorStop(0, 'rgba(255,228,110,0.86)');
  outerCorona.addColorStop(0.32, 'rgba(255,150,20,0.42)');
  outerCorona.addColorStop(0.75, 'rgba(255,95,0,0.08)');
  outerCorona.addColorStop(1, 'rgba(255,70,0,0)');
  ctx.beginPath(); ctx.arc(x, y, outerCoronaR, 0, Math.PI * 2);
  ctx.fillStyle = outerCorona; ctx.fill();

  const innerCoronaR = r * 2.8 + Math.sin(t * 1.45) * r * 0.18;
  const innerCorona = ctx.createRadialGradient(x, y, r * 0.22, x, y, innerCoronaR);
  innerCorona.addColorStop(0, 'rgba(255,255,220,0.95)');
  innerCorona.addColorStop(0.35, 'rgba(255,210,80,0.58)');
  innerCorona.addColorStop(0.72, 'rgba(255,130,10,0.16)');
  innerCorona.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.beginPath(); ctx.arc(x, y, innerCoronaR, 0, Math.PI * 2);
  ctx.fillStyle = innerCorona; ctx.fill();

  for (let i = 0; i < 14; i++) {
    const ang = t * 0.05 + (i / 14) * Math.PI * 2;
    const rayLen = r * (3.2 + 0.75 * Math.sin(t * 0.7 + i * 1.1));
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    const ray = ctx.createLinearGradient(r * 0.75, 0, rayLen, 0);
    ray.addColorStop(0, 'rgba(255,225,120,0.28)');
    ray.addColorStop(0.4, 'rgba(255,150,40,0.12)');
    ray.addColorStop(1, 'rgba(255,120,0,0)');
    ctx.strokeStyle = ray;
    ctx.lineWidth = 1.2 + (i % 3) * 0.3;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(255,170,60,0.35)';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(r * 0.6, 0);
    ctx.lineTo(rayLen, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Solar prominence arcs
  for (let i = 0; i < 7; i++) {
    const ang = t * 0.10 + (i / 7) * Math.PI * 2;
    const fl  = r * (1.25 + 0.45 * Math.sin(t * (0.4 + i * 0.08) + i * 1.1));
    const fx  = x + Math.cos(ang) * fl;
    const fy  = y + Math.sin(ang) * fl;
    const cx_ = x + Math.cos(ang + 0.55) * r * 0.45;
    const cy_ = y + Math.sin(ang + 0.55) * r * 0.45;
    ctx.save();
    ctx.globalAlpha = 0.16 + 0.1 * Math.sin(t * 0.7 + i * 0.9);
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.quadraticCurveTo(cx_, cy_, fx, fy);
    ctx.strokeStyle = `hsl(${24 + i * 4},100%,65%)`;
    ctx.lineWidth   = 1.8 + Math.sin(t * 0.5 + i) * 0.55;
    ctx.shadowColor = 'rgba(255,180,70,0.45)';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  // Sun sphere gradient
  const sg = ctx.createRadialGradient(x - r * 0.22, y - r * 0.22, r * 0.1, x, y, r);
  sg.addColorStop(0,   '#fff8d0');
  sg.addColorStop(0.25,'#ffe870');
  sg.addColorStop(0.6, '#ff9900');
  sg.addColorStop(1,   '#bb4400');
  ctx.shadowColor = 'rgba(255,180,40,0.45)';
  ctx.shadowBlur = 28;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = sg; ctx.fill();
  ctx.shadowBlur = 0;

  // Sunspot texture
  ctx.save();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  // Dynamic sunspot positions computed below
  for (let i = 0; i < 6; i++) {
    const ax = x + Math.sin(t * 0.28 + i * 2.05) * r * 0.58;
    const ay = y + Math.cos(t * 0.22 + i * 1.78) * r * 0.48;
    const ar = r * (0.08 + 0.06 * Math.abs(Math.sin(t * 0.4 + i)));
    const sp = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
    sp.addColorStop(0, 'rgba(0,0,0,0.25)');
    sp.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2);
    ctx.fillStyle = sp; ctx.fill();
  }
  ctx.restore();

  // Central bright core
  const core = ctx.createRadialGradient(x - r * 0.15, y - r * 0.15, 0, x, y, r * 0.72);
  core.addColorStop(0, 'rgba(255,255,255,0.95)');
  core.addColorStop(0.25, 'rgba(255,250,210,0.72)');
  core.addColorStop(1, 'rgba(255,255,200,0)');
  ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
  ctx.fillStyle = core; ctx.fill();
}

/* Orbit ellipse */
function drawOrbit(ctx, cx, cy, rx, ry, color, isActive, dimmed) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = dimmed ? 'rgba(80,170,255,0.05)' : 'rgba(70,200,255,0.08)';
  ctx.lineWidth = isActive ? 3.8 : 2.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = dimmed ? 'rgba(90,200,255,0.08)' : 'rgba(80,210,255,0.18)';
  ctx.lineWidth = isActive ? 1.6 : 0.95;
  ctx.shadowColor = isActive ? hexToRgba(color, 0.7) : 'rgba(0,210,255,0.35)';
  ctx.shadowBlur = isActive ? 18 : 10;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = isActive ? hexToRgba(color, 0.9) : 'rgba(150,225,255,0.34)';
  ctx.lineWidth = isActive ? 0.95 : 0.55;
  ctx.shadowBlur = 0;
  ctx.stroke();
  ctx.restore();
}

// ─────────────────────────────────────
//  MINI PLANET CANVAS (sidebar + panel icon)
// ─────────────────────────────────────
function drawMiniPlanet(canvas, planet, size) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width  = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2, cy = size / 2, r = size / 2 - 1;

  // Clip to circle
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();

  const tex = planetTextures[planet.id];
  if (tex && tex.complete && tex.naturalWidth > 0) {
    drawImageCover(ctx, tex, 0, 0, size, size);
  } else {
    // Gradient fallback
    const { colors } = planet;
    const g = ctx.createRadialGradient(cx - r*0.3, cy - r*0.3, r*0.05, cx, cy, r);
    (colors || ['#888','#444']).forEach((c, i, a) => g.addColorStop(i/(a.length-1||1), c));
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
  }

  // Vignette to keep it looking spherical
  const vig = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.60)');
  ctx.fillStyle = vig; ctx.fillRect(0, 0, size, size);

  // Atmosphere rim
  const atm = ctx.createRadialGradient(cx, cy, r * 0.82, cx, cy, r);
  atm.addColorStop(0, 'rgba(0,0,0,0)');
  atm.addColorStop(1, planet.glowColor + '40');
  ctx.fillStyle = atm; ctx.fillRect(0, 0, size, size);

  // Specular highlight
  const spec = ctx.createRadialGradient(cx - r*0.32, cy - r*0.32, 0, cx - r*0.2, cy - r*0.2, r*0.55);
  spec.addColorStop(0, 'rgba(255,255,255,0.22)');
  spec.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = spec; ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // Glow border
  ctx.save();
  ctx.shadowColor = planet.glowColor;
  ctx.shadowBlur  = size * 0.22;
  ctx.beginPath(); ctx.arc(cx, cy, r - 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = planet.glowColor + '55';
  ctx.lineWidth   = 1.5;
  ctx.stroke();
  ctx.restore();
}

// ─────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────
function buildSidebar() {
  const scroll = document.getElementById('sidebarScroll');
  if (!scroll) return;
  scroll.innerHTML = '';
  state.planets.forEach((p, i) => {
    const item = document.createElement('button');
    item.className = 'planet-nav-item';
    item.id        = `nav-${p.id}`;
    item.setAttribute('aria-label', `Chọn ${p.name}`);

    const thumbWrap = document.createElement('div');
    thumbWrap.className = 'nav-thumb';
    const tc = document.createElement('canvas');
    tc.className = 'nav-thumb-canvas';
    thumbWrap.appendChild(tc);

    const info = document.createElement('div');
    info.className = 'nav-info';
    info.innerHTML = `<div class="nav-name">${p.name}</div><div class="nav-type">${p.type}</div>`;

    item.appendChild(thumbWrap);
    item.appendChild(info);
    scroll.appendChild(item);

    requestAnimationFrame(() => drawMiniPlanet(tc, p, 28));

    item.addEventListener('click', () => selectPlanet(i));
  });
}

function updateSidebarActive() {
  document.querySelectorAll('.planet-nav-item').forEach((el, i) => {
    el.classList.toggle('active', i === state.selectedPlanet);
  });
}

// Sidebar scroll buttons
const SIDEBAR_ITEM_H = 46;  // 7px pad-top + ~28px content + 7px pad-bottom + 3px gap
const SIDEBAR_VISIBLE = 6;  // show 6 items before needing scroll
const sidebarUpBtn = document.getElementById('sidebarUp');
const sidebarDownBtn = document.getElementById('sidebarDown');

if (sidebarUpBtn) {
  sidebarUpBtn.addEventListener('click', () => {
    state.sidebarOffset = Math.max(0, state.sidebarOffset - 1);
    const scroll = document.getElementById('sidebarScroll');
    if (scroll) {
      scroll.style.transform = `translateY(${-state.sidebarOffset * SIDEBAR_ITEM_H}px)`;
    }
  });
}

if (sidebarDownBtn) {
  sidebarDownBtn.addEventListener('click', () => {
    state.sidebarOffset = Math.min(state.planets.length - SIDEBAR_VISIBLE, state.sidebarOffset + 1);
    const scroll = document.getElementById('sidebarScroll');
    if (scroll) {
      scroll.style.transform = `translateY(${-state.sidebarOffset * SIDEBAR_ITEM_H}px)`;
    }
  });
}

// ─────────────────────────────────────
//  CAMERA SYSTEM
// ─────────────────────────────────────
function updateCamera() {
  const lf = 0.07;
  state.camera.x     += (state.camera.targetX     - state.camera.x)     * lf;
  state.camera.y     += (state.camera.targetY     - state.camera.y)     * lf;
  state.camera.scale += (state.camera.targetScale - state.camera.scale) * lf;
}

function worldToScreen(wx, wy) {
  const { x: cx, y: cy, scale } = state.camera;
  const px = state.parallax.x * 12;
  const py = state.parallax.y * 12;
  return {
    sx: (wx - CX + cx + px) * scale + CX,
    sy: (wy - CY + cy + py) * scale + CY,
  };
}

function selectPlanet(index) {
  if (index === null) {
    state.selectedPlanet = null;
    state.camera.targetX     = 0;
    state.camera.targetY     = 0;
    state.camera.targetScale = 1;
    hidePlanetPanel();
    updateSidebarActive();
    const bottomHint = document.getElementById('bottomHint');
    if (bottomHint) bottomHint.classList.remove('hidden');
    return;
  }

  state.selectedPlanet = index;
  const p              = state.planets[index];

  const ts = 2.2;
  state.camera.targetScale = ts;
  state.camera.targetX     = -p.px;
  state.camera.targetY     = -p.py;

  showPlanetPanel(p, index);
  updateSidebarActive();
  const bottomHint = document.getElementById('bottomHint');
  if (bottomHint) bottomHint.classList.add('hidden');
}

// Track selected planet continuously (its position changes as it orbits)
function trackSelectedPlanet() {
  if (state.selectedPlanet === null) return;
  const p  = state.planets[state.selectedPlanet];
  state.camera.targetX = -p.px;
  state.camera.targetY = -p.py;
}

// ─────────────────────────────────────
//  PLANET INFO PANEL
// ─────────────────────────────────────
function showPlanetPanel(planet, index) {
  // Number badge e.g. "03 / 08"
  const num = String(index + 1).padStart(2, '0');
  const panelNum = document.getElementById('panelNumber');
  if (panelNum) panelNum.textContent = `${num} / 08`;
  const panelName = document.getElementById('panelName');
  if (panelName) panelName.textContent = planet.name;
  const panelSub = document.getElementById('panelSubtitle');
  if (panelSub) panelSub.textContent = planet.subtitle;

  // Planet icon
  const iconWrap = document.getElementById('panelIcon');
  if (iconWrap) {
    iconWrap.innerHTML = '';
    const ic = document.createElement('canvas');
    iconWrap.appendChild(ic);
    drawMiniPlanet(ic, planet, 52);
  }

  // Stats grid
  const statsEl = document.getElementById('panelStats');
  if (statsEl) {
    statsEl.innerHTML = '';
    Object.entries(planet.stats).forEach(([k, v]) => {
      const row = document.createElement('div');
      row.className = 'stat-row';
      row.innerHTML = `<span class="stat-row-label">${k}</span><span class="stat-row-value">${v}</span>`;
      statsEl.appendChild(row);
    });
  }

  const panelDesc = document.getElementById('panelDesc');
  if (panelDesc) panelDesc.textContent = planet.description;

  // CTA → planet detail page
  const ctaBtn = document.getElementById('panelCta');
  if (ctaBtn) ctaBtn.href = `${planet.id}.html`;

  // Planet dots
  buildPlanetDots(index);

  const panel = document.getElementById('planetPanel');
  if (panel) panel.classList.add('visible');
}

function hidePlanetPanel() {
  const panel = document.getElementById('planetPanel');
  if (panel) panel.classList.remove('visible');
}

const panelCloseBtn = document.getElementById('panelClose');
if (panelCloseBtn) {
  panelCloseBtn.addEventListener('click',  () => selectPlanet(null));
}
const prevPlanetBtn = document.getElementById('prevPlanet');
if (prevPlanetBtn) {
  prevPlanetBtn.addEventListener('click',  () => {
    const c = state.selectedPlanet ?? 0;
    selectPlanet((c - 1 + state.planets.length) % state.planets.length);
  });
}
const nextPlanetBtn = document.getElementById('nextPlanet');
if (nextPlanetBtn) {
  nextPlanetBtn.addEventListener('click',  () => {
    const c = state.selectedPlanet ?? -1;
    selectPlanet((c + 1) % state.planets.length);
  });
}

// ─────────────────────────────────────
//  CONTROLS
// ─────────────────────────────────────
const btnPause = document.getElementById('btnPause');
if (btnPause) {
  btnPause.addEventListener('click', () => {
    state.paused = !state.paused;
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    if (pauseIcon) pauseIcon.style.display = state.paused ? 'none' : '';
    if (playIcon) playIcon.style.display  = state.paused ? ''     : 'none';
  });
}

const btnReset = document.getElementById('btnReset');
if (btnReset) {
  btnReset.addEventListener('click', () => selectPlanet(null));
}

// Explore Nav Link logic
const navExplore = document.getElementById('navExplore');
if (navExplore) {
  navExplore.addEventListener('click', (e) => {
    e.preventDefault();
    if (state.selectedPlanet !== null) {
      window.location.href = `${state.planets[state.selectedPlanet].id}.html`;
    } else {
      let lastPlanet = localStorage.getItem('ep_last_planet');
      let indexToSelect = 0;
      if (lastPlanet) {
        const idx = state.planets.findIndex(p => p.id === lastPlanet);
        if (idx !== -1) indexToSelect = idx;
      }
      selectPlanet(indexToSelect);
    }
  });
}

function cycleSpeed() {
  state.speedIndex      = (state.speedIndex + 1) % state.speedLevels.length;
  state.speedMultiplier = state.speedLevels[state.speedIndex];
  updateSpeedHud();
}
const btnSpeed = document.getElementById('btnSpeed');
if (btnSpeed) {
  btnSpeed.addEventListener('click', cycleSpeed);
}

function updateSpeedHud() {
  const m   = state.speedMultiplier;
  const pct = (state.speedIndex + 1) / state.speedLevels.length * 100;
  const speedVal = document.getElementById('speedVal');
  if (speedVal) speedVal.textContent = `${m}\u00d7`;
  const speedBarFill = document.getElementById('speedBarFill');
  if (speedBarFill) speedBarFill.style.width = pct + '%';
}
updateSpeedHud();

// ─────────────────────────────────────
//  PLANET DOTS (inside panel footer)
// ─────────────────────────────────────
function buildPlanetDots(activeIndex) {
  const container = document.getElementById('panelDots');
  if (!container) return;
  container.innerHTML = '';
  state.planets.forEach((p, i) => {
    const dot = document.createElement('div');
    dot.className = 'p-dot' + (i === activeIndex ? ' active' : '');
    dot.title     = p.name;
    dot.setAttribute('aria-label', p.name);
    dot.addEventListener('click', () => selectPlanet(i));
    container.appendChild(dot);
  });
}

// ─────────────────────────────────────
//  KEYBOARD SHORTCUTS OVERLAY
// ─────────────────────────────────────
const shortcutsOverlay = document.getElementById('shortcutsOverlay');
const btnKeys          = document.getElementById('btnKeys');
const shortcutsClose   = document.getElementById('shortcutsClose');

function toggleShortcuts(force) {
  if (!shortcutsOverlay) return;
  const open = force !== undefined ? force : !shortcutsOverlay.classList.contains('open');
  shortcutsOverlay.classList.toggle('open', open);
}

btnKeys        ?.addEventListener('click', () => toggleShortcuts());
shortcutsClose ?.addEventListener('click', () => toggleShortcuts(false));
shortcutsOverlay?.addEventListener('click', e => {
  if (e.target === shortcutsOverlay) toggleShortcuts(false);
});

// ─────────────────────────────────────
//  MOUSE / POINTER INTERACTION
// ─────────────────────────────────────
function planetAtScreen(mx, my) {
  const { x: cx, y: cy, scale } = state.camera;
  const px = state.parallax.x * 12;
  const py = state.parallax.y * 12;
  for (let i = state.planets.length - 1; i >= 0; i--) {
    const p  = state.planets[i];
    const sx = (p.px + cx + px) * scale + CX;
    const sy = (p.py + cy + py) * scale + CY;
    const d  = Math.hypot(mx - sx, my - sy);
    const hr = Math.max(p.radius * scale + 10, 18);
    if (d < hr) return i;
  }
  return null;
}

const tooltip = document.getElementById('tooltip');
if (solarCanvas) {
  solarCanvas.addEventListener('mousemove', e => {
    const mx = e.clientX, my = e.clientY;
    state.mouse.x    = mx;
    state.mouse.y    = my;
    state.parallax.x = (mx - CX) / CX;
    state.parallax.y = (my - CY) / CY;

    const hit = planetAtScreen(mx, my);
    state.hoveredPlanet = hit;
    solarCanvas.style.cursor = hit !== null ? 'pointer' : 'crosshair';

    if (hit !== null && tooltip) {
      const p = state.planets[hit];
      const tooltipName = document.getElementById('tooltipName');
      if (tooltipName) tooltipName.textContent = p.name;
      const tooltipType = document.getElementById('tooltipType');
      if (tooltipType) tooltipType.textContent = p.type;
      let tx = mx + 20, ty = my - 54;
      if (tx + 150 > W) tx = mx - 154;
      if (ty < 8)       ty = my + 18;
      tooltip.style.left = tx + 'px';
      tooltip.style.top  = ty + 'px';
      tooltip.classList.add('show');
    } else if (tooltip) {
      tooltip.classList.remove('show');
    }
  });

  solarCanvas.addEventListener('click', e => {
    const hit = planetAtScreen(e.clientX, e.clientY);
    if (hit !== null) selectPlanet(hit);
    else if (state.selectedPlanet !== null) selectPlanet(null);
  });

  solarCanvas.addEventListener('mouseleave', () => {
    state.hoveredPlanet = null;
    if (tooltip) tooltip.classList.remove('show');
  });
}

// ─────────────────────────────────────
//  KEYBOARD SHORTCUTS
// ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === 'Escape') {
    if (shortcutsOverlay && shortcutsOverlay.classList.contains('open')) {
      toggleShortcuts(false);
      return;
    }
    selectPlanet(null);
  }
  if (e.key === ' ')  {
    e.preventDefault();
    const btn = document.getElementById('btnPause');
    if (btn) btn.click();
  }
  if (e.key === 's' || e.key === 'S') cycleSpeed();
  if (e.key === '?' || e.key === '/') toggleShortcuts();

  if (e.key === 'ArrowRight' && state.selectedPlanet !== null) {
    const btn = document.getElementById('nextPlanet');
    if (btn) btn.click();
  }
  if (e.key === 'ArrowLeft'  && state.selectedPlanet !== null) {
    const btn = document.getElementById('prevPlanet');
    if (btn) btn.click();
  }

  const n = parseInt(e.key);
  if (!isNaN(n) && n >= 1 && n <= 8) selectPlanet(n - 1);
});

// ─────────────────────────────────────
//  MAIN RENDER LOOP
// ─────────────────────────────────────
let lastTime = 0;

function render(ts) {
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;

  if (!state.paused) {
    const sp = state.speedMultiplier;
    state.time += dt * sp;

    state.planets.forEach(p => {
      p.angle += p.speed * sp * dt;
      p.px = Math.cos(p.angle) * p.orbitRadius;
      p.py = Math.sin(p.angle) * p.orbitRadius * 0.36;
    });

    updateAsteroids();
    updateTrails();
    updateSolarParticles();
    updateShootingStars();

    if (Math.random() < 0.35) emitSolarParticle();
  }

  trackSelectedPlanet();
  updateCamera();

  const ctx    = solarCtx;
  if (!ctx) {
    requestAnimationFrame(render);
    return;
  }
  const cam    = state.camera;
  const pxOff  = state.parallax.x * 12;
  const pyOff  = state.parallax.y * 12;

  ctx.clearRect(0, 0, W, H);
  drawDeepSpaceBackdrop(ctx, state.time);

  drawShootingStars(ctx);
  drawParallaxStars(ctx, state.parallax.x, state.parallax.y, state.time);

  ctx.save();
  ctx.translate(CX, CY);
  ctx.scale(cam.scale, cam.scale);
  ctx.translate(-CX + cam.x + pxOff, -CY + cam.y + pyOff);

  const sX = CX;
  const sY = CY;

  if (state.selectedPlanet !== null) {
    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.fillStyle   = '#010812';
    const big = Math.max(W, H) * 6;
    ctx.fillRect(sX - big / 2, sY - big / 2, big, big);
    ctx.restore();
  }

  state.planets.forEach((p, i) => {
    const isActive  = i === state.selectedPlanet;
    const isDimmed  = state.selectedPlanet !== null && !isActive;
    drawOrbit(ctx, sX, sY, p.orbitRadius, p.orbitRadius * 0.36, p.glowColor, isActive, isDimmed);
  });

  if (state.selectedPlanet === null || state.selectedPlanet > 3) {
    ctx.save();
    ctx.globalAlpha = state.selectedPlanet !== null ? 0.25 : 1;
    drawAsteroids(ctx, sX, sY);
    ctx.restore();
  }

  drawTrails(ctx, sX, sY);
  drawSolarParticles(ctx, sX, sY);
  drawSun(ctx, sX, sY, state.time);

  const sorted = state.planets.map((p, i) => ({ ...p, _i: i }))
    .sort((a, b) => a.py - b.py);

  sorted.forEach(pd => {
    const i          = pd._i;
    const isHovered  = i === state.hoveredPlanet;
    const isSelected = i === state.selectedPlanet;
    const isInactive = state.selectedPlanet !== null && !isSelected;
    const orbitDepth = clamp(pd.py / (pd.orbitRadius * 0.36 || 1), -1, 1);
    const perspectiveScale = 1 + orbitDepth * 0.08;
    const distanceFade = clamp((pd.orbitRadius - 120) / 420, 0, 1);
    const depthBlur = clamp((-orbitDepth * 0.7) + distanceFade * 0.35, 0, 1.15);
    const scale_r    = (isHovered && !isSelected ? 1.18 : 1) * perspectiveScale;
    const px         = sX + pd.px;
    const py         = sY + pd.py;
    const visR       = pd.radius * scale_r;

    ctx.save();
    ctx.globalAlpha = (isInactive ? 0.35 : 1) * (0.9 + orbitDepth * 0.06);
    if (!isSelected && depthBlur > 0.05) {
      ctx.filter = `blur(${depthBlur.toFixed(2)}px)`;
    }

    if (pd.hasRings && pd.py >= 0) {
      drawRings(ctx, px, py, visR, pd.ringColor, pd.ringThin);
    }

    drawPlanetSphere(ctx, px, py, visR, pd, isHovered, isSelected, state.time);

    if (pd.hasRings && pd.py < 0) {
      drawRings(ctx, px, py, visR, pd.ringColor, pd.ringThin);
    }

    ctx.restore();
  });

  ctx.restore();

  requestAnimationFrame(render);
}

// ─────────────────────────────────────
//  LOADING SCREEN
// ─────────────────────────────────────
function runLoadingScreen(onComplete) {
  const screen  = document.getElementById('loadingScreen');
  const bar     = document.getElementById('loadingBar');
  const pct     = document.getElementById('loadingPct');
  if (!screen) { onComplete(); return; }

  let progress  = 0;
  const steps   = [
    { target: 18,  delay: 60  },
    { target: 42,  delay: 120 },
    { target: 68,  delay: 180 },
    { target: 85,  delay: 260 },
    { target: 96,  delay: 340 },
    { target: 100, delay: 420 },
  ];

  steps.forEach(({ target, delay }) => {
    setTimeout(() => {
      progress = target;
      if (bar) bar.style.width = progress + '%';
      if (pct) pct.textContent = progress + '%';
      if (progress >= 100) {
        setTimeout(() => {
          screen.classList.add('hidden');
          setTimeout(onComplete, 700);
        }, 300);
      }
    }, delay);
  });
}

// ─────────────────────────────────────
//  INIT
// ─────────────────────────────────────
async function init() {
  resize();
  generateAsteroids(280);

  state.planets.forEach(p => {
    p.px = Math.cos(p.angle) * p.orbitRadius;
    p.py = Math.sin(p.angle) * p.orbitRadius * 0.36;
  });

  requestAnimationFrame(render);

  await Promise.all([
    preloadTextures(),
    new Promise(res => runLoadingScreen(res)),
  ]);

  buildSidebar();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('explore') === 'true') {
    let lastPlanet = localStorage.getItem('ep_last_planet');
    let indexToSelect = 0;
    if (lastPlanet) {
      const idx = state.planets.findIndex(p => p.id === lastPlanet);
      if (idx !== -1) indexToSelect = idx;
    }
    setTimeout(() => {
      selectPlanet(indexToSelect);
    }, 600);
  }
}

if (solarCanvas) {
  window.addEventListener('resize', () => {
    resize();
    buildSidebar();
  });
}

init();
