'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:5000/api';
  const feedEl = document.getElementById('commFeed');
  const sendBtn = document.getElementById('commSendBtn');
  const inputEl = document.getElementById('commInput');
  const nicknameInput = document.getElementById('commNickname');
  const nicknameWrap = document.getElementById('nicknameWrap');
  const composerHint = document.getElementById('composerHint');

  // Auth DOM Elements
  const authModal = document.getElementById('authModal');
  const loginTriggerBtn = document.getElementById('loginTriggerBtn');
  const authCloseBtn = document.getElementById('authCloseBtn');
  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabRegisterBtn = document.getElementById('tabRegisterBtn');
  const authForm = document.getElementById('authForm');
  const authUsernameInp = document.getElementById('authUsername');
  const authPasswordInp = document.getElementById('authPassword');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const authSubmitBtn = document.getElementById('authSubmitBtn');
  const navUserBadge = document.getElementById('navUserBadge');
  const navUserName = document.getElementById('navUserName');
  const logoutBtn = document.getElementById('logoutBtn');

  // Local State
  let currentMode = 'public'; // 'public' or 'anon'
  let authTab = 'login'; // 'login' or 'register'
  let token = localStorage.getItem('stellar_auth_token') || null;
  let username = localStorage.getItem('stellar_auth_username') || null;

  // ────────────────────────────────────────────────────────
  //  AUTH SYSTEM LOGIC
  // ────────────────────────────────────────────────────────
  function updateAuthUI() {
    if (token && username) {
      if (loginTriggerBtn) loginTriggerBtn.classList.add('hidden');
      if (navUserBadge) navUserBadge.classList.remove('hidden');
      if (navUserName) navUserName.textContent = username;
      
      // Update composer state: Allow public posting under username
      if (nicknameInput) {
        nicknameInput.value = username;
        nicknameInput.disabled = true;
      }
      if (composerHint) {
        composerHint.textContent = `Bạn đang đăng bài công khai dưới tên: ${username}`;
        composerHint.style.color = '#ffaa30';
      }
    } else {
      if (loginTriggerBtn) loginTriggerBtn.classList.remove('hidden');
      if (navUserBadge) navUserBadge.classList.add('hidden');
      
      // Not logged in: Default composer to anonymous style
      if (nicknameInput) {
        nicknameInput.value = '';
        nicknameInput.disabled = false;
      }
      if (composerHint) {
        composerHint.textContent = 'Bạn cần đăng nhập để phát tín hiệu.';
        composerHint.style.color = '#ff6060';
      }
    }
  }

  // Open modal
  if (loginTriggerBtn) {
    loginTriggerBtn.addEventListener('click', () => {
      authErrorMsg.classList.add('hidden');
      authModal.classList.add('open');
    });
  }

  // Close modal
  if (authCloseBtn) {
    authCloseBtn.addEventListener('click', () => {
      authModal.classList.remove('open');
    });
  }

  // Switch tabs
  if (tabLoginBtn && tabRegisterBtn) {
    tabLoginBtn.addEventListener('click', () => {
      authTab = 'login';
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      authSubmitBtn.textContent = 'ĐĂNG NHẬP';
      authErrorMsg.classList.add('hidden');
    });

    tabRegisterBtn.addEventListener('click', () => {
      authTab = 'register';
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      authSubmitBtn.textContent = 'ĐĂNG KÝ TÀI KHOẢN';
      authErrorMsg.classList.add('hidden');
    });
  }

  // Submit Form Login / Register
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authErrorMsg.classList.add('hidden');

      const userVal = authUsernameInp.value.trim();
      const passVal = authPasswordInp.value;

      if (!userVal || !passVal) {
        showAuthError('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const endpoint = authTab === 'login' ? '/auth/login' : '/auth/register';

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userVal, password: passVal })
        });

        const data = await response.json();

        if (data.success) {
          // Save credentials
          token = data.token;
          username = data.username;
          localStorage.setItem('stellar_auth_token', token);
          localStorage.setItem('stellar_auth_username', username);

          // Update UI and close
          updateAuthUI();
          authModal.classList.remove('open');
          authUsernameInp.value = '';
          authPasswordInp.value = '';
          
          // Refresh feed to unlock reply controls
          renderFeed();
        } else {
          showAuthError(data.message || 'Có lỗi xảy ra, vui lòng thử lại');
        }
      } catch (err) {
        showAuthError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại backend.');
      }
    });
  }

  function showAuthError(msg) {
    if (authErrorMsg) {
      authErrorMsg.textContent = msg;
      authErrorMsg.classList.remove('hidden');
    }
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      token = null;
      username = null;
      localStorage.removeItem('stellar_auth_token');
      localStorage.removeItem('stellar_auth_username');
      updateAuthUI();
      renderFeed();
    });
  }

  // Mode Selection inside Composer (Public / Anon)
  const modePublicBtn = document.getElementById('modePublic');
  const modeAnonBtn = document.getElementById('modeAnon');

  if (modePublicBtn && modeAnonBtn) {
    modePublicBtn.addEventListener('click', () => {
      currentMode = 'public';
      modePublicBtn.classList.add('active');
      modeAnonBtn.classList.remove('active');
      nicknameWrap.classList.remove('hidden');
      
      if (token && username) {
        composerHint.textContent = `Bạn đang đăng bài công khai dưới tên: ${username}`;
        composerHint.style.color = '#ffaa30';
      } else {
        composerHint.textContent = 'Bạn cần đăng nhập để phát tín hiệu công khai.';
        composerHint.style.color = '#ff6060';
      }
    });

    modeAnonBtn.addEventListener('click', () => {
      currentMode = 'anon';
      modeAnonBtn.classList.add('active');
      modePublicBtn.classList.remove('active');
      nicknameWrap.classList.add('hidden');
      
      if (token && username) {
        composerHint.textContent = 'Tín hiệu của bạn sẽ được gửi ẩn danh (sử dụng mật danh vũ trụ).';
        composerHint.style.color = '#00d4ff';
      } else {
        composerHint.textContent = 'Bạn cần đăng nhập để phát tín hiệu ẩn danh.';
        composerHint.style.color = '#ff6060';
      }
    });
  }

  // Random name prefixes for anonymous placeholders
  const prefixes = ['Lu_Khach', 'Sao_Bang', 'Tinh_Van', 'Ho_Den', 'Thien_Thach', 'Nhan_Ma', 'Vu_Tru', 'Ngan_Ha', 'Phi_Hanh_Gia', 'Sao_Choi', 'Tinh_Cau', 'Anh_Trang', 'Thai_Duong'];
  function generateUsernamePlaceholder() {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = Math.floor(Math.random() * 900) + 100;
    return `${p}_${n}`;
  }

  // ────────────────────────────────────────────────────────
  //  COMMENTS BACKEND SYNC LOGIC
  // ────────────────────────────────────────────────────────

  // Fetch comments from backend and render them
  async function renderFeed() {
    feedEl.innerHTML = '<div class="composer-hint" style="text-align:center; padding: 20px;">Đang tải tín hiệu vũ trụ...</div>';
    
    try {
      const response = await fetch(`${API_BASE}/comments`);
      const resData = await response.json();
      
      if (resData.success) {
        const postsList = resData.data;
        feedEl.innerHTML = '';

        if (postsList.length === 0) {
          feedEl.innerHTML = '<div class="composer-hint" style="text-align:center; padding: 20px;">Trạm rỗng. Hãy phát tín hiệu đầu tiên của bạn!</div>';
          return;
        }

        postsList.forEach(post => {
          const postEl = document.createElement('article');
          const isAnon = post.isAnon !== undefined ? post.isAnon : true;
          postEl.className = `comm-post ${isAnon ? 'post-anon' : 'post-public'}`;
          
          postEl.innerHTML = `
            <div class="post-header">
              <div class="post-avatar">${post.avatar}</div>
              <div class="post-meta">
                <span class="post-author">${post.author}</span>
                <span class="post-time">${formatTime(post.timestamp)}</span>
              </div>
            </div>
            <div class="post-content">
              ${escapeHtml(post.text)}
            </div>
            <div class="post-actions">
              <button class="action-btn reply-toggle-btn" data-id="${post._id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Trả lời (${post.replies ? post.replies.length : 0})
              </button>
            </div>
            <div class="post-replies" id="replies-${post._id}">
              <div class="replies-list">
                ${renderReplies(post.replies)}
              </div>
              <div class="reply-composer">
                <input type="text" class="reply-textarea" id="replyInput-${post._id}" placeholder="Viết phản hồi của bạn..." />
                <button class="reply-btn submit-reply-btn" data-id="${post._id}">Gửi</button>
              </div>
            </div>
          `;
          feedEl.appendChild(postEl);
        });

        // Toggle replies list
        document.querySelectorAll('.reply-toggle-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const repliesSection = document.getElementById(`replies-${id}`);
            repliesSection.classList.toggle('expanded');
          });
        });

        // Submit reply button event
        document.querySelectorAll('.submit-reply-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const input = document.getElementById(`replyInput-${id}`);
            const text = input.value.trim();
            if (text) {
              addReply(id, text);
            }
          });
        });

        // Textarea enter key submit
        document.querySelectorAll('.reply-textarea').forEach(inp => {
          inp.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
              const id = e.currentTarget.id.replace('replyInput-', '');
              const text = e.currentTarget.value.trim();
              if (text) addReply(id, text);
            }
          });
        });

      } else {
        feedEl.innerHTML = '<div class="composer-hint" style="text-align:center; padding: 20px; color:#ff6060;">Lỗi khi tải dữ liệu bình luận từ máy chủ.</div>';
      }
    } catch (err) {
      feedEl.innerHTML = '<div class="composer-hint" style="text-align:center; padding: 20px; color:#ff6060;">Không thể kết nối đến API máy chủ. Vui lòng bật backend.</div>';
    }
  }

  function renderReplies(replies) {
    if (!replies || replies.length === 0) return '';
    return replies.map(r => `
      <div class="reply-item">
        <div class="reply-header">
          <div class="reply-avatar">${r.avatar}</div>
          <span class="reply-author">${r.author}</span>
          <span class="reply-time">${formatTime(r.timestamp)}</span>
        </div>
        <div class="reply-content">${escapeHtml(r.text)}</div>
      </div>
    `).join('');
  }

  // Check login helper
  function checkLogin() {
    if (!token) {
      // Trigger Login popup
      authErrorMsg.classList.add('hidden');
      authModal.classList.add('open');
      showAuthError('Vui lòng đăng ký hoặc đăng nhập tài khoản để viết bình luận!');
      return false;
    }
    return true;
  }

  // Post comment to backend
  async function addPost(text) {
    if (!checkLogin()) return;

    const bodyData = { text: text };
    
    if (currentMode === 'anon') {
      bodyData.isAnon = true;
      bodyData.author = generateUsernamePlaceholder();
    } else {
      bodyData.isAnon = false;
      bodyData.author = username;
    }

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (data.success) {
        inputEl.value = '';
        renderFeed();
      } else {
        alert(data.message || 'Lỗi khi gửi bài đăng');
      }
    } catch (err) {
      alert('Không thể kết nối tới máy chủ để đăng bình luận.');
    }
  }

  // Post reply comment to backend
  async function addReply(postId, text) {
    if (!checkLogin()) return;

    // Replies are posted under the logged in user's profile details or anonymous code name if preferred, here defaults to user's name
    const bodyData = {
      text: text,
      author: username
    };

    try {
      const response = await fetch(`${API_BASE}/comments/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });
      const data = await response.json();
      if (data.success) {
        renderFeed();
        // Re-expand replies
        setTimeout(() => {
          const repliesSection = document.getElementById(`replies-${postId}`);
          if (repliesSection) repliesSection.classList.add('expanded');
        }, 100);
      } else {
        alert(data.message || 'Lỗi khi gửi phản hồi');
      }
    } catch (err) {
      alert('Không thể kết nối tới máy chủ để gửi phản hồi.');
    }
  }

  function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }

  // Event Listeners for new post
  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) {
      addPost(text);
    }
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text) {
        addPost(text);
      }
    }
  });

  // Link navbar Explore button to homepage with query param
  const navExplore = document.getElementById('navExplore');
  if (navExplore) {
    navExplore.href = 'index.html?explore=true';
  }

  // Initial runs
  updateAuthUI();
  renderFeed();

  // ────────────────────────────────────────────────────────
  //  DYNAMIC STARFIELD & SHOOTING STARS RENDER ENGINE
  // ────────────────────────────────────────────────────────
  const canvas = document.getElementById('starfield');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    
    canvas.width = W;
    canvas.height = H;

    const stars = [];
    const shootingStars = [];
    let mouse = { x: W/2, y: H/2, px: 0, py: 0 };

    const starCount = Math.floor(W * H / 4500);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.3,
        alpha: 0.15 + Math.random() * 0.85,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI,
        parallaxFactor: 0.01 + Math.random() * 0.04
      });
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.px = (mouse.x - W/2) / (W/2);
      mouse.py = (mouse.y - H/2) / (H/2);
    });

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    });

    function spawnShootingStar() {
      if (shootingStars.length >= 3) return;
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 6);
      const speed = 8 + Math.random() * 12;
      shootingStars.push({
        x: Math.random() * W,
        y: -10,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 50 + Math.random() * 100,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02
      });
    }

    function animateStars() {
      ctx.clearRect(0, 0, W, H);

      stars.forEach(star => {
        const offsetX = mouse.px * star.parallaxFactor * 60;
        const offsetY = mouse.py * star.parallaxFactor * 60;
        
        let x = star.x + offsetX;
        let y = star.y + offsetY;

        if (x < 0) x = W + x;
        else if (x > W) x = x - W;
        if (y < 0) y = H + y;
        else if (y > H) y = y - H;

        star.twinklePhase += star.twinkleSpeed;
        const twinkle = 0.4 + 0.6 * Math.sin(star.twinklePhase);
        
        ctx.fillStyle = `rgba(232, 244, 255, ${star.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0 || s.x < -100 || s.y > H + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.life;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx, s.y - s.vy);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.3, 'rgba(0, 212, 255, 0.4)');
        grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.stroke();
        ctx.restore();
      }

      if (Math.random() < 0.005) {
        spawnShootingStar();
      }

      requestAnimationFrame(animateStars);
    }

    animateStars();
  }
});
