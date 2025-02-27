
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregamento da página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:1337/api/auth/local", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, password: password }),
            });

            if (!response.ok) throw new Error("Falha no login. Verifique suas credenciais.");

            const data = await response.json();
            localStorage.setItem("jwt", data.jwt);
            localStorage.setItem("userId", data.user.id);
            
            verificarAcesso();
            
        } catch (error) {
            console.error("Erro no login:", error);
        }
    });
});

async function verificarAcesso() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:1337/api/users/me?populate=role", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Erro na resposta do servidor: ${response.status}`);

        const usuario = await response.json();

        if (!usuario.role || !usuario.role.name) {
            console.error("Erro: A resposta do Strapi não contém a role do usuário.");
            window.location.href = "index.html";
            return;
        }

        // Redirecionamento conforme a role do usuário
        const roleName = usuario.role.name.toLowerCase();
        if (roleName === "artesao") {
            window.location.href = "cadastrarProduto.html";

        }else if (roleName === "administrador") {
            window.location.href = "cadastrarUsuario.html";

        }
        else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        // window.location.href = "index.html";
    }
}
