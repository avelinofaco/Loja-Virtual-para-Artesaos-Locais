document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    
    form.addEventListener("submit", async function(event) {
        event.preventDefault(); // Impede o envio do formulário padrão

        // Obter os dados do formulário
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Montar o corpo da requisição
        const requestData = {
            identifier: email,
            password: password
        };

        try {
            // Fazer a solicitação POST para a API de login do Strapi
            const response = await fetch("http://localhost:1337/api/auth/local", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            // Verificar se a resposta foi bem-sucedida
            if (response.ok) {
                const data = await response.json();
                
                // Salvar o token JWT em localStorage (ou sessionStorage, dependendo da necessidade)
                localStorage.setItem("jwt", data.jwt);

                // Redirecionar para a página do usuário ou para o catálogo
                window.location.href = "index.html"; // Altere para a página desejada após login
            } else {
                // Se a resposta não for bem-sucedida, mostrar erro
                const errorData = await response.json();
                alert("Erro de login: " + errorData.message[0].messages[0].message);
            }
        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
            alert("Ocorreu um erro, tente novamente mais tarde.");
        }
    });
});
