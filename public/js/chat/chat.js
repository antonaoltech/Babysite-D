document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const babaId = urlParams.get('id');

    const chatBabaName = document.getElementById('chat-baba-name');
    const chatBabaAvatar = document.getElementById('chat-baba-avatar');
    const chatBabaStatus = document.getElementById('chat-baba-status');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatInfo = document.getElementById('chat-info');
    const authStatus = document.getElementById('chat-auth-status');
    const chatLoginBtn = document.getElementById('chat-login-btn');

    function updateAuthControls() {
        if (!window.babysiteAuth) return;
        const online = navigator.onLine;
        const logged = window.babysiteAuth.isLoggedIn();

        if (logged) {
            authStatus.textContent = `Olá, ${window.babysiteAuth.getDisplayName()}`;
            chatLoginBtn.textContent = 'Sair';
        } else {
            authStatus.textContent = 'Faça login para conversar';
            chatLoginBtn.textContent = 'Entrar';
        }

        if (!online) {
            chatInput.disabled = true;
            chatSend.disabled = true;
            chatInfo.textContent = 'Sem conexão. Conecte-se à internet para enviar mensagens.';
            chatInfo.classList.remove('d-none');
            return;
        }

        if (!logged) {
            chatInput.disabled = true;
            chatSend.disabled = true;
            chatInfo.textContent = 'Você precisa entrar para enviar mensagens.';
            chatInfo.classList.remove('d-none');
            return;
        }

        chatInput.disabled = false;
        chatSend.disabled = true;
        chatInfo.classList.add('d-none');
    }

    function updateConnectionStatus() {
        const connected = navigator.onLine;
        const connectionStatus = document.getElementById('chat-connection-status');
        if (connectionStatus) {
            connectionStatus.textContent = connected ? 'Online' : 'Offline';
            connectionStatus.style.color = connected ? '#d8f8d8' : '#ffdddd';
        }

        if (chatBabaStatus && chatBabaStatus.textContent !== 'Babá não encontrada') {
            chatBabaStatus.textContent = connected ? 'Online' : 'Offline';
        }

        updateAuthControls();
    }

    function loadBaba() {
        if (!babaId) {
            chatBabaName.textContent = 'Babá não encontrada';
            chatBabaStatus.textContent = 'ID ausente';
            return;
        }

        fetch(`/api/babas/${babaId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Perfil não encontrado');
                return res.json();
            })
            .then((baba) => {
                chatBabaName.textContent = baba.nome || 'Babá';
                chatBabaAvatar.src = baba.foto_url || '../../img/placeholder.png';
                chatBabaStatus.textContent = 'Online';
            })
            .catch((err) => {
                console.error(err);
                chatBabaName.textContent = 'Babá não encontrada';
                chatBabaStatus.textContent = 'Erro ao carregar';
            });
    }

    if (window.babysiteAuth) {
        updateAuthControls();
    }
    updateConnectionStatus();

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    loadBaba();

    chatLoginBtn?.addEventListener('click', () => {
        if (!window.babysiteAuth) return;
        if (window.babysiteAuth.isLoggedIn()) {
            window.babysiteAuth.clearSession();
            window.babysiteAuth.updateHeaderStatus('auth-status');
            updateAuthControls();
            chatInfo.textContent = 'Você saiu. Faça login novamente para enviar mensagens.';
            chatInfo.classList.remove('d-none');
            return;
        }

        window.location.href = '../html_home/home.html';
    });

    chatInput?.addEventListener('input', () => {
        if (!chatInput) return;
        const hasText = chatInput.value.trim().length > 0;
        chatSend.disabled = !hasText || !window.babysiteAuth?.isLoggedIn();
    });

    chatSend?.addEventListener('click', () => {
        if (!chatInput || !chatMessages) return;
        const message = chatInput.value.trim();
        if (!message) return;

        appendMessage('user', message);
        chatInput.value = '';
        chatSend.disabled = true;

        setTimeout(() => {
            appendMessage('baba', 'Oi! Recebi sua mensagem. Em breve te respondo.');
        }, 700);
    });

    function appendMessage(type, message) {
        if (!chatMessages) return;
        const item = document.createElement('div');
        item.className = `chat-bubble ${type}`;
        item.textContent = message;
        chatMessages.appendChild(item);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
