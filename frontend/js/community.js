'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic API configuration: automatically switch between local development and production
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === '' || window.location.protocol === 'file:'
    ? 'http://localhost:5000/api'
    : 'https://project-web-bwm.onrender.com/api';
  const feedEl = document.getElementById('commFeed');
  const streamMetaEl = document.getElementById('communityStreamMeta');
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
  const authEmailField = document.getElementById('authEmailField');
  const authEmailInp = document.getElementById('authEmail');
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
  let accountEmail = localStorage.getItem('stellar_auth_email') || null;
  let activePlanetFilter = 'all';

  // Planet name mapping
  const PLANET_NAMES = {
    mercury: 'Sao Thủy', venus: 'Sao Kim', earth: 'Trái Đất', mars: 'Sao Hỏa',
    jupiter: 'Sao Mộc', saturn: 'Sao Thổ', uranus: 'Sao T.Vương', neptune: 'Sao H.Vương'
  };
  const PLANET_ICONS = {
    mercury: '☿', venus: '♀', earth: '🌍', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆'
  };
  const requestedPlanet = new URLSearchParams(window.location.search).get('planet');
  if (requestedPlanet && PLANET_NAMES[requestedPlanet]) activePlanetFilter = requestedPlanet;
  const SIGNAL_LEVEL_NAMES = [
    '', 'Thì thầm (1x)', 'Vô tuyến (2x)', 'Năng lượng cao (4x)', 'Bão mặt trời (8x)', 'Siêu tân tinh (16x)'
  ];

  // ────────────────────────────────────────────────────────
  //  AUTH SYSTEM LOGIC
  // ────────────────────────────────────────────────────────
  function updateAuthUI() {
    if (token && username) {
      if (loginTriggerBtn) loginTriggerBtn.classList.add('hidden');
      if (navUserBadge) navUserBadge.classList.remove('hidden');
      if (navUserName) navUserName.textContent = username;

      // Logged in: public post under username
      if (nicknameInput) {
        nicknameInput.value = username;
        nicknameInput.disabled = true;
      }
      if (composerHint && currentMode === 'public') {
        composerHint.textContent = `Đang đăng công khai dưới tên: ${username}`;
        composerHint.style.color = '#ffaa30';
      } else if (composerHint && currentMode === 'anon') {
        composerHint.textContent = 'Tín hiệu sẽ được gửi ẩn danh (mật danh vũ trụ).';
        composerHint.style.color = '#00d4ff';
      }
    } else {
      if (loginTriggerBtn) loginTriggerBtn.classList.remove('hidden');
      if (navUserBadge) navUserBadge.classList.add('hidden');

      // Not logged in: can still post anonymously
      if (nicknameInput) {
        nicknameInput.value = '';
        nicknameInput.disabled = false;
      }
      if (composerHint) {
        if (currentMode === 'anon') {
          composerHint.textContent = 'Tín hiệu ẩn danh — không cần đăng nhập.';
          composerHint.style.color = '#00d4ff';
        } else {
          composerHint.textContent = 'Đăng nhập để phát tín hiệu công khai với tên của bạn.';
          composerHint.style.color = 'rgba(232,244,255,0.4)';
        }
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
      authEmailField.classList.add('hidden');
      authEmailInp.required = false;
      authErrorMsg.classList.add('hidden');
    });

    tabRegisterBtn.addEventListener('click', () => {
      authTab = 'register';
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      authSubmitBtn.textContent = 'ĐĂNG KÝ TÀI KHOẢN';
      authEmailField.classList.remove('hidden');
      authEmailInp.required = true;
      authEmailInp.focus();
      authErrorMsg.classList.add('hidden');
    });
  }

  // Open the requested authentication tab when linked from another page.
  const requestedAuthTab = new URLSearchParams(window.location.search).get('auth');
  if (!token && (requestedAuthTab === 'login' || requestedAuthTab === 'register')) {
    authModal.classList.add('open');
    if (requestedAuthTab === 'register') tabRegisterBtn.click();
    else tabLoginBtn.click();

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('auth');
    window.history.replaceState({}, '', cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  // Submit Form Login / Register
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authErrorMsg.classList.add('hidden');

      const userVal = authUsernameInp.value.trim();
      const passVal = authPasswordInp.value;
      const emailVal = authEmailInp.value.trim().toLowerCase();

      if (!userVal || !passVal || (authTab === 'register' && !emailVal)) {
        showAuthError('Vui lòng điền đầy đủ thông tin');
        return;
      }

      if (authTab === 'register' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showAuthError('Địa chỉ email không hợp lệ');
        authEmailInp.focus();
        return;
      }

      const endpoint = authTab === 'login' ? '/auth/login' : '/auth/register';

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: userVal,
            password: passVal,
            ...(authTab === 'register' ? { email: emailVal } : {})
          })
        });

        const data = await response.json();

        if (data.success) {
          // Save credentials
          token = data.token;
          username = data.username;
          accountEmail = data.email || null;
          localStorage.setItem('stellar_auth_token', token);
          localStorage.setItem('stellar_auth_username', username);
          if (accountEmail) localStorage.setItem('stellar_auth_email', accountEmail);
          else localStorage.removeItem('stellar_auth_email');

          // Update UI and close
          updateAuthUI();
          authModal.classList.remove('open');
          authUsernameInp.value = '';
          authPasswordInp.value = '';
          authEmailInp.value = '';
          authEmailField.classList.add('hidden');
          authEmailInp.required = false;
          
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
      accountEmail = null;
      localStorage.removeItem('stellar_auth_token');
      localStorage.removeItem('stellar_auth_username');
      localStorage.removeItem('stellar_auth_email');
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
        composerHint.textContent = `Đang đăng công khai dưới tên: ${username}`;
        composerHint.style.color = '#ffaa30';
      } else {
        composerHint.textContent = 'Đăng nhập để phát tín hiệu công khai với tên của bạn.';
        composerHint.style.color = 'rgba(232,244,255,0.4)';
      }
    });

    modeAnonBtn.addEventListener('click', () => {
      currentMode = 'anon';
      modeAnonBtn.classList.add('active');
      modePublicBtn.classList.remove('active');
      nicknameWrap.classList.add('hidden');

      // Anonymous posting does NOT require login
      composerHint.textContent = 'Tín hiệu ẩn danh — không cần đăng nhập.';
      composerHint.style.color = '#00d4ff';
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
    console.log(`[StellarMind Debug] renderFeed called. API_BASE: ${API_BASE}, activePlanetFilter: ${activePlanetFilter}`);
    feedEl.innerHTML = '<div class="composer-hint feed-status">\u0110ang t\u1ea3i t\u00edn hi\u1ec7u v\u0169 tr\u1ee5...</div>';

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log(`[StellarMind Debug] Fetching from ${API_BASE}/comments`);
      const response = await fetch(`${API_BASE}/comments`, { headers });
      const resData = await response.json();
      console.log(`[StellarMind Debug] API response success: ${resData.success}, count: ${resData.count || (resData.data && resData.data.length)}`, resData);

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Kh\u00f4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u c\u1ed9ng \u0111\u1ed3ng');
      }

      const allPosts = Array.isArray(resData.data) ? resData.data : [];
      const postsList = activePlanetFilter === 'all'
        ? allPosts
        : allPosts.filter((post) => post.planet === activePlanetFilter);
      console.log(`[StellarMind Debug] Total posts: ${allPosts.length}, Filtered posts for "${activePlanetFilter}": ${postsList.length}`, postsList);

      if (streamMetaEl) {
        const scope = activePlanetFilter === 'all'
          ? 't\u1eeb to\u00e0n b\u1ed9 h\u1ec7 c\u1ea3m x\u00fac'
          : `t\u1eeb ${PLANET_NAMES[activePlanetFilter] || activePlanetFilter}`;
        streamMetaEl.textContent = `${postsList.length} t\u00edn hi\u1ec7u ${scope}`;
      }

      feedEl.innerHTML = '';
      if (postsList.length === 0) {
        const filterMsg = activePlanetFilter !== 'all'
          ? `Ch\u01b0a c\u00f3 t\u00edn hi\u1ec7u n\u00e0o t\u1eeb ${PLANET_NAMES[activePlanetFilter] || activePlanetFilter}. H\u00e3y l\u00e0 ng\u01b0\u1eddi \u0111\u1ea7u ti\u00ean!`
          : 'Tr\u1ea1m \u0111ang y\u00ean l\u1eb7ng. H\u00e3y ph\u00e1t t\u00edn hi\u1ec7u \u0111\u1ea7u ti\u00ean c\u1ee7a b\u1ea1n!';
        feedEl.innerHTML = `<div class="composer-hint feed-status">${escapeHtml(filterMsg)}</div>`;
        return;
      }

      postsList.forEach((post) => {
        const postIdValue = String(post._id || '');
        if (!/^[a-f\d]{24}$/i.test(postIdValue)) return;

        const postId = escapeHtml(postIdValue);
        const postAuthor = escapeHtml(post.author || 'Ng\u01b0\u1eddi ng\u1eafm sao');
        const postAvatar = escapeHtml(post.avatar || Array.from(post.author || 'S')[0] || 'S');
        const replies = Array.isArray(post.replies) ? post.replies : [];
        const likeCount = Math.max(0, Number(post.likeCount) || 0);
        const likedByMe = Boolean(post.likedByMe);
        const isAnon = post.isAnon !== undefined ? post.isAnon : true;
        const postEl = document.createElement('article');
        postEl.className = `comm-post ${isAnon ? 'post-anon' : 'post-public'}`;

        let planetBadgeHtml = '';
        if (post.planet && PLANET_NAMES[post.planet]) {
          const planetName = PLANET_NAMES[post.planet];
          const planetIcon = PLANET_ICONS[post.planet] || '\u{1FA90}';
          planetBadgeHtml = `<a class="planet-badge" data-planet="${post.planet}" href="${post.planet}.html" title="M\u1edf trang ${planetName}"><span class="badge-dot"></span>\u0110\u1ebfn t\u1eeb ${planetIcon} ${planetName}</a>`;
        }

        let signalBadgeHtml = '';
        const signalLevel = Number(post.signalLevel);
        if (Number.isInteger(signalLevel) && signalLevel >= 1 && signalLevel <= 5) {
          let barsHtml = '';
          for (let i = 1; i <= 5; i += 1) {
            barsHtml += `<span class="sbar${i <= signalLevel ? ' on' : ''}"></span>`;
          }
          signalBadgeHtml = `<span class="signal-level-badge" data-level="${signalLevel}"><span class="signal-bars">${barsHtml}</span>${SIGNAL_LEVEL_NAMES[signalLevel]}</span>`;
        }

        postEl.innerHTML = `
          <div class="post-header">
            <div class="post-avatar" aria-hidden="true">${postAvatar}</div>
            <div class="post-meta">
              <span class="post-author">${postAuthor}${planetBadgeHtml}</span>
              <span class="post-time">${escapeHtml(formatTime(post.timestamp))}${signalBadgeHtml}</span>
            </div>
          </div>
          <div class="post-content">${escapeHtml(post.text)}</div>
          <div class="post-actions">
            <button class="action-btn like-btn${likedByMe ? ' liked' : ''}" data-id="${postId}" type="button" aria-pressed="${likedByMe}" aria-label="${likedByMe ? 'B\u1ecf th\u00edch' : 'Th\u00edch'} b\u00ecnh lu\u1eadn n\u00e0y">
              <svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span class="like-label">${likedByMe ? '\u0110\u00e3 th\u00edch' : 'Th\u00edch'}</span>
              <span class="like-count">${likeCount}</span>
            </button>
            <button class="action-btn reply-toggle-btn" data-id="${postId}" type="button" aria-expanded="false" aria-controls="replies-${postId}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Ph\u1ea3n h\u1ed3i (${replies.length})
            </button>
          </div>
          <div class="post-replies" id="replies-${postId}">
            <div class="replies-list">${renderReplies(replies)}</div>
            <div class="reply-composer">
              <label class="sr-only" for="replyInput-${postId}">Vi\u1ebft ph\u1ea3n h\u1ed3i</label>
              <input type="text" class="reply-textarea" id="replyInput-${postId}" maxlength="1200" placeholder="Vi\u1ebft ph\u1ea3n h\u1ed3i c\u1ee7a b\u1ea1n..." />
              <button class="reply-btn submit-reply-btn" data-id="${postId}" type="button">G\u1eedi</button>
            </div>
          </div>`;
        feedEl.appendChild(postEl);
      });

      feedEl.querySelectorAll('.like-btn').forEach((button) => {
        button.addEventListener('click', () => toggleLike(button.dataset.id, button));
      });

      feedEl.querySelectorAll('.reply-toggle-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const repliesSection = document.getElementById(`replies-${button.dataset.id}`);
          if (!repliesSection) return;
          const expanded = repliesSection.classList.toggle('expanded');
          button.setAttribute('aria-expanded', String(expanded));
          if (expanded) repliesSection.querySelector('.reply-textarea')?.focus();
        });
      });

      feedEl.querySelectorAll('.submit-reply-btn').forEach((button) => {
        button.addEventListener('click', async () => {
          const input = document.getElementById(`replyInput-${button.dataset.id}`);
          const text = input ? input.value.trim() : '';
          if (text) await addReply(button.dataset.id, text, button);
        });
      });

      feedEl.querySelectorAll('.reply-textarea').forEach((input) => {
        input.addEventListener('keydown', async (event) => {
          if (event.key !== 'Enter' || event.shiftKey) return;
          event.preventDefault();
          const postId = input.id.replace('replyInput-', '');
          const text = input.value.trim();
          if (text) await addReply(postId, text, input.nextElementSibling);
        });
      });
    } catch (error) {
      if (streamMetaEl) streamMetaEl.textContent = 'M\u1ea5t k\u1ebft n\u1ed1i v\u1edbi tr\u1ea1m d\u1eef li\u1ec7u';
      feedEl.innerHTML = `<div class="composer-hint feed-status feed-status-error">${escapeHtml(error.message || 'Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i \u0111\u1ebfn API m\u00e1y ch\u1ee7. Vui l\u00f2ng b\u1eadt backend.')}</div>`;
    }
  }

  function renderReplies(replies) {
    if (!Array.isArray(replies) || replies.length === 0) return '';
    return replies.map((reply) => {
      const author = escapeHtml(reply.author || 'Ng\u01b0\u1eddi ng\u1eafm sao');
      const avatar = escapeHtml(reply.avatar || Array.from(reply.author || 'S')[0] || 'S');
      return `
        <div class="reply-item">
          <div class="reply-header">
            <div class="reply-avatar" aria-hidden="true">${avatar}</div>
            <span class="reply-author">${author}</span>
            <span class="reply-time">${escapeHtml(formatTime(reply.timestamp))}</span>
          </div>
          <div class="reply-content">${escapeHtml(reply.text)}</div>
        </div>`;
    }).join('');
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
    // Public mode requires login; anonymous mode does not
    if (currentMode === 'public' && !checkLogin()) return;

    const bodyData = { text };

    if (currentMode === 'anon' || !token) {
      bodyData.isAnon = true;
      bodyData.author = generateUsernamePlaceholder();
    } else {
      bodyData.isAnon = false;
      bodyData.author = username;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers,
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
  async function addReply(postId, text, submitButton) {
    if (!checkLogin()) return;
    if (!text || text.length > 1200) {
      alert('Ph\u1ea3n h\u1ed3i ph\u1ea3i c\u00f3 n\u1ed9i dung v\u00e0 kh\u00f4ng v\u01b0\u1ee3t qu\u00e1 1200 k\u00fd t\u1ef1.');
      return;
    }

    if (submitButton) submitButton.disabled = true;
    try {
      const response = await fetch(`${API_BASE}/comments/${postId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'L\u1ed7i khi g\u1eedi ph\u1ea3n h\u1ed3i');
      }

      await renderFeed();
      const repliesSection = document.getElementById(`replies-${postId}`);
      const toggleButton = feedEl.querySelector(`.reply-toggle-btn[data-id="${postId}"]`);
      if (repliesSection) repliesSection.classList.add('expanded');
      if (toggleButton) toggleButton.setAttribute('aria-expanded', 'true');
    } catch (error) {
      alert(error.message || 'Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i t\u1edbi m\u00e1y ch\u1ee7 \u0111\u1ec3 g\u1eedi ph\u1ea3n h\u1ed3i.');
    } finally {
      if (submitButton && document.body.contains(submitButton)) submitButton.disabled = false;
    }
  }

  async function toggleLike(postId, button) {
    if (!checkLogin()) return;
    if (!postId || button.disabled) return;

    button.disabled = true;
    try {
      const response = await fetch(`${API_BASE}/comments/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Kh\u00f4ng th\u1ec3 c\u1eadp nh\u1eadt l\u01b0\u1ee3t th\u00edch');
      }

      button.classList.toggle('liked', data.liked);
      button.setAttribute('aria-pressed', String(data.liked));
      button.setAttribute('aria-label', `${data.liked ? 'B\u1ecf th\u00edch' : 'Th\u00edch'} b\u00ecnh lu\u1eadn n\u00e0y`);
      button.querySelector('.like-label').textContent = data.liked ? '\u0110\u00e3 th\u00edch' : 'Th\u00edch';
      button.querySelector('.like-count').textContent = String(Math.max(0, Number(data.likeCount) || 0));
    } catch (error) {
      alert(error.message || 'Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i t\u1edbi m\u00e1y ch\u1ee7 \u0111\u1ec3 th\u00edch b\u00ecnh lu\u1eadn.');
    } finally {
      button.disabled = false;
    }
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

  // Time formatter
  function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ────────────────────────────────────────────────────────
  //  PLANET FILTER BAR LOGIC
  // ────────────────────────────────────────────────────────
  const filterBar = document.getElementById('planetFilterBar');
  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const planet = btn.dataset.planet;
      activePlanetFilter = planet || 'all';

      // Update active state
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Re-render feed with filter
      renderFeed();
    });
  }

  // Initial runs
  if (filterBar && activePlanetFilter !== 'all') {
    filterBar.querySelectorAll('.filter-btn').forEach((button) => {
      button.classList.toggle('active', button.dataset.planet === activePlanetFilter);
    });
  }
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
