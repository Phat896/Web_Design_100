/* ════════════════════════════════════════════════════════════════
   ANIMATIONS - GSAP Animation Setup
   StellarMind - Social Media Storytelling
   ════════════════════════════════════════════════════════════════ */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Global animation configuration
const ANIMATION_CONFIG = {
  // Easing
  ease: {
    smooth: "power2.inOut",
    expo: "expo.out",
    bounce: "elastic.out(1, 0.5)",
  },
  // Timing
  duration: {
    fast: 0.3,
    base: 0.5,
    slow: 0.8,
  },
};

/**
 * ═══════════════════════════════════════════════════════════════
 * HERO SECTION ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */

function initHeroAnimations() {
  // Timeline for hero section
  const tl = gsap.timeline();

  // Fade in hero title
  tl.from(".hero-title", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: ANIMATION_CONFIG.ease.expo,
  });

  // Fade in emotion text with glow
  tl.from(
    ".hero-emotion",
    {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: ANIMATION_CONFIG.ease.expo,
    },
    "-=0.3"
  );

  // Fade in tagline
  tl.from(
    ".hero-tagline",
    {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: ANIMATION_CONFIG.ease.expo,
    },
    "-=0.3"
  );

  // Planet floating animation
  gsap.to(".hero-planet-canvas", {
    y: 20,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });

  // Scroll indicator pulse
  gsap.to(".scroll-indicator", {
    opacity: 0.5,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SYMPTOMS SECTION - STAGGER ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */

function initSymptomsAnimations() {
  gsap.utils.toArray(".symptom-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1,
      ease: ANIMATION_CONFIG.ease.expo,
    });

    // Hover animation
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,
        duration: 0.3,
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        overwrite: "auto",
      });
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * DEEPDIVE SECTION - PARALLAX & IMAGE REVEAL
 * ═══════════════════════════════════════════════════════════════
 */

function initDeepDiveAnimations() {
  // Image parallax
  gsap.to(".deepdive-img", {
    scrollTrigger: {
      trigger: ".section-deepdive",
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    y: -80,
    opacity: 1,
    duration: 1,
  });

  // Content fade in
  gsap.from(".deepdive-content", {
    scrollTrigger: {
      trigger: ".section-deepdive",
      start: "top 80%",
    },
    opacity: 0,
    x: 50,
    duration: 0.8,
    ease: ANIMATION_CONFIG.ease.expo,
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * STATISTICS SECTION - COUNTER ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */

function initStatisticsAnimations() {
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    const targetValue = parseInt(stat.getAttribute("data-target"));

    ScrollTrigger.create({
      trigger: stat,
      start: "top 80%",
      onEnter: () => {
        gsap.to(stat, {
          textContent: targetValue,
          duration: 2.5,
          snap: { textContent: 1 },
          ease: ANIMATION_CONFIG.ease.expo,
        });
      },
      once: true,
    });
  });

  // Progress bar animation
  gsap.from(".progress-fill", {
    scrollTrigger: {
      trigger: ".progress-section",
      start: "top 80%",
    },
    "--progress": "0%",
    duration: 2,
    ease: ANIMATION_CONFIG.ease.expo,
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * TIMELINE SECTION - LINE DRAWING & STAGGER
 * ═══════════════════════════════════════════════════════════════
 */

function initTimelineAnimations() {
  gsap.utils.toArray(".timeline-item").forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      x: -50,
      duration: 0.6,
      delay: index * 0.15,
      ease: ANIMATION_CONFIG.ease.expo,
    });

    // Dot pulse animation
    const dot = item.querySelector(".timeline-dot");
    if (dot) {
      gsap.to(dot, {
        scrollTrigger: {
          trigger: item,
          start: "center center",
        },
        boxShadow: "0 0 30px var(--acc)",
        duration: 0.5,
        repeat: -1,
        yoyo: true,
      });
    }
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * IMPACT CARDS - STAGGER ENTRANCE
 * ═══════════════════════════════════════════════════════════════
 */

function initImpactAnimations() {
  gsap.utils.toArray(".impact-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      duration: 0.6,
      delay: index * 0.12,
      ease: ANIMATION_CONFIG.ease.expo,
    });

    // Hover lift effect
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -12,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`,
        duration: 0.3,
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "none",
        duration: 0.3,
        overwrite: "auto",
      });
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ADVICE CARDS - CARD FLIP ON CLICK
 * ═══════════════════════════════════════════════════════════════
 */

function initAdviceAnimations() {
  gsap.utils.toArray(".advice-card").forEach((card, index) => {
    // Entrance animation
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 0.6,
      delay: index * 0.1,
      ease: ANIMATION_CONFIG.ease.expo,
    });

    // Click to flip
    card.addEventListener("click", () => {
      const isFlipped = card.classList.toggle("flipped");

      gsap.to(card, {
        rotationY: isFlipped ? 180 : 0,
        duration: 0.6,
        ease: "back.out",
      });
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * THOUGHT CARDS - SCROLL CAROUSEL
 * ═══════════════════════════════════════════════════════════════
 */

function initThoughtAnimations() {
  gsap.utils.toArray(".thought-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      delay: index * 0.05,
      ease: ANIMATION_CONFIG.ease.expo,
    });

    // Hover scale effect
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.3,
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        overwrite: "auto",
      });
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * VISUAL SECTION - PARALLAX TEXT OVERLAY
 * ═══════════════════════════════════════════════════════════════
 */

function initVisualAnimations() {
  gsap.to(".visual-overlay", {
    scrollTrigger: {
      trigger: ".section-visual",
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
    y: -100,
    duration: 1,
  });

  // Title glow pulse
  gsap.to(".visual-title", {
    scrollTrigger: {
      trigger: ".section-visual",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    textShadow: "0 0 30px var(--acc)",
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CTA CHECKLIST - INTERACTIVE ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */

function initCTAAnimations() {
  const checkboxes = document.querySelectorAll(".cta-checkbox");
  const progressFill = document.querySelector(".cta-progress .progress-fill");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateProgress);
  });

  function updateProgress() {
    const checkedCount = document.querySelectorAll(
      ".cta-checkbox:checked"
    ).length;
    const totalCount = checkboxes.length;
    const percentage = (checkedCount / totalCount) * 100;

    gsap.to(progressFill, {
      "--done": `${percentage}%`,
      duration: 0.4,
      ease: ANIMATION_CONFIG.ease.smooth,
    });

    // Update counter
    gsap.to("#ctaCount", {
      textContent: checkedCount,
      duration: 0.3,
      snap: { textContent: 1 },
    });
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * CAROUSEL - PLANET EXPLORER
 * ═══════════════════════════════════════════════════════════════
 */

function initCarouselAnimations() {
  gsap.utils.toArray(".carousel-item").forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.5,
      delay: index * 0.08,
      ease: ANIMATION_CONFIG.ease.expo,
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SECTION HEADERS - FADE IN ON SCROLL
 * ═══════════════════════════════════════════════════════════════
 */

function initSectionHeaderAnimations() {
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: ANIMATION_CONFIG.ease.expo,
    });
  });
}

/**
 * ═══════════════════════════════════════════════════════════════
 * DUST PARTICLES - BACKGROUND ANIMATION (MERCURY)
 * ═══════════════════════════════════════════════════════════════
 */

function initDustParticles() {
  const dustContainer = document.getElementById("dustContainer");
  if (!dustContainer) return;

  // Create dust particles
  for (let i = 0; i < 20; i++) {
    const dust = document.createElement("div");
    dust.className = "dust-particle";
    dust.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(148, 163, 184, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      filter: blur(0.5px);
    `;
    dustContainer.appendChild(dust);

    // Animate dust
    gsap.to(dust, {
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      opacity: 0,
      duration: Math.random() * 3 + 2,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * UTILITY: INIT ALL ANIMATIONS
 * ═══════════════════════════════════════════════════════════════
 */

function initFixedPlanetScroll() {
  const planet = document.querySelector('.pp-fixed-planet-wrap');
  if (!planet) return;
  
  const isMercury = document.body.dataset.planet === 'mercury';

  if (isMercury) {
    // Mercury custom sections
    // Hero: centered, giant
    // Symptoms (section 2): fade/scale down slightly, center background
    gsap.timeline({
      scrollTrigger: {
        trigger: '#symptoms',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.65,
      opacity: 0.35,
      x: '0vw',
      y: '0vh'
    });

    // Deep Dive (section 3): move to left visual side
    gsap.timeline({
      scrollTrigger: {
        trigger: '#deepdive',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.85,
      opacity: 0.95,
      x: '-22vw',
      y: '0vh'
    });

    // Statistics (section 4) & Thoughts (section 5) & Causes (section 6): center background
    gsap.timeline({
      scrollTrigger: {
        trigger: '#statistics',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.55,
      opacity: 0.22,
      x: '0vw',
      y: '5vh'
    });

    // Advice (section 8) & Visual (section 9): shift to right side
    gsap.timeline({
      scrollTrigger: {
        trigger: '#advice',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.8,
      opacity: 0.78,
      x: '22vw',
      y: '0vh'
    });

    // Explorer (section 12): fade out into miniature solar system
    gsap.timeline({
      scrollTrigger: {
        trigger: '#explorer',
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.3,
      opacity: 0
    });

  } else {
    // Other 7 planets (dynamic vertical scroll sections)
    const sections = gsap.utils.toArray('.pp-section');
    if (!sections.length) return;

    // Section 2 (Symptoms): scale down slightly, stay centered behind HUD
    gsap.timeline({
      scrollTrigger: {
        trigger: sections[0],
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.65,
      opacity: 0.32,
      x: '0vw',
      y: '0vh'
    });

    // Section 3 (Deep Dive): shift to the left visual side
    gsap.timeline({
      scrollTrigger: {
        trigger: sections[1],
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.88,
      opacity: 0.95,
      x: '-24vw',
      y: '0vh'
    });

    // Section 4 (Stats) & Section 5 & 6 & 7: center background for readability
    gsap.timeline({
      scrollTrigger: {
        trigger: sections[2],
        start: 'top bottom',
        end: 'top top',
        scrub: 1
      }
    })
    .to(planet, {
      scale: 0.58,
      opacity: 0.22,
      x: '0vw',
      y: '5vh'
    });

    // Section 8 (Advice) & Section 9 (Visual): shift to the right side
    if (sections[7]) {
      gsap.timeline({
        scrollTrigger: {
          trigger: sections[7],
          start: 'top bottom',
          end: 'top top',
          scrub: 1
        }
      })
      .to(planet, {
        scale: 0.82,
        opacity: 0.78,
        x: '24vw',
        y: '0vh'
      });
    }

    // Section 12 (Explorer): fade out into miniature system carousel
    if (sections[10]) {
      gsap.timeline({
        scrollTrigger: {
          trigger: sections[10],
          start: 'top bottom',
          end: 'top top',
          scrub: 1
        }
      })
      .to(planet, {
        scale: 0.3,
        opacity: 0
      });
    }
  }
}

function initAllAnimations() {
  // Fixed planet scrolling timeline
  initFixedPlanetScroll();

  // Hero section
  initHeroAnimations();

  // Content sections
  initSymptomsAnimations();
  initDeepDiveAnimations();
  initStatisticsAnimations();
  initTimelineAnimations();
  initImpactAnimations();
  initAdviceAnimations();
  initThoughtAnimations();
  initVisualAnimations();
  initCTAAnimations();
  initCarouselAnimations();

  // Common
  initSectionHeaderAnimations();
  initDustParticles();

  // Refresh ScrollTrigger after all animations are created
  ScrollTrigger.refresh();
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initAllAnimations();

  // Refresh on window resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
});

// Export for use in other scripts
window.AnimationConfig = ANIMATION_CONFIG;
