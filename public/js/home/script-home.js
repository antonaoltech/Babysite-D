document.addEventListener('DOMContentLoaded', function() {
    if (window.babysiteAuth) {
        window.babysiteAuth.updateHeaderStatus('auth-status');
    }
    // ==========================================
    // 1. MAPEAMENTO DE ELEMENTOS DO DOM
    // ==========================================
    const carousel = document.getElementById("carousel-container");
    const searchInput = document.getElementById("pesquisar");
    const btnBaba = document.getElementById('baba');
    const btnResponsavel = document.getElementById('responsavel');
    const btnSettings = document.getElementById('settings-btn');
    const btnLeft = document.getElementById('left');
    const btnRight = document.getElementById('right');
    
    let listaOriginal = []; // Variável global para armazenar os dados da API

    // ==========================================
    // 2. CARREGAMENTO VIA API
    // ==========================================
    async function carregarDadosDaAPI() {
        try {
            // Ajuste aqui para a rota final da sua API
            const res = await fetch('/api/babas'); 
            
            if (!res.ok) throw new Error("Erro ao conectar com o servidor");
            
            listaOriginal = await res.json();
            renderizarBabas(listaOriginal);
        } catch (erro) {
            console.error("Erro no carregamento:", erro);
            if (carousel) {
                carousel.innerHTML = `
                    <div class="p-5 text-center w-100">
                        <p class="text-danger fw-bold">Erro ao carregar babás. Verifique se o servidor da API está rodando.</p>
                    </div>`;
            }
        }
    }

    // ==========================================
    // 3. RENDERIZAÇÃO DOS CARDS (COM REDIRECIONAMENTO NO BOTÃO)
    // ==========================================
    function renderizarBabas(lista) {
        if (!carousel) return;

        // Se o JSON estiver vazio ou a busca não retornar nada
        if (lista.length === 0) {
            carousel.innerHTML = "<p class='text-muted w-100 text-center p-4 fw-bold'>Nenhuma babá encontrada.</p>";
            return;
        }

        // Gera o HTML dos cards baseando-se no array que foi passado
        carousel.innerHTML = lista.map(baba => `
            <div class="card shadow-sm mx-2 d-inline-block" style="min-width: 280px; max-width: 280px; flex: 0 0 auto; border-radius: 15px;">
                <img src="${baba.foto_perfil_nome || '../../img/placeholder.png'}" 
                     class="card-img-top" 
                     alt="Foto de ${baba.nome}" 
                     style="height: 250px; object-fit: cover; border-radius: 15px 15px 0 0;">
                <div class="card-body text-start">
                    <h5 class="card-title fw-bold text-dark">${baba.nome}</h5>
                    
                    <div class="d-flex justify-content-end mb-2">
                        <button onclick="abrirPerfilBaba('${baba.codigo_baba || baba.id || ''}')" class="btn btn-outline-primary btn-sm fw-bold rounded-pill">
                            Ver Perfil
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        iniciarLogicaCarrossel();
    }

    // FUNÇÃO NOVA EXTRA: Executa a abertura da nova página enviando o ID pela URL
    window.abrirPerfilBaba = function(id) {
        const profileUrl = `html/html_perfil_babas/perfil_babas.html?id=${id}`;
        if (window.babysiteAuth && !window.babysiteAuth.isLoggedIn()) {
            openAuthCanvas(profileUrl);
            return;
        }
        window.location.href = profileUrl;
    };

    function openAuthCanvas(redirectUrl) {
        if (document.getElementById('auth-canvas')) return;

        const overlay = document.createElement('div');
        overlay.id = 'auth-canvas';
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0.65)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.padding = '20px';

        overlay.innerHTML = `
            <div style="width:100%;max-width:520px;background:#ffffff;border-radius:18px;box-shadow:0 16px 48px rgba(0,0,0,0.25);padding:24px;position:relative;">
                <button id="auth-close" type="button" style="position:absolute;top:14px;right:14px;background:transparent;border:none;font-size:1.2rem;color:#6c757d;cursor:pointer;">×</button>
                <h3 style="margin-top:0;margin-bottom:12px;color:#212529;">Acesse antes de ver o perfil</h3>
                <p style="margin-bottom:18px;color:#495057;line-height:1.6;">Você precisa fazer login para ver os dados completos da babá. Faça login abaixo ou cadastre-se primeiro.</p>

                <div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;">
                    <button id="auth-cadastrar-baba" class="btn btn-outline-primary" type="button" style="flex:1;min-width:130px;">Cadastrar como babá</button>
                    <button id="auth-cadastrar-pais" class="btn btn-outline-secondary" type="button" style="flex:1;min-width:130px;">Cadastrar como pai/mãe</button>
                </div>

                <form id="auth-login-form">
                    <div class="mb-3">
                        <label class="form-label">Nome</label>
                        <input id="auth-nome" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input id="auth-email" type="email" class="form-control" required />
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button type="submit" class="btn btn-primary">Entrar</button>
                        <button id="auth-close-secondary" type="button" class="btn btn-link text-muted">Cancelar</button>
                    </div>
                </form>
            </div>`;

        document.body.appendChild(overlay);

        const closeOverlay = () => {
            overlay.remove();
        };

        overlay.querySelector('#auth-close')?.addEventListener('click', closeOverlay);
        overlay.querySelector('#auth-close-secondary')?.addEventListener('click', closeOverlay);
        overlay.querySelector('#auth-cadastrar-baba')?.addEventListener('click', () => {
            closeOverlay();
            window.location.href = 'html/html_inclusao_babas/formulario/interface_inclusao_babas.html';
        });
        overlay.querySelector('#auth-cadastrar-pais')?.addEventListener('click', () => {
            closeOverlay();
            window.location.href = 'html/html_inclusao_respon/interface_inclusao_responsaveis.html';
        });

        const form = overlay.querySelector('#auth-login-form');
        form?.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nome = document.getElementById('auth-nome').value.trim();
            const email = document.getElementById('auth-email').value.trim();

            if (!nome || !email) return alert('Informe nome e email para continuar.');

            try {
                const session = await window.babysiteAuth.login({ nome, email });
                window.babysiteAuth.updateHeaderStatus('auth-status');
                closeOverlay();
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            } catch (error) {
                alert(error.message || 'Erro ao fazer login. Verifique seus dados.');
            }
        });
    }

    // ==========================================
    // 4. PESQUISA (FILTRO DINÂMICO)
    // ==========================================
    searchInput?.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase().trim(); 
        
        // Filtra a lista original baseada no que foi digitado
        const filtradas = listaOriginal.filter(baba => 
            baba.nome.toLowerCase().includes(termoBusca)
        );
        
        // Renderiza apenas os resultados da busca
        renderizarBabas(filtradas); 
    });

    // ==========================================
    // 5. NAVEGAÇÃO
    // ==========================================
    btnBaba?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "html/html_inclusao_babas/formulario/interface_inclusao_babas.html";
    });

    btnResponsavel?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "html/html_inclusao_respon/interface_inclusao_responsaveis.html";
    });

    btnSettings?.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsCanvas();
    });

    // ==========================================
    // 6. MOTOR DO CARROSSEL
    // ==========================================
    function iniciarLogicaCarrossel() {
        const firstCard = carousel?.querySelector(".card");
        if (!firstCard) return;
        
        // Largura do card + a margem (mx-2)
        const cardWidth = firstCard.offsetWidth + 16; 

        if (btnLeft) {
            btnLeft.onclick = () => {
                carousel.scrollLeft -= cardWidth;
            };
        }

        if (btnRight) {
            btnRight.onclick = () => {
                carousel.scrollLeft += cardWidth;
            };
        }

        // Opcional: Ocultar as setas se chegar no fim/início
        carousel.onscroll = () => {
            let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
            if (btnLeft) btnLeft.style.visibility = carousel.scrollLeft <= 5 ? "hidden" : "visible";
            if (btnRight) btnRight.style.visibility = carousel.scrollLeft >= scrollWidth - 5 ? "hidden" : "visible";
        };
    }

    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================
    carregarDadosDaAPI();

    function openSettingsCanvas() {
        if (document.getElementById('settings-canvas')) return;

        const loggedIn = window.babysiteAuth?.isLoggedIn();
        const userName = loggedIn ? window.babysiteAuth.getDisplayName() : null;

        const overlay = document.createElement('div');
        overlay.id = 'settings-canvas';
        overlay.className = 'settings-overlay';
        overlay.innerHTML = `
            <div class="settings-panel shadow-sm">
                <aside class="settings-sidebar">
                    <div class="settings-sidebar-brand mb-4 text-center">
                        <img src="../../css/logo_do_babysite.ico" alt="Logo Babysite" width="48" height="48" class="rounded-circle border border-2 border-babysite">
                        <p class="mt-2 mb-0 text-white small">Configurações</p>
                    </div>
                    <button class="settings-tab active" type="button">
                        <span class="material-icons">person</span>
                        Conta
                    </button>
                </aside>
                <section class="settings-content">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h3 class="mb-1">Sua conta</h3>
                            <p class="text-muted mb-0">Aqui você pode encerrar sua sessão.</p>
                        </div>
                        <button id="settings-close" type="button" class="btn btn-sm btn-outline-secondary">Fechar</button>
                    </div>
                    <div class="settings-body">
                        <p class="mb-3">${loggedIn ? `Sessão ativa como <strong>${userName}</strong>.` : 'Nenhuma sessão ativa.'}</p>
                        ${loggedIn ? '<button id="logout-btn" class="btn btn-danger">Sair da conta</button>' : '<div class="alert alert-secondary py-2">Entre no site para acessar sua conta.</div>'}
                    </div>
                </section>
            </div>
        `;

        document.body.appendChild(overlay);

        const closeOverlay = () => overlay.remove();
        overlay.querySelector('#settings-close')?.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closeOverlay();
        });

        overlay.querySelector('#logout-btn')?.addEventListener('click', () => {
            if (!window.babysiteAuth) return;
            window.babysiteAuth.clearSession();
            window.babysiteAuth.updateHeaderStatus('auth-status');
            closeOverlay();
            alert('Você saiu da sua conta.');
        });
    }
});