'use strict';
/* ============================================================
   StellarMind — Emotion Pages Rendering Engine v3.0
   Reads PLANET_DATA from planet-data.js and renders all sections.
   The solar-system canvas is intentionally isolated from this file.
   ============================================================ */

const PLANET_ORDER = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];

/* ---------- UTILITIES ---------- */
const esc = (v) => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const texPath = (t) => `../planets/${t}`;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getApiBase() {
  const h = window.location.hostname;
  return (h === 'localhost' || h === '127.0.0.1' || h === '' || window.location.protocol === 'file:')
    ? 'http://localhost:5000/api'
    : 'https://project-web-bwm.onrender.com/api';
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('vi-VN', { day:'numeric', month:'short', year:'numeric' });
}

function signalAlias() {
  return `Phi_Hanh_Gia_${Math.floor(Math.random() * 900 + 100)}`;
}

/* ---------- RENDER: STICKY NAV ---------- */
function renderNav(p) {
  const links = [
    ['#tong-quan','Tổng quan'],['#dau-hieu','Dấu hiệu'],['#khoa-hoc','Khoa học'],
    ['#cam-xuc','Bản đồ cảm xúc'],['#thuc-hanh','Thực hành'],
    ['#tin-hieu','Gửi tín hiệu'],['#cong-dong','Cộng đồng']
  ];
  return `
  <a class="ep-skip" href="#main">Bỏ qua menu</a>
  <header class="ep-nav" role="navigation">
    <a class="ep-brand" href="#top">
      <img src="${texPath(p.texture)}" alt="Biểu tượng ${p.name}" width="40" height="40">
      <strong>${p.name.toUpperCase()} · ${p.emotion.toUpperCase()}</strong>
    </a>
    <nav class="ep-anchor-nav" aria-label="Mục trong trang">
      ${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
    </nav>
    <a class="ep-home" href="index.html">← Hệ Mặt Trời</a>
  </header>`;
}

/* ---------- RENDER: HERO ---------- */
function renderHero(p) {
  const factsHtml = p.facts.map(f => `
    <div class="ep-fact">
      <div class="ep-fact-icon">${f.icon}</div>
      <b>${f.value}</b><span>${f.label}</span>
    </div>`).join('');

  return `
  <section class="ep-hero" id="top">
    <div class="ep-hero-art"></div>
    <div class="ep-hero-grid">
      <div class="ep-orb-wrap">
        <img class="ep-orb" src="${texPath(p.texture)}" alt="${p.name} trong khung tròn" width="380" height="380" fetchpriority="high">
      </div>
      <div>
        <div class="ep-kicker">Hành tinh cảm xúc · ${p.nameEn}</div>
        <h1 class="ep-title">${p.name}</h1>
        <div class="ep-emotion"><span>${p.emotion}</span><span>—</span><span>${p.emotionEn}</span></div>
        <p class="ep-lede">${p.tagline}</p>
        <div class="ep-facts">${factsHtml}</div>
      </div>
    </div>
  </section>`;
}

/* ---------- RENDER: PLANET–EMOTION CONNECTION ---------- */
function renderConnection(p) {
  const c = p.connection;
  const planetTraits = c.planetTraits.map(t => `<div class="ep-trait-item">${t}</div>`).join('');
  const emotionTraits = c.emotionTraits.map(t => `<div class="ep-trait-item">${t}</div>`).join('');

  return `
  <section class="ep-section" id="tong-quan"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">01 · Tổng quan</div><h2>Vì sao ${p.name} đại diện cho ${p.emotion.toLowerCase()}?</h2></div>
      <p class="ep-section-intro">Mỗi hành tinh mang một tính cách thiên văn gợi liên tưởng đến một trạng thái cảm xúc.</p>
    </div>
    <div class="ep-panel ep-connection-grid ep-reveal">
      <div class="ep-connection-copy">
        <div class="ep-trait-columns">
          <div class="ep-trait-col">
            <h4>Đặc điểm hành tinh</h4>
            ${planetTraits}
          </div>
          <div class="ep-trait-col">
            <h4>Đặc điểm cảm xúc</h4>
            ${emotionTraits}
          </div>
        </div>
        <p>${c.analogy}</p>
        <blockquote class="ep-connection-quote">
          ${c.quote.text}
          <cite>— ${c.quote.author}</cite>
        </blockquote>
      </div>
      <div class="ep-connection-diagram">
        <div class="ep-orbit-stage">
          <span class="ep-orbit-ring ring-one"></span>
          <span class="ep-orbit-ring ring-two"></span>
          <img src="${texPath(p.texture)}" alt="${p.name}" loading="lazy">
        </div>
      </div>
    </div>
  </div></section>`;
}

/* ---------- RENDER: OVERVIEW ---------- */
function renderOverview(p) {
  const o = p.overview;
  const misconceptions = o.misconceptions.map(m =>
    `<div class="ep-misconception">
      <div class="ep-misconception-icon">✕</div>
      <p>${m}</p>
    </div>`).join('');

  return `
  <section class="ep-section"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">02 · Hiểu cảm xúc</div><h2>Bên trong ${p.emotion.toLowerCase()}</h2></div>
      <p class="ep-section-intro">Không phải tất cả ${p.emotion.toLowerCase()} đều có hại. Hiểu bản chất giúp bạn phản ứng phù hợp hơn.</p>
    </div>
    <div class="ep-overview-layout ep-reveal-stagger">
      <div class="ep-overview-block ep-reveal">
        <h3><span class="ep-block-icon">📖</span> ${p.emotion} là gì?</h3>
        <p>${o.what}</p>
      </div>
      <div class="ep-overview-block ep-reveal">
        <h3><span class="ep-block-icon">🧠</span> Vì sao con người trải nghiệm?</h3>
        <p>${o.why}</p>
      </div>
      <div class="ep-overview-block ep-reveal">
        <h3><span class="ep-block-icon">✓</span> Khi nào bình thường?</h3>
        <p>${o.whenNormal}</p>
      </div>
      <div class="ep-overview-block ep-reveal">
        <h3><span class="ep-block-icon">⚠</span> Khi nào cần chú ý?</h3>
        <p>${o.whenHarmful}</p>
      </div>
    </div>
    <div class="ep-misconceptions ep-reveal">
      <h3 style="font: 600 1.1rem var(--ep-font-display); margin-bottom: 14px;">Hiểu lầm phổ biến</h3>
      ${misconceptions}
    </div>
  </div></section>`;
}

/* ---------- RENDER: SIGNS & BODY MAP ---------- */
function renderSigns(p) {
  const categories = [
    { key: 'physical', label: 'Cơ thể', icon: '♡' },
    { key: 'thoughts', label: 'Suy nghĩ', icon: '◎' },
    { key: 'behaviors', label: 'Hành vi', icon: '↻' },
    { key: 'social', label: 'Xã hội', icon: '◇' }
  ];

  const tabs = categories.map((cat, i) =>
    `<button class="ep-signs-tab${i===0?' active':''}" id="sign-tab-${cat.key}" data-tab="${cat.key}" type="button" role="tab" aria-selected="${i===0}" aria-controls="sign-panel-${cat.key}" tabindex="${i===0?0:-1}">${cat.icon} ${cat.label}</button>`
  ).join('');

  const panels = categories.map((cat, i) => {
    const items = (p.signs[cat.key] || []).map(s =>
      `<div class="ep-sign-card"><h4>${esc(s.title)}</h4><p>${esc(s.detail)}</p></div>`
    ).join('');
    return `<div class="ep-signs-panel${i===0?' active':''}" id="sign-panel-${cat.key}" data-panel="${cat.key}" role="tabpanel" aria-labelledby="sign-tab-${cat.key}"${i===0?'':' hidden'}>${items}</div>`;
  }).join('');

  // Body map
  const bodyPoints = (p.bodyMap || []).map((pt, i) => {
    const labelLeft = pt.x > 50 ? `right: ${100 - pt.x + 6}%` : `left: ${pt.x + 6}%`;
    return `
      <div class="ep-pulse-point size-${pt.size || 'md'}" style="left:${pt.x}%;top:${pt.y}%" data-body-point="${i}"></div>
      <span class="ep-pulse-label" style="top:${pt.y}%;${labelLeft}" data-body-label="${i}">${esc(pt.label)}</span>`;
  }).join('');

  const legendItems = (p.bodyMap || []).map((pt, i) =>
    `<div class="ep-legend-item">
      <div class="ep-legend-num">${i+1}</div>
      <p>${esc(pt.label)}</p>
    </div>`
  ).join('');

  return `
  <section class="ep-section" id="dau-hieu"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">03 · Nhận diện</div><h2>Bạn có đang ở tinh cầu này?</h2></div>
      <p class="ep-section-intro">Các dấu hiệu chỉ để tự quan sát, không phải bảng chẩn đoán. Hãy chú ý mức độ, thời gian và ảnh hưởng.</p>
    </div>
    <div class="ep-signs-section ep-reveal">
      <div class="ep-signs-tabs" role="tablist" aria-label="Nhóm dấu hiệu cảm xúc">${tabs}</div>
      ${panels}
    </div>
    <div class="ep-body-map-section ep-reveal" id="bodyMap">
      <div class="ep-body-map-visual" role="img" aria-label="Bản đồ vị trí cảm giác thường gặp trên cơ thể">
        <div class="ep-body-silhouette" aria-hidden="true">
          <i class="head"></i><i class="neck"></i><i class="torso"></i>
          <i class="arms"></i><i class="legs"></i><i class="feet"></i>
        </div>
        ${bodyPoints}
      </div>
      <div class="ep-body-map-legend">${legendItems}</div>
    </div>
  </div></section>`;
}

/* ---------- RENDER: EMOTIONAL LOOP ---------- */
function renderEmotionalLoop(p) {
  const loop = p.emotionalLoop;
  const steps = [
    { key: 'trigger', num: '01' },
    { key: 'bodyResponse', num: '02' },
    { key: 'autoThought', num: '03' },
    { key: 'behavior', num: '04' },
    { key: 'shortTerm', num: '05' },
    { key: 'longTerm', num: '06' }
  ];

  const stepsHtml = steps.map((s, i) => {
    const data = loop[s.key];
    const isIntervention = i === loop.interventionPoint;
    return `
    <div class="ep-loop-step${isIntervention ? ' intervention' : ''}" data-loop-step="${i}">
      <div class="ep-loop-num">${s.num}</div>
      <h4>${esc(data.title)}</h4>
      <p>${esc(data.example)}</p>
      ${isIntervention ? `<div class="ep-intervention-badge">⚡ ${esc(loop.interventionLabel)}</div>` : ''}
      ${i < 5 ? '<span class="ep-loop-arrow">→</span>' : ''}
    </div>`;
  }).join('');

  return `
  <section class="ep-section" id="cam-xuc"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">04 · Bản đồ cảm xúc</div><h2>Vòng lặp duy trì ${p.emotion.toLowerCase()}</h2></div>
      <p class="ep-section-intro">Hiểu cơ chế vòng lặp giúp bạn tìm ra điểm có thể can thiệp thay vì bị cuốn theo phản ứng tự động.</p>
    </div>
    <div class="ep-loop-container ep-reveal">
      <div class="ep-loop-connector" data-loop-line></div>
      <div class="ep-loop-steps ep-reveal-stagger">${stepsHtml}</div>
    </div>
  </div></section>`;
}

/* ---------- RENDER: RESEARCH ---------- */
function renderResearch(p) {
  const cards = p.research.map(r => `
    <article class="ep-research-card ep-reveal">
      <div class="ep-research-org">${esc(r.org)}</div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.summary)}</p>
      <a class="ep-source" href="${r.url}" target="_blank" rel="noopener">${esc(r.source)} ↗</a>
    </article>`).join('');

  return `
  <section class="ep-section ep-science" id="khoa-hoc"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">05 · Nghiên cứu</div><h2>Khoa học nói gì?</h2></div>
      <p class="ep-section-intro">Các kết luận được dẫn nguồn để bạn đọc sâu hơn. Bằng chứng khoa học luôn cần bối cảnh.</p>
    </div>
    <div class="ep-research-grid ep-reveal-stagger">${cards}</div>
    <p class="ep-disclaimer ep-reveal">Nội dung mang tính giáo dục, không thay thế chẩn đoán hoặc điều trị từ chuyên gia sức khỏe tâm thần.</p>
  </div></section>`;
}

/* ---------- RENDER: SCENARIOS ---------- */
function renderScenarios(p) {
  if (!p.scenarios || !p.scenarios.length) return '';

  const scenariosHtml = p.scenarios.map(sc => {
    const steps = [
      { label: 'Tình huống', text: sc.situation },
      { label: 'Suy nghĩ tự động', text: sc.autoThought },
      { label: 'Phản ứng cơ thể', text: sc.physicalResponse },
      { label: 'Phản ứng thông thường', text: sc.typicalReaction },
      { label: 'Lựa chọn lành mạnh hơn', text: sc.healthierAlternative, healthier: true }
    ];

    const stepsHtml = steps.map((s, i) => `
      <div class="ep-scenario-step${s.healthier ? ' healthier' : ''}">
        <div class="ep-scenario-marker">
          <div class="ep-scenario-dot"></div>
          <div class="ep-scenario-line"></div>
        </div>
        <div>
          <div class="ep-scenario-label">${s.label}</div>
          <p>${esc(s.text)}</p>
        </div>
      </div>`).join('');

    return `
    <article class="ep-scenario ep-reveal">
      <div class="ep-scenario-header">
        <div class="ep-scenario-icon">${sc.icon}</div>
        <h4>${esc(sc.context)}</h4>
      </div>
      <div class="ep-scenario-flow">${stepsHtml}</div>
    </article>`;
  }).join('');

  return `
  <section class="ep-section"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">06 · Tình huống thực tế</div><h2>Khi ${p.emotion.toLowerCase()} xuất hiện trong đời sống</h2></div>
      <p class="ep-section-intro">Các kịch bản thực tế giúp bạn nhận diện cảm xúc và hình dung cách phản ứng khác đi.</p>
    </div>
    <div class="ep-scenarios-grid">${scenariosHtml}</div>
  </div></section>`;
}

/* ---------- RENDER: PRACTICE ---------- */
function renderPractice(p) {
  const pr = p.practice;
  const stepsHtml = pr.steps ? `<ol>${pr.steps.map(s =>
    `<li><strong>${esc(s.label)}</strong><br>${esc(s.instruction)}</li>`).join('')}</ol>` : '';

  return `
  <section class="ep-section" id="thuc-hanh"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">07 · Thực hành riêng</div><h2>${esc(pr.title)}</h2></div>
      <p class="ep-section-intro">Mỗi hành tinh có phương pháp riêng, phù hợp với cơ chế của cảm xúc thay vì dùng chung một bài tập.</p>
    </div>
    <div class="ep-practice-layout">
      <article class="ep-panel ep-practice-copy ep-reveal">
        <h3>Cách thực hiện</h3>
        ${pr.description ? `<p>${pr.description}</p>` : ''}
        ${stepsHtml}
        ${p.crisis ? '<div class="ep-crisis"><strong>Nếu bạn có ý nghĩ tự làm hại hoặc đang không an toàn:</strong> hãy liên hệ ngay một người đáng tin, chuyên gia, dịch vụ cấp cứu địa phương hoặc đến cơ sở y tế gần nhất.</div>' : ''}
      </article>
      <article class="ep-panel ep-lab ep-reveal" id="practiceLab"></article>
    </div>
  </div></section>`;
}

/* ---------- RENDER: SIGNAL STATION ---------- */
function renderSignalStation(p) {
  return `
  <section class="ep-section" id="tin-hieu"><div class="ep-inner">
    <div class="ep-section-head ep-reveal">
      <div><div class="ep-eyebrow">08 · Kết nối cộng đồng</div><h2>Gửi tín hiệu vào vũ trụ</h2></div>
      <p class="ep-section-intro">Tín hiệu được lưu vào database và xuất hiện trực tiếp tại trang Cộng đồng với nhãn "Đến từ ${p.name}".</p>
    </div>
    <div class="ep-signal-layout">
      <article class="ep-panel ep-signal-composer ep-reveal">
        <form id="signalForm">
          <div class="ep-signal-origin">
            <img src="${texPath(p.texture)}" alt="" width="48" height="48">
            <div><span>Nguồn phát</span><strong>${p.name} · ${p.emotion}</strong></div>
          </div>
          <label for="signalAuthor">Biệt danh</label>
          <input id="signalAuthor" maxlength="40" placeholder="Phi_Hanh_Gia_..." autocomplete="off">
          <label class="ep-check"><input id="signalAnon" type="checkbox" checked><span>Gửi ẩn danh</span></label>
          <label for="signalLevel">Cường độ tín hiệu: <output id="signalLevelOutput">3</output>/5</label>
          <input id="signalLevel" type="range" min="1" max="5" value="3">
          <label for="signalText">Thông điệp của bạn</label>
          <textarea id="signalText" rows="6" maxlength="1200" required placeholder="Bạn đang cảm thấy gì tại ${p.name}?"></textarea>
          <div class="ep-char-count"><span id="charCount">0</span>/1200</div>
          <button class="ep-primary" type="submit">Gửi tín hiệu vào vũ trụ</button>
          <div class="ep-signal-status" id="signalStatus" aria-live="polite"></div>
        </form>
      </article>
      <article class="ep-panel ep-live-signals ep-reveal" id="cong-dong">
        <div class="ep-live-head">
          <div><span>Tín hiệu gần đây</span><strong>Đến từ ${p.name}</strong></div>
          <a href="community.html?planet=${p.id}">Mở trang cộng đồng ↗</a>
        </div>
        <div id="planetSignalFeed"><p class="ep-section-intro">Đang kết nối database...</p></div>
      </article>
    </div>
  </div></section>`;
}

/* ---------- RENDER: LIVE SIGNALS ---------- */
function renderSignalIntensity(level) {
  let bars = '';
  for (let i = 1; i <= 5; i++) {
    bars += `<div class="ep-signal-bar${i <= level ? ' active' : ''}"></div>`;
  }
  return `<span class="ep-signal-intensity">${bars}</span>`;
}

/* ---------- RENDER: FOOTER ---------- */
function renderFooter(currentId) {
  const data = (typeof PLANET_DATA !== 'undefined') ? PLANET_DATA : {};
  const links = PLANET_ORDER.map(key => {
    const item = data[key];
    if (!item) return '';
    const isCurrent = key === currentId;
    return `<a class="ep-planet-link${isCurrent ? ' current' : ''}" href="${key}.html"${isCurrent ? ' aria-current="page"' : ''}>
      <img src="${texPath(item.texture)}" alt="" width="62" height="62" loading="lazy">
      <span>${item.name}<br>${item.emotion}</span>
    </a>`;
  }).join('');

  return `
  <footer class="ep-footer">
    <nav class="ep-planet-links" aria-label="Đi đến hành tinh cảm xúc khác">${links}</nav>
    <p class="ep-footer-meta">StellarMind © 2026 · Nội dung giáo dục cảm xúc · Ảnh hành tinh chỉ dùng trong UI trang chi tiết</p>
  </footer>`;
}

/* ============================================================
   PAGE ASSEMBLY
   ============================================================ */
function renderPage() {
  const id = document.body.dataset.planet;
  const data = (typeof PLANET_DATA !== 'undefined') ? PLANET_DATA : {};
  const p = data[id];
  const app = document.getElementById('emotionApp');
  if (!p || !app) return;

  app.className = 'ep-app';
  app.innerHTML = `
    ${renderNav(p)}
    <main id="main">
      ${renderHero(p)}
      ${renderConnection(p)}
      ${renderOverview(p)}
      ${renderSigns(p)}
      ${renderEmotionalLoop(p)}
      ${renderResearch(p)}
      ${renderScenarios(p)}
      ${renderPractice(p)}
      ${renderSignalStation(p)}
    </main>
    ${renderFooter(id)}`;

  // Init interactivity
  initScrollSpy();
  initScrollReveal();
  initSignsTabs();
  initBodyMap();
  initLoopAnimation();
  if (p.practice) initPractice(p.practice);
  initSignalStation(id);
  loadPlanetSignals(id, p);
  initCharCount();
  initPageMotion();
}

/* ============================================================
   INTERACTION CONTROLLERS
   ============================================================ */

/* --- Scroll Spy --- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.ep-anchor-nav a');
  const sections = [];
  navLinks.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ el: target, link });
  });

  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const match = sections.find(s => s.el === entry.target);
      if (match) {
        if (entry.isIntersecting) {
          navLinks.forEach(l => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          match.link.classList.add('active');
          match.link.setAttribute('aria-current', 'location');
        }
      }
    });
  }, { rootMargin: '-20% 0px -75% 0px' });

  sections.forEach(s => obs.observe(s.el));
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const els = document.querySelectorAll('.ep-reveal');
  if (reducedMotion()) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* --- Signs Tabs --- */
function initSignsTabs() {
  const tabs = [...document.querySelectorAll('.ep-signs-tab')];
  const panels = document.querySelectorAll('.ep-signs-panel');
  const activate = (tab, focus = false) => {
    const key = tab.dataset.tab;
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); t.tabIndex = -1; });
    panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
    tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); tab.tabIndex = 0;
    const target = document.querySelector(`.ep-signs-panel[data-panel="${key}"]`);
    if (target) { target.classList.add('active'); target.hidden = false; }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      activate(tabs[next], true);
    });
  });
}

/* --- Body Map Pulse Animation --- */
function initBodyMap() {
  const mapSection = document.getElementById('bodyMap');
  if (!mapSection) return;

  const points = mapSection.querySelectorAll('.ep-pulse-point');
  if (reducedMotion()) {
    points.forEach(pt => pt.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        points.forEach((pt, i) => {
          setTimeout(() => pt.classList.add('visible'), i * 200);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(mapSection);
}

/* --- Emotional Loop Line Drawing --- */
function initLoopAnimation() {
  const connector = document.querySelector('[data-loop-line]');
  const steps = document.querySelectorAll('.ep-loop-step');
  if (!connector || !steps.length) return;

  if (reducedMotion()) {
    connector.classList.add('visible');
    steps.forEach(s => s.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        connector.classList.add('visible');
        steps.forEach((step, i) => {
          setTimeout(() => step.classList.add('visible'), i * 120);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  obs.observe(connector.parentElement);
}

/* --- Character Count --- */
function initCharCount() {
  const textarea = document.getElementById('signalText');
  const counter = document.getElementById('charCount');
  if (!textarea || !counter) return;
  textarea.addEventListener('input', () => {
    counter.textContent = textarea.value.length;
  });
}

/* ============================================================
   PRACTICE WIDGETS (8 unique types)
   ============================================================ */
function initPractice(config) {
  const lab = document.getElementById('practiceLab');
  if (!lab) return;

  switch (config.type) {
    case 'grounding': return initGrounding(lab, config);
    case 'cooldown': return initCooldown(lab, config);
    case 'reframe': return initReframe(lab, config);
    case 'priority': return initPriority(lab, config);
    case 'connection': return initConnection(lab, config);
    case 'compassion': return initCompassion(lab, config);
    case 'micro': return initMicro(lab, config);
    case 'compass': return initCompass(lab, config);
    default: lab.innerHTML = '<p>Bài thực hành đang được phát triển.</p>';
  }
}

/* Earth — 5-4-3-2-1 Grounding */
function initGrounding(lab, config) {
  const senses = config.senses || [
    { count: 5, sense: 'nhìn', prompt: 'Kể 5 điều bạn nhìn thấy ngay bây giờ.' },
    { count: 4, sense: 'chạm', prompt: 'Gọi tên 4 điểm cơ thể đang chạm vào thứ gì đó.' },
    { count: 3, sense: 'nghe', prompt: 'Lắng nghe 3 âm thanh xung quanh.' },
    { count: 2, sense: 'ngửi', prompt: 'Nhận diện 2 mùi gần bạn.' },
    { count: 1, sense: 'chậm lại', prompt: 'Chọn 1 điều bạn muốn làm chậm lại.' }
  ];
  let step = 0;

  const dots = senses.map((_, i) =>
    `<div class="ep-stepper-dot${i === 0 ? ' current' : ''}" data-step="${i}"></div>`
  ).join('');

  lab.innerHTML = `
    <div class="ep-lab-title">Trạm tiếp đất 5–4–3–2–1</div>
    <div class="ep-lab-subtitle">Đưa sự chú ý trở về hiện tại qua từng giác quan.</div>
    <div class="ep-stepper">${dots}</div>
    <p id="labPrompt" style="font-size: 1.1rem; font-weight: 600; min-height: 60px;">${senses[0].prompt}</p>
    <p id="labCount" style="font: 500 2rem var(--ep-font-display); color: var(--ep-accent);">${senses[0].count}</p>
    <button type="button" id="labAction">Hoàn thành bước này</button>
    <button type="button" id="breathAction" class="ep-secondary-action">Hỗ trợ thở chậm 4–6</button>
    <div class="ep-breath-guide" id="breathGuide" aria-live="polite"><span></span><b>Hít vào 4 · thở ra 6</b></div>
    <div class="ep-lab-result" id="labResult">Bước 1 / ${senses.length} — ${senses[0].sense}</div>`;

  const breathGuide=lab.querySelector('#breathGuide');
  lab.querySelector('#breathAction').addEventListener('click',()=>{ breathGuide.classList.toggle('active'); lab.querySelector('#breathAction').textContent=breathGuide.classList.contains('active')?'Dừng hướng dẫn thở':'Hỗ trợ thở chậm 4–6'; });

  lab.querySelector('#labAction').addEventListener('click', function() {
    step++;
    const allDots = lab.querySelectorAll('.ep-stepper-dot');
    if (step < senses.length) {
      allDots.forEach((d, i) => {
        d.className = 'ep-stepper-dot';
        if (i < step) d.classList.add('completed');
        if (i === step) d.classList.add('current');
      });
      lab.querySelector('#labPrompt').textContent = senses[step].prompt;
      lab.querySelector('#labCount').textContent = senses[step].count;
      lab.querySelector('#labResult').textContent = `Bước ${step + 1} / ${senses.length} — ${senses[step].sense}`;
    } else {
      allDots.forEach(d => { d.className = 'ep-stepper-dot completed'; });
      lab.querySelector('#labPrompt').textContent = 'Bạn đã trở về đủ gần với hiện tại.';
      lab.querySelector('#labCount').textContent = '✓';
      lab.querySelector('#labResult').textContent = 'Thở chậm và chọn một hành động nhỏ tiếp theo.';
      lab.querySelector('#labResult').classList.add('success');
      this.disabled = true;
      this.textContent = 'Hoàn thành ✓';
    }
  });
}

/* Mars — 90-second Cooldown */
function initCooldown(lab, config) {
  const duration = config.duration || 90;
  let value = 100;
  let timer;

  lab.innerHTML = `
    <div class="ep-lab-title">Buồng hạ nhiệt ${duration} giây</div>
    <div class="ep-lab-subtitle">Tạm rời cuộc đối thoại. Thả lỏng bàn tay. Thở ra dài hơn hít vào.</div>
    <div class="ep-meter"><span id="meterFill" style="width: 100%"></span></div>
    <p id="labTemp" style="font: 500 1.8rem var(--ep-font-display); color: var(--ep-accent); text-align: center;">100%</p>
    <div class="ep-lab-result" id="labResult">Nhấn bắt đầu khi bạn sẵn sàng tạm dừng phản hồi.</div>
    <button type="button" id="labAction">Bắt đầu hạ nhiệt</button>
    <div class="ep-communication-builder" id="communicationBuilder" hidden>
      <label>Tôi cảm thấy <input id="angerFeeling" maxlength="60" placeholder="bực, tổn thương..."></label>
      <label>khi <input id="angerWhen" maxlength="120" placeholder="hành vi cụ thể xảy ra..."></label>
      <label>và tôi cần <input id="angerNeed" maxlength="120" placeholder="một yêu cầu rõ ràng..."></label>
      <button type="button" id="buildMessage">Tạo câu giao tiếp</button><output id="angerMessage"></output>
    </div>`;

  const fillEl = lab.querySelector('#meterFill');
  const tempEl = lab.querySelector('#labTemp');
  const resultEl = lab.querySelector('#labResult');
  const btn = lab.querySelector('#labAction');

  lab.querySelector('#buildMessage').addEventListener('click',()=>{
    const feeling=lab.querySelector('#angerFeeling').value.trim(); const when=lab.querySelector('#angerWhen').value.trim(); const need=lab.querySelector('#angerNeed').value.trim();
    lab.querySelector('#angerMessage').textContent=(feeling&&when&&need)?`Tôi cảm thấy ${feeling} khi ${when}. Tôi cần ${need}.`:'Hãy điền đủ ba phần để tạo câu nói.';
  });

  btn.addEventListener('click', () => {
    clearInterval(timer);
    value = 100;
    btn.disabled = true;
    btn.textContent = 'Đang hạ nhiệt...';
    const step = 100 / (duration / 1.5);

    timer = setInterval(() => {
      value = Math.max(0, value - step);
      fillEl.style.width = `${value}%`;
      tempEl.textContent = `${Math.round(value)}%`;

      if (value > 66) {
        resultEl.textContent = 'Thả lỏng vai, bàn tay, hàm. Thở ra dài hơn hít vào.';
      } else if (value > 33) {
        resultEl.textContent = 'Nhiệt độ đang giảm. Gọi tên cảm xúc thay vì hành động theo nó.';
      } else if (value > 0) {
        resultEl.textContent = 'Gần ổn rồi. Hãy nghĩ: "Tôi cảm thấy… khi… và tôi cần…"';
      } else {
        clearInterval(timer);
        resultEl.textContent = 'Đủ khoảng dừng để viết lại nhu cầu thay vì tấn công.';
        resultEl.classList.add('success');
        lab.querySelector('#communicationBuilder').hidden=false;
        tempEl.textContent = '✓';
        btn.textContent = 'Làm lại';
        btn.disabled = false;
      }
    }, 1500);
  });
}

/* Uranus — Cognitive Reframing */
function initReframe(lab, config) {
  lab.innerHTML = `
    <div class="ep-lab-title">Lăng kính kiểm chứng suy nghĩ</div>
    <div class="ep-lab-subtitle">Viết câu tự phê phán, sau đó tách dữ kiện khỏi kết luận.</div>
    <textarea id="labText" rows="3" placeholder="Ví dụ: Mình luôn làm mọi thứ hỏng..."></textarea>
    <button type="button" id="labAction">Đưa qua lăng kính</button>
    <div class="ep-evidence-compare" id="evidenceCompare" style="display:none">
      <div class="ep-evidence-col against">
        <h5>✕ Bằng chứng chống lại</h5>
        <textarea id="evidenceAgainst" rows="3" placeholder="Dữ kiện nào thực sự chứng minh câu trên?"></textarea>
      </div>
      <div class="ep-evidence-col for">
        <h5>✓ Bằng chứng phản bác</h5>
        <textarea id="evidenceFor" rows="3" placeholder="Lần nào bạn đã làm tốt? Ai đã khen?"></textarea>
      </div>
    </div>
    <label for="achievementText" class="ep-mini-label">MỘT ĐIỀU BẠN ĐÃ LÀM ĐƯỢC</label>
    <div class="ep-inline-action"><input id="achievementText" maxlength="120" placeholder="Dù nhỏ, ví dụ: đã gửi email khó..."><button id="saveAchievement" type="button">Ghi nhận</button></div>
    <div class="ep-achievement-list" id="achievementList"></div>
    <div class="ep-lab-result" id="labResult">Kết quả sẽ xuất hiện ở đây.</div>`;

  const achievementKey = `ep_achievements_${document.body.dataset.planet}`;
  const achievementList = lab.querySelector('#achievementList');
  const renderAchievements = () => {
    let items=[]; try { items=JSON.parse(localStorage.getItem(achievementKey)||'[]'); } catch(e) {}
    achievementList.innerHTML=items.slice(-3).reverse().map(item => `<span>${esc(item)}</span>`).join('');
  };
  lab.querySelector('#saveAchievement').addEventListener('click', () => {
    const input=lab.querySelector('#achievementText'); const value=input.value.trim(); if(!value) return;
    let items=[]; try { items=JSON.parse(localStorage.getItem(achievementKey)||'[]'); } catch(e) {}
    items.push(value); try { localStorage.setItem(achievementKey,JSON.stringify(items.slice(-10))); } catch(e) {}
    input.value=''; renderAchievements();
  });
  renderAchievements();

  const textEl = lab.querySelector('#labText');
  const compareEl = lab.querySelector('#evidenceCompare');
  const resultEl = lab.querySelector('#labResult');

  lab.querySelector('#labAction').addEventListener('click', () => {
    const val = textEl.value.trim();
    if (!val) { resultEl.textContent = 'Hãy nhập câu tự phê phán trước.'; return; }
    compareEl.style.display = '';
    resultEl.innerHTML = `<strong>Viết lại công bằng hơn:</strong><br>"Mình đang gặp khó ở việc này, nhưng một kết quả không định nghĩa toàn bộ năng lực của mình."`;
    resultEl.classList.add('success');
  });
}

/* Jupiter — Priority Zones */
function initPriority(lab, config) {
  const zones = [
    { name:'Phải làm', description:'Quan trọng và cần xử lý sớm' },
    { name:'Nên làm', description:'Quan trọng nhưng có thể lên lịch' },
    { name:'Có thể chờ', description:'Chưa cần thiết ngay' }
  ];
  const storageKey = 'ep_priority_' + document.body.dataset.planet;
  lab.innerHTML = `
    <div class="ep-lab-title">Ba quỹ đạo ưu tiên</div>
    <div class="ep-lab-subtitle">Tạo thẻ nhiệm vụ, rồi kéo hoặc dùng danh sách trên từng thẻ để đổi quỹ đạo.</div>
    <textarea id="labText" rows="4" placeholder="Mỗi việc một dòng..."></textarea>
    <button type="button" id="labAction">Tạo thẻ nhiệm vụ</button>
    <div class="ep-task-bank" id="taskBank" aria-label="Nhiệm vụ chưa phân loại"></div>
    <div class="ep-priority-zones" id="priorityZones" hidden>
      ${zones.map((z,i)=>`<section class="ep-priority-zone" data-zone="${i}" aria-label="${z.name}"><h5>${z.name}</h5><small>${z.description}</small><div class="ep-zone-items"></div></section>`).join('')}
    </div>
    <div class="ep-energy-compare" id="energyCompare" hidden>
      <label for="energyRange">Năng lượng hôm nay: <output id="energyOutput">3</output>/5</label>
      <input id="energyRange" type="range" min="1" max="5" value="3">
    </div>
    <div class="ep-lab-result" id="labResult" aria-live="polite">Nhập ít nhất một nhiệm vụ để bắt đầu.</div>`;

  const bank=lab.querySelector('#taskBank'); const zoneWrap=lab.querySelector('#priorityZones'); const result=lab.querySelector('#labResult');
  const optionHtml = (selected='') => ['','0','1','2'].map(v=>`<option value="${v}"${v===selected?' selected':''}>${v===''?'Chọn quỹ đạo':zones[Number(v)].name}</option>`).join('');
  const update = () => {
    const counts=zones.map((_,i)=>lab.querySelectorAll(`.ep-priority-zone[data-zone="${i}"] .ep-priority-item`).length);
    const energy=Number(lab.querySelector('#energyRange').value); const demand=counts[0]*2+counts[1];
    result.textContent = demand > energy*2 ? 'Tải ưu tiên đang cao hơn năng lượng. Hãy chuyển một việc hoặc xin hỗ trợ.' : 'Khối lượng hiện tại có vẻ vừa hơn với năng lượng hôm nay.';
    result.classList.toggle('success', demand <= energy*2);
    const state=[...lab.querySelectorAll('.ep-priority-item')].map(el=>({text:el.dataset.text,zone:el.dataset.zone||''}));
    try{localStorage.setItem(storageKey,JSON.stringify(state));}catch(e){}
  };
  const moveTask=(task,zone)=>{
    task.dataset.zone=String(zone); task.querySelector('select').value=String(zone);
    lab.querySelector(`.ep-priority-zone[data-zone="${zone}"] .ep-zone-items`).appendChild(task); update();
  };
  const makeTask=(text,zone='')=>{
    const task=document.createElement('div'); task.className='ep-priority-item'; task.draggable=true; task.tabIndex=0; task.dataset.text=text; task.dataset.zone=zone;
    task.innerHTML=`<span>${esc(text)}</span><select aria-label="Chuyển nhiệm vụ ${esc(text)}">${optionHtml(zone)}</select>`;
    task.querySelector('select').addEventListener('change',e=>{if(e.target.value!=='')moveTask(task,Number(e.target.value));});
    task.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',text); task.classList.add('dragging');});
    task.addEventListener('dragend',()=>task.classList.remove('dragging'));
    (zone===''?bank:lab.querySelector(`.ep-priority-zone[data-zone="${zone}"] .ep-zone-items`)).appendChild(task);
  };
  lab.querySelectorAll('.ep-priority-zone').forEach(zone=>{
    zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});
    zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
    zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag-over');const task=lab.querySelector('.ep-priority-item.dragging');if(task)moveTask(task,Number(zone.dataset.zone));});
  });
  lab.querySelector('#energyRange').addEventListener('input',e=>{lab.querySelector('#energyOutput').value=e.target.value;update();});
  lab.querySelector('#labAction').addEventListener('click',()=>{
    const items=lab.querySelector('#labText').value.split(/\n/).map(v=>v.trim()).filter(Boolean);
    if(!items.length){result.textContent='Hãy nhập ít nhất một nhiệm vụ.';return;}
    bank.innerHTML='';lab.querySelectorAll('.ep-zone-items').forEach(el=>el.innerHTML='');items.forEach(item=>makeTask(item));
    zoneWrap.hidden=false;lab.querySelector('#energyCompare').hidden=false;result.textContent='Kéo từng thẻ vào quỹ đạo phù hợp.';
  });
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
    if(saved.length){zoneWrap.hidden=false;lab.querySelector('#energyCompare').hidden=false;saved.forEach(item=>makeTask(item.text,String(item.zone)));update();}
  } catch(e) {}
}

/* Mercury — Connection Ladder */
function initConnection(lab, config) {
  const levels = config.levels || [
    { name: 'Hiện diện', description: 'Ở một nơi có người khác trong 10 phút', action: 'Ngồi ở quán, thư viện, hoặc công viên' },
    { name: 'Gửi tín hiệu', description: 'Gửi một lời chào hoặc phản hồi ngắn', action: 'Nhắn tin, react, hoặc chào hỏi' },
    { name: 'Chia sẻ', description: 'Chia sẻ một điều thật nhưng vừa sức', action: 'Kể về ngày hôm nay hoặc cảm xúc đơn giản' }
  ];
  let currentLevel = -1;

  const levelsHtml = levels.map((l, i) =>
    `<button type="button" class="ep-connection-level" data-level="${i}" style="padding:18px;border-radius:var(--ep-radius-md);border:1px solid rgba(var(--ep-accent-rgb),.12);margin-bottom:10px;cursor:pointer;transition:all .3s;width:100%;color:inherit;text-align:left;background:transparent;">
      <div style="display: flex; gap: 12px; align-items: center;">
        <div class="ep-stepper-dot" data-dot="${i}"></div>
        <div>
          <strong>${l.name}</strong>
          <p style="margin: 4px 0 0; font-size: 0.85rem; color: var(--ep-text-body);">${l.description}</p>
          <small style="color: var(--ep-text-muted); font-size: 0.78rem;">${l.action}</small>
        </div>
      </div>
    </button>`
  ).join('');

  lab.innerHTML = `
    <div class="ep-lab-title">Thang kết nối 3 nấc</div>
    <div class="ep-lab-subtitle">Bắt đầu từ mức vừa sức nhất. Không cần nhảy cấp.</div>
    ${levelsHtml}
    <div class="ep-social-radar" aria-label="Radar kết nối ba mức"><i></i><i></i><i></i><span id="radarSignal"></span></div>
    <div class="ep-lab-result" id="labResult">Chọn một mức để bắt đầu.</div>`;

  lab.querySelectorAll('.ep-connection-level').forEach(el => {
    el.addEventListener('click', () => {
      const level = parseInt(el.dataset.level);
      currentLevel = level;
      lab.querySelectorAll('.ep-connection-level').forEach((l, i) => {
        const dot = l.querySelector('[data-dot]');
        if (i <= level) {
          l.style.borderColor = 'var(--ep-accent)';
          l.style.background = 'rgba(var(--ep-accent-rgb), 0.06)';
          dot.classList.add('completed');
        } else {
          l.style.borderColor = 'rgba(var(--ep-accent-rgb), 0.12)';
          l.style.background = '';
          dot.classList.remove('completed');
        }
        if (i === level) dot.classList.add('current');
        else dot.classList.remove('current');
      });
      lab.querySelector('#radarSignal').style.setProperty('--radar-level', level + 1);
      lab.querySelector('#labResult').textContent = `Bạn chọn: ${levels[level].name}. ${levels[level].action}. Hãy thử ngay hôm nay.`;
      lab.querySelector('#labResult').classList.add('success');
      try { localStorage.setItem('ep_connection_level_' + document.body.dataset.planet, level); } catch(e) {}
    });
  });
}

/* Venus — Compassion Practice */
function initCompassion(lab, config) {
  const targets = config.targets || ['Bản thân', 'Người thân', 'Người đang khó khăn', 'Cộng đồng'];
  const checks = config.boundaryChecks || [
    'Hành động này có tôn trọng thời gian của tôi không?',
    'Tôi có đang làm vì muốn hay vì sợ từ chối?',
    'Người kia có thể tự lo phần nào không?'
  ];

  lab.innerHTML = `
    <div class="ep-lab-title">Quỹ đạo yêu thương có ranh giới</div>
    <div class="ep-relationship-orbit" aria-label="Ba vòng quan hệ: bản thân, người thân và cộng đồng"><span>Bản thân</span><i>Người thân</i><b>Cộng đồng</b></div>
    <div class="ep-lab-subtitle">Chọn người nhận và thiết kế hành động tử tế vừa sức.</div>
    <p style="font: 500 0.82rem var(--ep-font-mono); color: var(--ep-accent); margin-bottom: 8px;">NGƯỜI NHẬN</p>
    <div class="ep-choice-grid">
      ${targets.map(t => `<button class="ep-choice" type="button">${t}</button>`).join('')}
    </div>
    <textarea id="labText" rows="3" placeholder="Viết một hành động tử tế có thể làm trong 15 phút..."></textarea>
    <p style="font: 500 0.82rem var(--ep-font-mono); color: var(--ep-accent); margin: 16px 0 8px;">KIỂM TRA RANH GIỚI</p>
    ${checks.map((c, i) => `
      <label class="ep-check" style="margin-bottom: 6px;">
        <input type="checkbox" data-boundary="${i}">
        <span style="font-size: 0.85rem;">${c}</span>
      </label>`).join('')}
    <div class="ep-lab-result" id="labResult">Chọn người nhận và viết hành động.</div>`;

  let selectedTarget = null;
  lab.querySelectorAll('.ep-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      lab.querySelectorAll('.ep-choice').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTarget = btn.textContent;
      updateCompassionResult();
    });
  });

  lab.querySelectorAll('[data-boundary]').forEach(cb => {
    cb.addEventListener('change', updateCompassionResult);
  });

  function updateCompassionResult() {
    const action = lab.querySelector('#labText').value.trim();
    const checked = lab.querySelectorAll('[data-boundary]:checked').length;
    const total = checks.length;
    const result = lab.querySelector('#labResult');

    if (selectedTarget && action && checked === total) {
      result.textContent = `Hành động dành cho "${selectedTarget}" đã qua kiểm tra ranh giới. Hãy thực hiện!`;
      result.classList.add('success');
    } else if (selectedTarget) {
      result.textContent = `Đã chọn: ${selectedTarget}. Trả lời ${total - checked} câu kiểm tra còn lại.`;
      result.classList.remove('success');
    }
  }

  lab.querySelector('#labText').addEventListener('input', updateCompassionResult);
}

/* Saturn — Micro Actions */
function initMicro(lab, config) {
  const energyLevels = config.energyLevels || [
    { level: 1, label: 'Rất thấp', actions: ['Uống vài ngụm nước', 'Mở rèm cửa', 'Rửa mặt'] },
    { level: 2, label: 'Thấp', actions: ['Ăn một phần nhỏ', 'Thay quần áo', 'Ra khỏi giường'] },
    { level: 3, label: 'Trung bình', actions: ['Đi bộ 5 phút', 'Nhắn một người', 'Nghe một bài hát'] },
    { level: 4, label: 'Khá', actions: ['Dọn một góc nhỏ', 'Viết 3 dòng nhật ký', 'Gọi cho ai đó'] },
    { level: 5, label: 'Ổn', actions: ['Đi dạo 15 phút', 'Nấu một bữa đơn giản', 'Hoàn thành một việc nhỏ'] }
  ];

  const levelsHtml = energyLevels.map(e =>
    `<button type="button" class="ep-energy-level" data-energy="${e.level}" aria-label="Năng lượng mức ${e.level}: ${e.label}">
      <div style="font-size: 1.2rem;">${'●'.repeat(e.level)}</div>
      <div>${e.label}</div>
    </button>`
  ).join('');

  lab.innerHTML = `
    <div class="ep-lab-title">Thắp một điểm sáng cực nhỏ</div>
    <div class="ep-lab-subtitle">Chọn mức năng lượng hiện tại. Bạn sẽ nhận gợi ý vừa sức.</div>
    <div class="ep-energy-selector">${levelsHtml}</div>
    <div class="ep-choice-grid" id="microActions" style="display:none"></div>
    <div class="ep-lab-result" id="labResult">Chọn mức năng lượng để xem gợi ý.</div>`;

  lab.querySelectorAll('.ep-energy-level').forEach(el => {
    el.addEventListener('click', () => {
      const level = parseInt(el.dataset.energy);
      lab.querySelectorAll('.ep-energy-level').forEach(e => e.classList.remove('active'));
      el.classList.add('active');

      const data = energyLevels.find(e => e.level === level);
      const actionsEl = lab.querySelector('#microActions');
      actionsEl.style.display = '';
      actionsEl.innerHTML = data.actions.map(a =>
        `<button class="ep-choice" type="button">${a}</button>`
      ).join('');

      // Attach click handlers to action buttons
      actionsEl.querySelectorAll('.ep-choice').forEach(btn => {
        btn.addEventListener('click', () => {
          actionsEl.querySelectorAll('.ep-choice').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          lab.querySelector('#labResult').textContent = `Mục tiêu hôm nay: ${btn.textContent}. Dưới 2 phút là đủ.`;
          lab.querySelector('#labResult').classList.add('success');
          try { localStorage.setItem('ep_micro_action_' + document.body.dataset.planet, btn.textContent); } catch(e) {}
        });
      });

      lab.querySelector('#labResult').textContent = `Năng lượng: ${data.label}. Chọn một hành động vừa sức.`;
    });
  });
}

/* Neptune — Value Compass */
function initCompass(lab, config) {
  const values = config.valueOptions || [
    'Sáng tạo', 'Gia đình', 'Tự do', 'Học hỏi',
    'Sức khỏe', 'Đóng góp', 'Kết nối', 'Phiêu lưu',
    'Công bằng', 'Bình an'
  ];
  const selected = [];

  lab.innerHTML = `
    <div class="ep-lab-title">La bàn ba giá trị</div>
    <div class="ep-lab-subtitle">Chọn 3 giá trị quan trọng nhất với bạn lúc này. Không cần chọn "đúng".</div>
    <div class="ep-choice-grid">
      ${values.map(v => `<button class="ep-choice" type="button">${v}</button>`).join('')}
    </div>
    <div id="compassResult" style="display:none; margin-top: 16px;">
      <p style="font: 500 0.82rem var(--ep-font-mono); color: var(--ep-accent); margin-bottom: 8px;">HÀNH ĐỘNG THỬ NGHIỆM</p>
      ${['Giá trị 1', 'Giá trị 2', 'Giá trị 3'].map((_, i) => `
        <div style="margin-bottom: 8px;">
          <label style="font-size: 0.82rem; color: var(--ep-text-muted);" id="compassLabel${i}"></label>
          <input type="text" id="compassAction${i}" placeholder="Hành động dưới 20 phút..." style="margin-top: 4px;">
        </div>`).join('')}
      <label class="ep-review-date">Ngày xem lại quyết định <input type="date" id="compassReview"></label>
    </div>
    <button type="button" id="saveCompass" class="ep-secondary-action">Lưu la bàn tạm thời</button>
    <div class="ep-lab-result" id="labResult">Chọn tối đa 3 giá trị.</div>`;

  const compassKey = 'ep_compass_' + document.body.dataset.planet;
  lab.querySelector('#saveCompass').addEventListener('click', () => {
    if (selected.length !== 3) { lab.querySelector('#labResult').textContent = 'Hãy chọn đủ 3 giá trị trước khi lưu.'; return; }
    const actions = selected.map((value,i) => ({ value, action: lab.querySelector(`#compassAction${i}`).value.trim() }));
    const state = { actions, reviewDate: lab.querySelector('#compassReview').value };
    try { localStorage.setItem(compassKey, JSON.stringify(state)); } catch(e) {}
    lab.querySelector('#labResult').textContent = 'Đã lưu la bàn và các thử nghiệm trên thiết bị này.';
    lab.querySelector('#labResult').classList.add('success');
  });

  lab.querySelectorAll('.ep-choice').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        const idx = selected.indexOf(btn.textContent);
        if (idx > -1) selected.splice(idx, 1);
      } else if (selected.length < 3) {
        btn.classList.add('active');
        selected.push(btn.textContent);
      }

      const result = lab.querySelector('#labResult');
      const compassResult = lab.querySelector('#compassResult');

      if (selected.length === 3) {
        compassResult.style.display = '';
        selected.forEach((v, i) => {
          lab.querySelector(`#compassLabel${i}`).textContent = `${v}:`;
        });
        result.textContent = `La bàn: ${selected.join(' · ')}. Viết hành động thử nghiệm cho mỗi giá trị.`;
        result.classList.add('success');
      } else {
        compassResult.style.display = 'none';
        result.textContent = `Đã chọn ${selected.length}/3 giá trị.`;
        result.classList.remove('success');
      }
    });
  });
}

/* ============================================================
   SIGNAL STATION (MongoDB Integration)
   ============================================================ */
function initSignalStation(id) {
  const form = document.getElementById('signalForm');
  const authorEl = document.getElementById('signalAuthor');
  const anonEl = document.getElementById('signalAnon');
  const levelEl = document.getElementById('signalLevel');
  const levelOut = document.getElementById('signalLevelOutput');
  const textEl = document.getElementById('signalText');
  const status = document.getElementById('signalStatus');
  if (!form) return;

  // Read token dynamically (NOT cached) so login after page-load works
  const getToken = () => localStorage.getItem('stellar_auth_token');
  const getUsername = () => localStorage.getItem('stellar_auth_username');

  // Pre-fill alias from localStorage if logged in
  const initUsername = getUsername();
  authorEl.value = initUsername || signalAlias();
  authorEl.disabled = anonEl.checked;

  levelEl.addEventListener('input', () => { levelOut.value = levelEl.value; });
  anonEl.addEventListener('change', () => {
    authorEl.disabled = anonEl.checked;
    if (anonEl.checked && !authorEl.value) authorEl.value = signalAlias();
  });

  let submitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    const msg = textEl.value.trim();
    if (!msg) return;

    // Read token fresh each submit
    const token = getToken();
    const username = getUsername();

    submitting = true;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Đang phát tín hiệu...';
    status.className = 'ep-signal-status loading';
    status.textContent = 'Đang kết nối trạm cộng đồng.';

    const body = {
      text: msg,
      planet: id,
      signalLevel: Number(levelEl.value),
      isAnon: anonEl.checked,
      author: anonEl.checked
        ? signalAlias()
        : (username || authorEl.value.trim() || signalAlias())
    };
    console.log(`[StellarMind Debug] Sending POST to ${getApiBase()}/comments. Body:`, body);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`${getApiBase()}/comments`, {
        method: 'POST', headers, body: JSON.stringify(body)
      });
      const data = await res.json();
      console.log(`[StellarMind Debug] POST comments response:`, data);
      if (!res.ok || !data.success) throw new Error(data.message || data.error || 'Không thể lưu tín hiệu');

      textEl.value = '';
      const charCountEl = document.getElementById('charCount');
      if (charCountEl) charCountEl.textContent = '0';
      status.className = 'ep-signal-status success';
      status.innerHTML = `✅ Tín hiệu đã lưu thành công! <a href="community.html?planet=${id}">Xem trên trang Cộng đồng →</a>`;

      // Transmission animation
      const composer = form.closest('.ep-signal-composer');
      if (composer) {
        composer.classList.add('ep-signal-transmitted');
        setTimeout(() => composer.classList.remove('ep-signal-transmitted'), 1500);
      }

      // Reload mini-feed on planet page
      const pData = (typeof PLANET_DATA !== 'undefined') ? PLANET_DATA[id] : null;
      await loadPlanetSignals(id, pData);
    } catch (err) {
      status.className = 'ep-signal-status error';
      status.textContent = `❌ Không thể gửi tín hiệu: ${err.message}`;
    } finally {
      submitting = false;
      btn.disabled = false;
      btn.textContent = 'Gửi tín hiệu vào vũ trụ';
    }
  });
}

async function loadPlanetSignals(id, p) {
  console.log(`[StellarMind Debug] loadPlanetSignals called for planet: ${id}. API URL: ${getApiBase()}/comments?planet=${encodeURIComponent(id)}`);
  const feed = document.getElementById('planetSignalFeed');
  if (!feed) return;

  try {
    const res = await fetch(`${getApiBase()}/comments?planet=${encodeURIComponent(id)}`);
    const data = await res.json();
    console.log(`[StellarMind Debug] loadPlanetSignals response:`, data);
    if (!res.ok || !data.success) throw new Error('Không tải được dữ liệu');

    const posts = (data.data || []).slice(0, 5);
    const planetName = p ? p.name : id;

    feed.innerHTML = posts.length
      ? posts.map(post => `
        <article class="ep-db-signal">
          <div>
            <span>${esc(post.author)}</span>
            <time>${fmtDate(post.timestamp)}</time>
          </div>
          <p>${esc(post.text)}</p>
          <small>${renderSignalIntensity(post.signalLevel || 1)} Cường độ ${post.signalLevel || 1}/5 · Đến từ ${esc(planetName)}</small>
        </article>`).join('')
      : `<p class="ep-section-intro">Chưa có tín hiệu nào từ ${esc(planetName)}. Bạn có thể là người đầu tiên.</p>`;
  } catch (err) {
    feed.innerHTML = `<p class="ep-signal-status error">${esc(err.message)}. Hãy kiểm tra kết nối.</p>`;
  }
}


function initPageMotion() {
  const art = document.querySelector('.ep-hero-art');
  if (!art || reducedMotion()) return;
  let scheduled = false;
  const update = () => {
    art.style.transform = `translate3d(0, ${Math.min(window.scrollY * 0.08, 70)}px, 0)`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive:true });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', renderPage);

