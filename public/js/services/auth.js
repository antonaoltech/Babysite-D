(function () {
    const SESSION_KEY = 'babysite_session';

    function saveSession(session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    function getSession() {
        try {
            return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        } catch (error) {
            console.warn('Erro ao ler sessão:', error);
            return null;
        }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
    }

    async function login({ nome, email }) {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email })
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || 'Falha no login');
        }

        const session = {
            token: data.token,
            usuario: data.usuario || null,
            roles: data.roles || [],
            loggedAt: new Date().toISOString()
        };

        saveSession(session);
        return session;
    }

    function isLoggedIn() {
        const session = getSession();
        return Boolean(session && session.token);
    }

    function getCurrentUser() {
        return getSession()?.usuario || null;
    }

    function getCurrentRoles() {
        return getSession()?.roles || [];
    }

    function getDisplayName() {
        const user = getCurrentUser();
        return user?.nome || 'Usuário';
    }

    function updateHeaderStatus(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (!isLoggedIn()) {
            element.textContent = 'Faça login para entrar no seu perfil';
            element.classList.remove('text-success');
            element.classList.add('text-white');
            return;
        }

        const nome = getDisplayName();
        const roles = getCurrentRoles().join(', ') || 'usuário';
        element.textContent = `Olá, ${nome} • ${roles}`;
        element.classList.remove('text-white');
        element.classList.add('text-success');
    }

    window.babysiteAuth = {
        saveSession,
        getSession,
        clearSession,
        login,
        isLoggedIn,
        getCurrentUser,
        getCurrentRoles,
        getDisplayName,
        updateHeaderStatus
    };
})();
