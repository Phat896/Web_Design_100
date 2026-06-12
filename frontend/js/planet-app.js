/* ════════════════════════════════════════════════════════════════
   PLANET APP - Main Application Logic
   StellarMind - Social Media Storytelling
   ════════════════════════════════════════════════════════════════ */

'use strict';

/**
 * ═══════════════════════════════════════════════════════════════
 * PLANET 3D CANVAS RENDERING (Mercury)
 * ═══════════════════════════════════════════════════════════════
 */

class PlanetRenderer {
  constructor(canvasId, planetName = 'mercury') {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.planetName = planetName;
    this.setupCanvas();
    this.startAnimation();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * dpr;
    this.canvas.height = this.canvas.offsetHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  drawPlanet(x, y, radius, rotation = 0) {
    const ctx = this.ctx;

    // Planet colors based on planet name
    const colors = {
      mercury: ['#94a3b8', '#64748b', '#cbd5e1'],
      venus: ['#f97316', '#ea580c', '#ffb84d'],
      earth: ['#3b82f6', '#0ea5e9', '#4ade80'],
      mars: ['#ef4444', '#dc2626', '#fca5a5'],
      jupiter: ['#fbbf24', '#f59e0b', '#fecaca'],
      saturn: ['#6366f1', '#4f46e5', '#c4b5fd'],
      uranus: ['#06b6d4', '#0891b2', '#67e8f9'],
      neptune: ['#8b5cf6', '#7c3aed', '#d8b4fe'],
    };

    const planetColors = colors[this.planetName] || colors.mercury;

    // Save context
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Draw planet with gradient
    const gradient = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, 0, 0, 0, radius);
    gradient.addColorStop(0, planetColors[2]);
    gradient.addColorStop(0.5, planetColors[0]);
    gradient.addColorStop(1, planetColors[1]);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add shading
    const shadingGradient = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
    shadingGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    shadingGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    ctx.fillStyle = shadingGradient;
    ctx.fill();

    // Add highlight
    const highlightGradient = ctx.createRadialGradient(
      -radius * 0.32,
      -radius * 0.32,
      0,
      0,
      0,
      radius * 0.55
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = highlightGradient;
    ctx.fill();

    // Restore context
    ctx.restore();
  }

  startAnimation() {
    let rotation = 0;
    const animate = () => {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw planet
      const x = this.canvas.width / 2 / (window.devicePixelRatio || 1);
      const y = this.canvas.height / 2 / (window.devicePixelRatio || 1);
      const radius = Math.min(this.canvas.width, this.canvas.height) / 2 / (window.devicePixelRatio || 1) - 20;

      this.drawPlanet(x, y, radius, rotation);

      // Update rotation
      rotation += 0.002;

      requestAnimationFrame(animate);
    };

    animate();
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AI CHATBOT INTERACTION
 * ═══════════════════════════════════════════════════════════════
 */

class AIChat {
  constructor() {
    this.messagesContainer = document.getElementById('chatMessages');
    this.input = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('chatSend');
    this.setupListeners();
  }

  setupListeners() {
    this.sendBtn?.addEventListener('click', () => this.sendMessage());
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  addMessage(text, isBot = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isBot ? 'bot' : 'user'}`;
    bubble.innerHTML = `<p>${this.escapeHTML(text)}</p>`;

    this.messagesContainer.appendChild(bubble);

    // Scroll to bottom
    gsap.to(this.messagesContainer, {
      scrollTop: this.messagesContainer.scrollHeight,
      duration: 0.3,
    });

    return bubble;
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    // Add user message
    this.addMessage(text, false);
    this.input.value = '';

    // Simulate bot response with delay
    setTimeout(() => {
      const responses = [
        'Tôi hiểu bạn. Cảm xúc đó rất tự nhiên.',
        'Bạn đang cảm thấy cô đơn? Hãy kể cho tôi nghe...',
        'Điều đó không có gì sai cả. Rất nhiều người cảm thấy như vậy.',
        'Bạn có muốn tìm cách kết nối với những người khác không?',
        'Hãy nhớ: bạn không bao giờ hoàn toàn một mình. Tôi ở đây lắng nghe.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage(randomResponse, true);
    }, 800);
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * PLANET CAROUSEL - CAROUSEL PLANET RENDERING
 * ═══════════════════════════════════════════════════════════════
 */

class CarouselPlanetRenderer {
  constructor() {
    this.planetsData = {
      mercury: { colors: ['#94a3b8', '#64748b'] },
      venus: { colors: ['#f97316', '#ea580c'] },
      earth: { colors: ['#3b82f6', '#0ea5e9'] },
      mars: { colors: ['#ef4444', '#dc2626'] },
      jupiter: { colors: ['#fbbf24', '#f59e0b'] },
      saturn: { colors: ['#6366f1', '#4f46e5'] },
      uranus: { colors: ['#06b6d4', '#0891b2'] },
      neptune: { colors: ['#8b5cf6', '#7c3aed'] },
    };

    this.renderCarouselPlanets();
  }

  renderCarouselPlanets() {
    document.querySelectorAll('.carousel-planet').forEach((canvas, index) => {
      const planetName = Object.keys(this.planetsData)[index] || 'mercury';
      this.drawSmallPlanet(canvas, planetName);
    });
  }

  drawSmallPlanet(canvas, planetName) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 150 * dpr;
    canvas.height = 150 * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const planetData = this.planetsData[planetName];
    const x = 75;
    const y = 75;
    const radius = 60;

    // Draw gradient
    const gradient = ctx.createRadialGradient(x - 20, y - 20, 0, x, y, radius);
    gradient.addColorStop(0, planetData.colors[1]);
    gradient.addColorStop(1, planetData.colors[0]);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Add glow
    ctx.strokeStyle = planetData.colors[1];
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SCROLL TO TOP BUTTON (if needed for future)
 * ═══════════════════════════════════════════════════════════════
 */

class ScrollToTop {
  constructor() {
    this.button = this.createButton();
    document.body.appendChild(this.button);
    this.setupListeners();
  }

  createButton() {
    const btn = document.createElement('button');
    btn.id = 'scrollToTop';
    btn.innerHTML = '↑';
    btn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-primary);
      border: none;
      color: var(--color-bg);
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: var(--z-fixed);
    `;
    return btn;
  }

  setupListeners() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
      }
    });

    this.button.addEventListener('click', () => {
      gsap.to(window, {
        scrollTo: 0,
        duration: 1,
        ease: 'power2.inOut',
      });
    });
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INTERSECTION OBSERVER - Lazy Loading & Visibility Tracking
 * ═══════════════════════════════════════════════════════════════
 */

class LazyObserver {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    });

    this.observeElements();
  }

  observeElements() {
    document.querySelectorAll('img[data-lazy]').forEach((el) => {
      this.observer.observe(el);
    });
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * MOBILE MENU TOGGLE (for future navigation)
 * ═══════════════════════════════════════════════════════════════
 */

class MobileMenu {
  constructor() {
    this.isOpen = false;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    // Implementation for mobile menu
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * INIT APP
 * ═══════════════════════════════════════════════════════════════
 */

function initApp() {
  // Get current planet from body data attribute
  const planetName = document.body.getAttribute('data-planet') || 'mercury';

  // Initialize planet renderer
  const planetRenderer = new PlanetRenderer('mercuryPlanet', planetName);

  // Initialize AI chat
  const aiChat = new AIChat();

  // Initialize carousel planets
  const carouselRenderer = new CarouselPlanetRenderer();

  // Initialize scroll to top
  const scrollToTop = new ScrollToTop();

  // Initialize lazy observer
  const lazyObserver = new LazyObserver();

  console.log(`🪐 StellarMind initialized for ${planetName.toUpperCase()}`);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for external use
window.PlanetApp = {
  PlanetRenderer,
  AIChat,
  CarouselPlanetRenderer,
};
