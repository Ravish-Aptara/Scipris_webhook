(function() {
    function initSophiaChatbot() {
        if (document.getElementById('cb-widget-container')) return;

        // 1. Inject UI Custom CSS Styles
        const style = document.createElement('style');
        style.innerHTML = `
            #cb-widget-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                z-index: 99999;
            }
            
            /* Floating Toggle Button */
            #cb-btn {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                border-radius: 50%;
                box-shadow: 0 8px 24px rgba(79, 70, 229, 0.35);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
                border: none;
                outline: none;
            }
            #cb-btn:hover {
                transform: scale(1.08);
                box-shadow: 0 12px 28px rgba(79, 70, 229, 0.45);
            }
            #cb-btn svg {
                width: 28px;
                height: 28px;
                fill: white;
                transition: transform 0.2s;
            }
            
            /* Chat Window Layout */
            #cb-window {
                width: 380px;
                height: 600px;
                max-height: calc(100vh - 120px);
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.16);
                display: none;
                flex-direction: column;
                overflow: hidden;
                position: absolute;
                bottom: 76px;
                right: 0;
                border: 1px solid #e2e8f0;
                animation: cbSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes cbSlideUp {
                from { opacity: 0; transform: translateY(16px) scale(0.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            
            /* Header Styling */
            #cb-header {
                background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .cb-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .cb-avatar {
                width: 38px;
                height: 38px;
                background: rgba(255, 255, 255, 0.22);
                backdrop-filter: blur(4px);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }
            .cb-title-container {
                display: flex;
                flex-direction: column;
            }
            .cb-main-title {
                font-weight: 600;
                font-size: 15px;
                margin: 0;
                letter-spacing: -0.2px;
            }
            .cb-sub-title {
                font-size: 12px;
                opacity: 0.85;
                margin-top: 1px;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .cb-status-dot {
                width: 7px;
                height: 7px;
                background: #10b981;
                border-radius: 50%;
                display: inline-block;
            }
            #cb-close {
                cursor: pointer;
                opacity: 0.85;
                padding: 6px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                transition: opacity 0.2s, background 0.2s;
            }
            #cb-close:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.15);
            }
            #cb-close svg {
                width: 20px;
                height: 20px;
                fill: white;
            }
            
            /* Message Body Box */
            #cb-messages {
                flex: 1;
                padding: 16px 18px;
                overflow-y: auto;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            #cb-messages::-webkit-scrollbar {
                width: 5px;
            }
            #cb-messages::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            
            .cb-msg-wrapper {
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-width: 82%;
                animation: cbFadeIn 0.2s ease-out;
            }
            @keyframes cbFadeIn {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .cb-msg-wrapper.user {
                align-self: flex-end;
                align-items: flex-end;
            }
            .cb-msg-wrapper.bot, .cb-msg-wrapper.support {
                align-self: flex-start;
                align-items: flex-start;
            }
            
            .cb-meta {
                font-size: 11px;
                color: #94a3b8;
                padding: 0 4px;
            }
            .cb-msg {
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 13.5px;
                line-height: 1.5;
                word-wrap: break-word;
                color: #1e293b;
            }
            .cb-msg.user {
                background: #4f46e5;
                color: #ffffff;
                border-bottom-right-radius: 4px;
            }
            .cb-msg.bot {
                background: #ffffff;
                color: #1e293b;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 4px;
            }
            .cb-msg.support {
                background: #eef2ff;
                color: #312e81;
                border: 1px solid #c7d2fe;
                border-bottom-left-radius: 4px;
            }

            /* Typing Animation */
            .cb-typing-bubble {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 12px 16px;
            }
            .cb-dot {
                width: 7px;
                height: 7px;
                background-color: #6366f1;
                border-radius: 50%;
                animation: cbBounce 1.4s infinite ease-in-out both;
            }
            .cb-dot:nth-child(1) { animation-delay: -0.32s; }
            .cb-dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes cbBounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            /* Footer Area & Inputs */
            #cb-footer-container {
                border-top: 1px solid #e2e8f0;
                background: #ffffff;
                padding: 12px 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .cb-file-preview {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                background: #eef2ff;
                color: #4338ca;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 12px;
                border: 1px solid #c7d2fe;
            }
            .cb-file-name {
                max-width: 280px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .cb-file-clear {
                background: none;
                border: none;
                color: #4338ca;
                cursor: pointer;
                font-weight: bold;
                padding: 0 4px;
                font-size: 13px;
            }
            .cb-file-clear:hover {
                color: #dc2626;
            }

            #cb-footer {
                display: flex;
                align-items: center;
                gap: 8px;
                background: #f1f5f9;
                border-radius: 24px;
                padding: 4px 8px;
                border: 1px solid transparent;
                transition: border 0.2s, background 0.2s;
            }
            #cb-footer:focus-within {
                background: #ffffff;
                border-color: #cbd5e1;
                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
            }
            
            .cb-icon-btn {
                background: none;
                border: none;
                padding: 6px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                transition: color 0.2s, background 0.2s;
            }
            .cb-icon-btn:hover {
                color: #1e293b;
                background: rgba(0,0,0,0.05);
            }
            .cb-icon-btn svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }
            
            #cb-input {
                flex: 1;
                border: none;
                background: transparent;
                padding: 8px 4px;
                font-size: 13.5px;
                outline: none;
                color: #1e293b;
                font-family: inherit;
            }
            #cb-input::placeholder {
                color: #94a3b8;
            }
            
            #cb-send {
                background: #4f46e5;
                border: none;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: background 0.2s, transform 0.1s;
                padding: 0;
            }
            #cb-send:hover {
                background: #4338ca;
            }
            #cb-send:active {
                transform: scale(0.95);
            }
            #cb-send svg {
                width: 16px;
                height: 16px;
                fill: currentColor;
            }
            
            /* Branding Footer Note */
            .cb-branding {
                font-size: 11px;
                color: #94a3b8;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }
            .cb-branding a {
                color: #64748b;
                text-decoration: none;
                font-weight: 500;
            }
            .cb-branding a:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);

        // 2. HTML Markup Injector
        const container = document.createElement('div');
        container.id = 'cb-widget-container';
        container.innerHTML = `
            <div id="cb-btn" title="Chat with support">
                <svg id="cb-toggle-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <div id="cb-window">
                <div id="cb-header">
                    <div class="cb-header-left">
                        <div class="cb-avatar">🤖</div>
                        <div class="cb-title-container">
                            <span class="cb-main-title" id="cb-agent-title">Sophia AI Agent</span>
                            <span class="cb-sub-title"><span class="cb-status-dot"></span> Online</span>
                        </div>
                    </div>
                    <button id="cb-close" title="Close chat">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
                <div id="cb-messages">
                    <div id="cb-typing" class="cb-msg-wrapper bot" style="display: none;">
                        <span class="cb-meta" id="cb-typing-meta">Assistant · typing...</span>
                        <div class="cb-msg bot cb-typing-bubble">
                            <span class="cb-dot"></span>
                            <span class="cb-dot"></span>
                            <span class="cb-dot"></span>
                        </div>
                    </div>
                </div>
                <div id="cb-footer-container">
                    <div id="cb-file-preview" style="display: none;" class="cb-file-preview">
                        <span class="cb-file-name" id="cb-file-name"></span>
                        <button class="cb-file-clear" id="cb-file-clear" title="Remove attachment">✕</button>
                    </div>
                    <div id="cb-footer">
                        <input type="file" id="cb-file-input" style="display: none;" accept="image/*,application/pdf,.doc,.docx,.txt">
                        <button class="cb-icon-btn" id="cb-attach-btn" type="button" title="Attach File">
                            <svg viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-3.31 2.69-6 6-6s6 2.69 6 6v10c0 4.42-3.58 8-8 8s-8-3.58-8-8V4h2v11c0 3.31 2.69 6 6 6s6-2.69 6-6V5c0-2.21-1.79-4-4-4s-4 1.79-4 4v11.5c0 1.1.9 2 2 2s2-.9 2-2V6h2z"/></svg>
                        </button>
                        <input type="text" id="cb-input" placeholder="Write your message..." autocomplete="off">
                        <button id="cb-send" title="Send Message">
                            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </button>
                    </div>
                    <div class="cb-branding">
                        Powered by <a href="#" target="_blank">SciPris Support</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // 3. Document Elements & Configuration
        const chatBtn = document.getElementById('cb-btn');
        const toggleIcon = document.getElementById('cb-toggle-icon');
        const chatWindow = document.getElementById('cb-window');
        const closeBtn = document.getElementById('cb-close');
        const sendBtn = document.getElementById('cb-send');
        const chatInput = document.getElementById('cb-input');
        const messagesContainer = document.getElementById('cb-messages');
        const typingIndicator = document.getElementById('cb-typing');
        const typingMeta = document.getElementById('cb-typing-meta');
        const fileInput = document.getElementById('cb-file-input');
        const attachBtn = document.getElementById('cb-attach-btn');
        const filePreview = document.getElementById('cb-file-preview');
        const fileNameSpan = document.getElementById('cb-file-name');
        const fileClearBtn = document.getElementById('cb-file-clear');
        const agentTitle = document.getElementById('cb-agent-title');

        // Dynamic Backend & WebSocket URLs
        const BASE_URL = (window.location.protocol.startsWith('http') && window.location.host) 
            ? window.location.origin 
            : 'http://127.0.0.1:8000';
        const WS_BASE = BASE_URL.replace(/^http/, 'ws');

        // Session ID configuration
        const urlParams = new URLSearchParams(window.location.search);
        const explicitSession = urlParams.get('session_id');
        const sessionId = explicitSession || Math.random().toString(36).substring(2, 11);

        let selectedFile = null;
        let chatSocket = null;
        let isLiveSupport = false;

        const chatBubbleSvg = '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>';
        const chevronDownSvg = '<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>';

        // 4. WebSocket Connection for Live Support
        function connectWebSocket() {
            try {
                const wsUrl = `${WS_BASE}/ws/chat/${sessionId}/`;
                chatSocket = new WebSocket(wsUrl);

                chatSocket.onmessage = function(e) {
                    try {
                        const data = JSON.parse(e.data);
                        if (data.sender === 'support' || data.role === 'support') {
                            isLiveSupport = true;
                            agentTitle.textContent = "Live Support Agent";
                            hideTyping();
                            addMessage(data.message, 'support');
                        }
                    } catch (err) {
                        console.error('Error handling WS message:', err);
                    }
                };

                chatSocket.onclose = function() {
                    setTimeout(connectWebSocket, 5000);
                };

                chatSocket.onerror = function(err) {
                    console.warn('WebSocket error:', err);
                };
            } catch (err) {
                console.error('Failed to init WebSocket:', err);
            }
        }
        connectWebSocket();

        // 5. Text Formatter (Markdown helper)
        function formatMessageText(text) {
            if (!text) return '';
            let clean = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/<br>\*\s/g, '<br>• ')
                .replace(/^\*\s/g, '• ');
            return clean;
        }

        // 6. Message Builder Helper
        function addMessage(text, role) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('cb-msg-wrapper', role);

            const meta = document.createElement('span');
            meta.classList.add('cb-meta');
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
            
            let senderLabel = 'Sophia AI Agent';
            if (role === 'user') senderLabel = 'You';
            else if (role === 'support') senderLabel = 'Live Support';

            meta.innerText = `${senderLabel} · ${timeStr}`;

            const msgDiv = document.createElement('div');
            msgDiv.classList.add('cb-msg', role);
            msgDiv.innerHTML = formatMessageText(text);

            wrapper.appendChild(meta);
            wrapper.appendChild(msgDiv);

            if (typingIndicator && typingIndicator.parentNode === messagesContainer) {
                messagesContainer.insertBefore(wrapper, typingIndicator);
            } else {
                messagesContainer.appendChild(wrapper);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function showTyping(label) {
            if (typingMeta && label) typingMeta.innerText = label;
            typingIndicator.style.display = 'flex';
            messagesContainer.appendChild(typingIndicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTyping() {
            typingIndicator.style.display = 'none';
        }

        // 7. Load History if explicit session parameter is given
        async function loadHistory() {
            try {
                const res = await fetch(`${BASE_URL}/api/chat_history/${sessionId}/`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.history && data.history.length > 0) {
                        messagesContainer.innerHTML = '';
                        messagesContainer.appendChild(typingIndicator);

                        data.history.forEach(msg => {
                            let text = '';
                            if (msg.parts && Array.isArray(msg.parts)) {
                                text = msg.parts.map(p => (typeof p === 'string' ? p : p.text || '')).join('');
                            } else if (typeof msg.parts === 'string') {
                                text = msg.parts;
                            }
                            if (text) {
                                const role = msg.role === 'user' ? 'user' : (msg.role === 'support' ? 'support' : 'bot');
                                addMessage(text, role);
                            }
                        });
                    }
                    if (data.needs_support) {
                        isLiveSupport = true;
                        agentTitle.textContent = "Live Support Agent";
                    }
                }
            } catch (e) {
                console.warn('Could not load chat history:', e);
            }
        }

        if (explicitSession) {
            loadHistory();
        } else {
            // Default initial welcome greeting
            addMessage("Hi! 👋 I'm Sophia AI, your assistant here. What brings you to our website today?", 'bot');
        }

        // 8. File Attachment Handlers
        attachBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                selectedFile = e.target.files[0];
                fileNameSpan.textContent = selectedFile.name;
                filePreview.style.display = 'flex';
            }
        });

        function clearFile() {
            selectedFile = null;
            fileInput.value = '';
            filePreview.style.display = 'none';
        }
        fileClearBtn.addEventListener('click', clearFile);

        // 9. Send Message Handler
        async function sendMessage() {
            let text = chatInput.value.trim();
            if (!text && !selectedFile) return;

            let uploadedFilename = null;

            if (selectedFile) {
                showTyping("Uploading attachment...");
                try {
                    const formData = new FormData();
                    formData.append("file", selectedFile);
                    const uploadRes = await fetch(`${BASE_URL}/upload/`, {
                        method: 'POST',
                        body: formData
                    });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        uploadedFilename = uploadData.filename;
                    }
                } catch (err) {
                    console.error("Upload failed:", err);
                }
            }

            let displayMsg = text;
            if (uploadedFilename) {
                displayMsg = `[Attached: ${uploadedFilename}]` + (text ? `\n${text}` : '');
                text = `[Attached file: ${uploadedFilename}]` + (text ? `\n${text}` : '');
            }

            addMessage(displayMsg, 'user');
            chatInput.value = '';
            clearFile();

            showTyping(isLiveSupport ? "Live Support · replying..." : "Assistant · typing...");

            if (isLiveSupport && chatSocket && chatSocket.readyState === WebSocket.OPEN) {
                chatSocket.send(JSON.stringify({
                    'message': text,
                    'sender': 'user'
                }));

                fetch(`${BASE_URL}/api/save_message/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': sessionId
                    },
                    body: JSON.stringify({
                        message: text,
                        role: 'user'
                    })
                }).catch(err => console.error('Error saving user message:', err));

                hideTyping();
            } else {
                try {
                    const response = await fetch(`${BASE_URL}/chat/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Session-ID': sessionId
                        },
                        body: JSON.stringify({ message: text })
                    });

                    const data = await response.json();
                    hideTyping();

                    const reply = data.reply || data.response || data.message || "I didn't receive a response.";
                    addMessage(reply, 'bot');
                } catch (error) {
                    hideTyping();
                    addMessage('Error: Server unreachable. Please try again later.', 'bot');
                    console.error('Chatbot error:', error);
                }
            }
        }

        // 10. Action and State Event Observers
        chatBtn.addEventListener('click', () => {
            const isVisible = chatWindow.style.display === 'flex';
            if (isVisible) {
                chatWindow.style.display = 'none';
                toggleIcon.innerHTML = chatBubbleSvg;
            } else {
                chatWindow.style.display = 'flex';
                toggleIcon.innerHTML = chevronDownSvg;
                chatInput.focus();
            }
        });

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatWindow.style.display = 'none';
            toggleIcon.innerHTML = chatBubbleSvg;
        });

        sendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSophiaChatbot);
    } else {
        initSophiaChatbot();
    }
})();