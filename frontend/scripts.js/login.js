document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita recarregamento da página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const userType = document.querySelector('input[name="userType"]:checked')?.value || "";

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

            console.log("Dados do usuário após login:", data);

            if (userType === "Artesao") {
                verificarAcessoArtesao();
            } else {
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error(" Erro no login:", error);
            alert(error.message);
        }
    });
});

async function verificarAcessoArtesao() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Erro na resposta do servidor: ${response.status}`);

        const usuario = await response.json();

        const roleName = usuario.role?.name?.toLowerCase();
        console.log("🔹 Papel do usuário:", roleName);

        setTimeout(() => {
            if (usuario.username === "Artesao") {
                window.location.href = "cadastrarProduto.html";
            }
            else {
                window.location.href = "index.html";
            }
        }, 3000);

    } catch (error) {
        console.error("Erro ao verificar usuário:", error);;
        window.location.href = "login.html";
    }
}
