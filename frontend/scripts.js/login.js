// document.addEventListener("DOMContentLoaded", function() {
//     const form = document.querySelector("form");
    
//     form.addEventListener("submit", async function(event) {
//         event.preventDefault(); // Impede o envio do formulário padrão

//         // Obter os dados do formulário
//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;

//         // Montar o corpo da requisição
//         const requestData = {
//             identifier: email,
//             password: password
//         };

//         try {
//             // Fazer a solicitação POST para a API de login do Strapi
//             const response = await fetch("http://localhost:1337/api/auth/local", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify(requestData)
//             });

//             // Verificar se a resposta foi bem-sucedida
//             if (response.ok) {
//                 const data = await response.json();
                
//                 // Salvar o token JWT em localStorage (ou sessionStorage, dependendo da necessidade)
//                 localStorage.setItem("jwt", data.jwt);

//                 // Redirecionar para a página do usuário ou para o catálogo
//                 window.location.href = "index.html"; // Altere para a página desejada após login
//             } else {
//                 // Se a resposta não for bem-sucedida, mostrar erro
//                 const errorData = await response.json();
//                 alert("Erro de login: " + errorData.message[0].messages[0].message);
//             }
//         } catch (error) {
//             console.error("Erro ao fazer a requisição:", error);
//             alert("Ocorreu um erro, tente novamente mais tarde.");
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const userType = document.querySelector('input[name="userType"]:checked').value; // Captura o tipo de usuário selecionado

        try {
            
            const response = await fetch("http://localhost:1337/api/auth/local", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error("Falha no login. Verifique suas credenciais.");
            }

            const data = await response.json();
            localStorage.setItem("jwt", data.jwt); // Armazena o token no localStorage

            // Verifica o tipo de usuário antes de redirecionar
            if (userType === "artesao") {
                verificarAcessoArtesao(); // Chama a função para validar e redirecionar o artesão
            } else {
                window.location.href = "index.html"; // Usuário comum vai para o catálogo
            }
        } catch (error) {
            alert(error.message);
        }
    });
});

// Função para verificar acesso de artesão e redirecionar
async function verificarAcessoArtesao() {
    const token = localStorage.getItem("jwt");

    if (!token) {
        alert("Acesso negado! Faça login como artesão.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:1337/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const usuario = await response.json();

        if (usuario.role.name !== "artesão") {
            alert("Acesso restrito! Apenas artesãos podem acessar esta página.");
            window.location.href = "index.html";
        } else {
            window.location.href = "cadastro.html"; // Redireciona para a tela de cadastro do artesão
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        alert("Erro ao verificar permissões. Faça login novamente.");
        window.location.href = "login.html";
    }
}
