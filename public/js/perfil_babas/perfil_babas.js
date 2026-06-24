document.addEventListener("DOMContentLoaded", () => {
    if (window.babysiteAuth) {
        window.babysiteAuth.updateHeaderStatus("auth-status");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const babaId = urlParams.get("id");

    const perfilNome = document.getElementById("perfil-nome");
    const perfilDescricao = document.getElementById("perfil-descricao");
    const perfilTelefone = document.getElementById("perfil-telefone");
    const perfilCpf = document.getElementById("perfil-cpf");
    const perfilEmail1 = document.getElementById("perfil-email1");
    const perfilEmail2 = document.getElementById("perfil-email2");
    const perfilFoto = document.getElementById("perfil-foto");

    if (!babaId) {
        if (perfilDescricao) {
            perfilDescricao.textContent = "Babá não encontrada.";
        }
        return;
    }

    fetch(`/api/babas/${babaId}`)
        .then((response) => {
            if (!response.ok) throw new Error("Erro ao buscar dados da babá");
            return response.json();
        })
        .then((baba) => {
            const nomeSafe = baba.nome ? String(baba.nome).trim() : "Sem nome";

            if (perfilNome) perfilNome.textContent = nomeSafe;
            if (perfilDescricao) perfilDescricao.textContent = baba.biografia || "Sem descrição disponível.";
            if (perfilTelefone) perfilTelefone.textContent = baba.telefone || "-";
            if (perfilCpf) perfilCpf.textContent = baba.cpf || "-";
            if (perfilEmail1) perfilEmail1.textContent = baba.email || "-";
            if (perfilEmail2) perfilEmail2.textContent = baba.email_2 || "Não informado";

            if (perfilFoto) {
                perfilFoto.src = baba.foto_url || "../../img/placeholder.png";
                perfilFoto.alt = `Foto de ${nomeSafe}`;
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
            if (perfilDescricao) {
                perfilDescricao.textContent = "Erro ao carregar o perfil da babá.";
            }
        });

    function openAuthModal() {
        if (document.getElementById("auth-canvas")) return;

        const overlay = document.createElement("div");
        overlay.id = "auth-canvas";
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.6)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "9999";

        overlay.innerHTML = `
        <div style="width:90%;max-width:520px;background:#fff;padding:20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);">
            <h3 style="margin-top:0">Para entrar em contato</h3>
            <p>Faça login ou cadastre-se. Após login o site verifica sua conta e funções.</p>

            <div style="display:flex;gap:8px;margin-bottom:12px;">
                <button id="auth-cadastrar-baba" class="btn btn-outline-primary">Cadastrar como babá</button>
                <button id="auth-cadastrar-pais" class="btn btn-outline-secondary">Cadastrar como pais</button>
            </div>

            <hr>

            <form id="auth-login-form">
                <div class="mb-2">
                    <label class="form-label">Nome</label>
                    <input id="auth-nome" class="form-control" required />
                </div>
                <div class="mb-2">
                    <label class="form-label">Email (vinculado à conta)</label>
                    <input id="auth-email" type="email" class="form-control" required />
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                    <button id="auth-close" type="button" class="btn btn-link text-muted">Fechar</button>
                </div>
            </form>
        </div>`;

        document.body.appendChild(overlay);

        document.getElementById("auth-cadastrar-baba").addEventListener("click", () => {
            window.location.href = "/html/html_inclusao_babas/formulario/interface_inclusao_babas.html";
        });
        document.getElementById("auth-cadastrar-pais").addEventListener("click", () => {
            window.location.href = "/html/html_inclusao_respon/interface_inclusao_responsaveis.html";
        });
        document.getElementById("auth-close").addEventListener("click", () => {
            overlay.remove();
        });

        const form = document.getElementById("auth-login-form");
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const nome = document.getElementById("auth-nome").value.trim();
            const email = document.getElementById("auth-email").value.trim();
            if (!nome || !email) return alert("Informe nome e email.");

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Falha no login");

                const session = await window.babysiteAuth.login({ nome, email });
                alert("Login bem-sucedido. Roles: " + (session.roles || []).join(", "));
                window.babysiteAuth.updateHeaderStatus("auth-status");
                overlay.remove();
            } catch (error) {
                console.error("Erro login:", error);
                alert(error.message || "Erro no login.");
            }
        });
    }

    const btnContato = document.getElementById("btn-contato");
    if (btnContato) {
        btnContato.addEventListener("click", (event) => {
            event.preventDefault();
            openAuthModal();
        });
    }
});
