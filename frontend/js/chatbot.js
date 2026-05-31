/* ============================================================
   STELLARMIND COSMIC CHATBOT LOGIC
   Modular, non-destructive script that injects the chat UI
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Dynamic API configuration: automatically switch between local development and production
  const API_CHAT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/chat'
    : 'https://stellarmind-backend.onrender.com/api/chat'; // Sửa thành URL backend thực tế của bạn trên Render/Railway khi deploy
  
  // 1. Inject Chatbot HTML into document body if not already present
  if (!document.getElementById('cosmicChatLauncher')) {
    const chatbotHtml = `
      <button class="cosmic-chat-launcher" id="cosmicChatLauncher" title="Trò chuyện với Trợ lý Tinh hà">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <div class="cosmic-chat-window" id="cosmicChatWindow">
        <div class="cosmic-chat-header">
          <div class="cosmic-chat-header-info">
            <div class="cosmic-chat-avatar-wrap">
              <div class="cosmic-chat-status-dot"></div>
            </div>
            <div class="cosmic-chat-title-group">
              <span class="cosmic-chat-title">TRỢ LÝ TINH HÀ</span>
              <span class="cosmic-chat-subtitle">StellarMind Healing AI</span>
            </div>
          </div>
          <button class="cosmic-chat-close" id="cosmicChatClose" title="Đóng cửa sổ">✕</button>
        </div>
        <div class="cosmic-chat-messages" id="cosmicChatMessages"></div>
        <div class="cosmic-chat-suggestions-container">
          <div class="cosmic-chat-suggestions-title">Gợi ý câu hỏi:</div>
          <div class="cosmic-chat-suggestions" id="cosmicChatSuggestions">
            <button class="cosmic-chat-btn-suggestion" data-prompt="Mục tiêu của dự án StellarMind là gì?">Mục tiêu dự án</button>
            <button class="cosmic-chat-btn-suggestion" data-prompt="Tôi đang cảm thấy kiệt sức và quá tải, tôi nên đến hành tinh nào để phục hồi?">Tôi bị kiệt sức</button>
            <button class="cosmic-chat-btn-suggestion" data-prompt="Tôi đang rất tức giận, hãy chỉ cho tôi hành tinh giúp điều hòa cơn giận.">Tôi thấy tức giận</button>
            <button class="cosmic-chat-btn-suggestion" data-prompt="Tôi cảm thấy bồn chồn lo lắng, không yên lòng.">Tôi thấy bồn chồn</button>
            <button class="cosmic-chat-btn-suggestion" data-prompt="Tôi cảm thấy trống rỗng và vô hồn lúc này, có hành tinh nào bầu bạn không?">Tôi thấy trống rỗng</button>
          </div>
        </div>
        <div class="cosmic-chat-input-bar">
          <input type="text" class="cosmic-chat-input" id="cosmicChatInput" placeholder="Nhập tin nhắn tâm sự..." autocomplete="off" />
          <button class="cosmic-chat-send" id="cosmicChatSend" title="Gửi tín hiệu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = chatbotHtml;
    document.body.appendChild(wrapper.firstElementChild);
    document.body.appendChild(wrapper.lastElementChild);
  }

  // 2. Select DOM Elements
  const launcher = document.getElementById('cosmicChatLauncher');
  const windowEl = document.getElementById('cosmicChatWindow');
  const closeBtn = document.getElementById('cosmicChatClose');
  const messagesContainer = document.getElementById('cosmicChatMessages');
  const inputEl = document.getElementById('cosmicChatInput');
  const sendBtn = document.getElementById('cosmicChatSend');
  const suggestions = document.querySelectorAll('.cosmic-chat-btn-suggestion');

  let hasGreeted = false;

  // 3. Open & Close Chat Window
  launcher.addEventListener('click', () => {
    windowEl.classList.toggle('active');
    
    // Smooth input autofocus when active
    if (windowEl.classList.contains('active')) {
      inputEl.focus();
      // Remove launcher notification badge
      launcher.classList.add('read');
      launcher.setAttribute('style', '--badge-display: none;');
      
      // Initial bot welcome
      if (!hasGreeted) {
        showBotGreeting();
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    windowEl.classList.remove('active');
  });

  // Close when pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowEl.classList.contains('active')) {
      windowEl.classList.remove('active');
    }
  });

  // 4. Send Message Logic
  async function handleUserSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    // Add User bubble
    addMessageBubble('user', text);
    inputEl.value = '';

    // Show Typing indicator
    showTypingIndicator();

    try {
      const response = await fetch(API_CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
      });

      const resData = await response.json();
      hideTypingIndicator();

      if (resData.success) {
        addMessageBubble('bot', resData.reply);
      } else {
        addMessageBubble('bot', '🪐 Xin lỗi bạn, trạm kết nối với Tinh hà đang tạm thời mất tín hiệu. Vui lòng kiểm tra server backend.');
      }
    } catch (err) {
      hideTypingIndicator();
      console.error('Chatbot request failed:', err);
      addMessageBubble('bot', '⚠️ Không thể kết nối với máy chủ API. Hãy chắc chắn rằng bạn đã khởi chạy backend tại `http://localhost:5000`.');
    }
  }

  // Bind trigger buttons
  sendBtn.addEventListener('click', handleUserSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleUserSend();
    }
  });

  // Bind suggestions click
  suggestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        inputEl.value = prompt;
        handleUserSend();
      }
    });
  });

  // 5. Render Bubbles Helper
  function addMessageBubble(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.className = `cosmic-message cosmic-message-${sender}`;
    
    // Parse formatting (e.g. bold markdown "**" and project keywords to color them nicely)
    const formattedText = parseBotTextFormatting(text);
    
    messageEl.innerHTML = `
      <div class="cosmic-message-bubble">${formattedText}</div>
      <span class="cosmic-message-time">${getCurrentTimeString()}</span>
    `;
    
    messagesContainer.appendChild(messageEl);
    scrollToBottom();
  }

  // Show Typing Indicator bubble
  function showTypingIndicator() {
    const indicatorEl = document.createElement('div');
    indicatorEl.className = 'cosmic-message cosmic-message-bot cosmic-typing-bubble';
    indicatorEl.id = 'cosmicTypingIndicator';
    indicatorEl.innerHTML = `
      <div class="cosmic-message-bubble">
        <div class="cosmic-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(indicatorEl);
    scrollToBottom();
  }

  // Remove Typing Indicator bubble
  function hideTypingIndicator() {
    const indicator = document.getElementById('cosmicTypingIndicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // Welcome Greeting
  function showBotGreeting() {
    hasGreeted = true;
    addMessageBubble('bot', `🌌 Chào mừng bạn du hành đến Trạm Chữa Lành của **StellarMind**! 
Tôi là **Trợ lý Tinh hà**, người bạn đồng hành của bạn trong không gian vô tận này.

Hôm nay tâm hồn bạn cảm thấy thế nào? Hãy chia sẻ với tôi để tìm kiếm hành tinh chữa lành thích hợp nhất cho cảm xúc của bạn nhé! ✨`);
  }

  // 6. Formatting Text Helper
  function parseBotTextFormatting(text) {
    // Escape HTML first to prevent XSS
    let safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Replace Markdown Bold: **text** -> <strong>text</strong>
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Emphasize planet names to matching accents
    const keywords = [
      'Sao Thủy', 'Mercury', 'Sao Kim', 'Venus', 
      'Trái Đất', 'Earth', 'Sao Hỏa', 'Mars', 
      'Sao Mộc', 'Jupiter', 'Sao Thổ', 'Saturn', 
      'Sao Thiên Vương', 'Uranus', 'Sao Hải Vương', 'Neptune',
      'StellarMind'
    ];
    
    keywords.forEach(keyword => {
      const reg = new RegExp(`(${keyword})`, 'gi');
      safe = safe.replace(reg, '<strong>$1</strong>');
    });

    return safe;
  }

  // Auto-scroll inside message window
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Format local clock time
  function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }

  // Initial badge styling rules
  const style = document.createElement('style');
  style.textContent = `
    .cosmic-chat-launcher.read::after {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
});
