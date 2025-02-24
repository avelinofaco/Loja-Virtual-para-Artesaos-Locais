// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.querySelector("form");

//     form.addEventListener("submit", async function (event) {
//         event.preventDefault(); // Evita recarregamento da página

//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;
//         const userType = document.querySelector('input[name="userType"]:checked')?.value || "";

//         try {
//             const response = await fetch("http://localhost:1337/api/auth/local", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ identifier: email, password: password }),
//             });

//             if (!response.ok) throw new Error("Falha no login. Verifique suas credenciais.");

//             const data = await response.json();
//             localStorage.setItem("jwt", data.jwt);
//             localStorage.setItem("userId", data.user.id);

//             console.log("Dados do usuário após login:", data);

//             if (userType === "Artesão") {
//                 verificarAcessoArtesao();
//             } else {
//                 window.location.href = "index.html";
//             }
//         } catch (error) {
//             console.error(" Erro no login:", error);
//             alert(error.message);
//         }
//     });
// });

// async function verificarAcessoArtesao() {
//     const token = localStorage.getItem("jwt");
//     if (!token) {
//         window.location.href = "login.html";
//         return;
//     }

//     try {
//         const response = await fetch("http://localhost:1337/api/users/me?populate=role", {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` }
//         });

//         if (!response.ok) throw new Error(`Erro na resposta do servidor: ${response.status}`);

//         const usuario = await response.json();
//         setTimeout(() => {
//             if (usuario.role === "artesao") {
//                 window.location.href = "cadastrarProduto.html";
//             }
//             else {
//                 window.location.href = "index.html";
//             }
//         }, 8000);

//     } catch (error) {
//         console.error("Erro ao verificar usuário:", error);;
//         window.location.href = "login.html";
//     }
// }
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
                console.log(userType)
                verificarAcessoArtesao();
            } else {
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Erro no login:", error);
            alert(error.message);
        }
    });
});

async function verificarAcessoArtesao() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.log("Token não encontrado. Redirecionando para login.");
        window.location.href = "login.html";
        return;
    }

    try {
        console.log("Fazendo requisição para obter detalhes do usuário...");
        const response = await fetch("http://localhost:1337/api/users/me?populate=role", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Erro na resposta do servidor: ${response.status}`);

        const usuario = await response.json();
        console.log("Resposta do servidor (usuário):", usuario);

        // Verificando se a role está presente na resposta
        if (!usuario.role) {
            console.error("Erro: A resposta do Strapi não contém a role do usuário.");
            alert("Erro ao identificar o tipo de usuário. Contate o suporte.");
            window.location.href = "index.html";
            return;
        }

        console.log("Papel do usuário:", usuario.role);

        if (usuario.role.name.toLowerCase() === "artesão") {
            console.log("Usuário é um artesão. Redirecionando...");
            window.location.href = "cadastrarProduto.html";
        } else {
            console.log("Usuário não é um artesão. Redirecionando para index.");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        alert("Erro ao carregar dados do usuário.");
        window.location.href = "login.html";
    }
}
