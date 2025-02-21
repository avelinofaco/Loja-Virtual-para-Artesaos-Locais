// document.getElementById('pay-button').addEventListener('click', function(event) {
//     event.preventDefault(); // Impede o envio do formulário padrão

//     // Obtém os valores dos campos do formulário
//     const cardNumber = document.getElementById('card-number').value;
//     const cardName = document.getElementById('card-name').value;
//     const expiryDate = document.getElementById('expiry-date').value;
//     const cvv = document.getElementById('cvv').value;

//     // Validação simples dos dados
//     if (!cardNumber || !cardName || !expiryDate || !cvv) {
//         document.getElementById('message').textContent = "Por favor, preencha todos os campos.";
//         return;
//     }

//     // Realizando uma requisição GET para verificar os dados do cartão
//     fetch(`http://localhost:1337/api/cartaos?numero=${cardNumber}&nome=${encodeURIComponent(cardName)}`) // Substitua pela URL da sua API
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Erro na requisição à API');
//             }
//             return response.json(); // Converte a resposta em JSON
//         })
//         .then(data => {
//             console.log('Dados recebidos da API:', data); // Adiciona log para depuração

//             // Verifica se algum cartão foi encontrado
//             if (data && data.data && data.data.length > 0) {
//                 let paymentSuccess = false; // Variável para rastrear se o pagamento foi bem-sucedido

//                 // Itera sobre todos os cartões retornados
//                 for (const card of data.data) {
//                     // Verifica se os dados do cartão correspondem
//                     if (card.numero === cardNumber && card.nome === cardName && card.cvv === cvv && card.validade === expiryDate) {
//                         paymentSuccess = true; // Define como verdadeiro se um cartão correspondente for encontrado
//                         break; // Sai do loop se o cartão correspondente for encontrado
//                     }
//                 }

//                 // Exibe a mensagem com base no resultado da validação
//                 if (paymentSuccess) {
//                     document.getElementById('message').textContent = "Pagamento realizado com sucesso!";
//                     document.getElementById('message').style.color = "green";
//                 } else {
//                     document.getElementById('message').textContent = "Erro no pagamento: Dados do cartão não correspondem.";
//                     document.getElementById('message').style.color = "red";
//                 }
//             } else {
//                 // Caso nenhum cartão seja encontrado
//                 document.getElementById('message').textContent = "Erro no pagamento: Cartão não encontrado.";
//                 document.getElementById('message').style.color = "red";
//             }
//         })
//         .catch(error => {
//             console.error('Erro:', error); // Exibe erros no console
//             document.getElementById('message').textContent = "Erro ao processar o pagamento.";
//             document.getElementById('message').style.color = "red";
//         });
//         // Função para obter detalhes do produto da API
// async function fetchProductDetails() {
//     try {
//         const response = await fetch('http://localhost:1337/api/produtos');
//         const data = await response.json(); // Assume que a resposta da API é JSON
        
//         if (response.ok) {
//             // Preenchendo os campos do produto com os dados da API
//             document.querySelector('.product-details p strong:nth-child(1)').nextSibling.textContent = data.nome;
//             document.querySelector('.product-details p strong:nth-child(2)').nextSibling.textContent = data.descricao;
//             document.querySelector('.product-details p strong:nth-child(3)').nextSibling.textContent = `R$ ${data.preco.toFixed(2)}`;
//         } else {
//             console.error('Erro ao buscar os detalhes do produto:', data);
//         }
//     } catch (error) {
//         console.error('Erro ao fazer requisição para a API:', error);
//     }
// }

// // Chama a função ao carregar a página
// document.addEventListener('DOMContentLoaded', fetchProductDetails);

// });
document.getElementById('pay-button').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário padrão

    // Obtém os valores dos campos do formulário
    const cardNumber = document.getElementById('card-number').value;
    const cardName = document.getElementById('card-name').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;

    // Validação simples dos dados
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
        document.getElementById('message').textContent = "Por favor, preencha todos os campos.";
        return;
    }

    // Realizando uma requisição GET para verificar os dados do cartão
    fetch(`http://localhost:1337/api/cartaos?numero=${cardNumber}&nome=${encodeURIComponent(cardName)}`) // Substitua pela URL da sua API
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição à API');
            }
            return response.json(); // Converte a resposta em JSON
        })
        .then(data => {
            console.log('Dados recebidos da API:', data); // Adiciona log para depuração

            // Verifica se algum cartão foi encontrado
            if (data && data.data && data.data.length > 0) {
                let paymentSuccess = false; // Variável para rastrear se o pagamento foi bem-sucedido

                // Itera sobre todos os cartões retornados
                for (const card of data.data) {
                    // Verifica se os dados do cartão correspondem
                    if (card.numero === cardNumber && card.nome === cardName && card.cvv === cvv && card.validade === expiryDate) {
                        paymentSuccess = true; // Define como verdadeiro se um cartão correspondente for encontrado
                        break; // Sai do loop se o cartão correspondente for encontrado
                    }
                }

                // Exibe a mensagem com base no resultado da validação
                if (paymentSuccess) {
                    document.getElementById('message').textContent = "Pagamento realizado com sucesso!";
                    document.getElementById('message').style.color = "green";
                } else {
                    document.getElementById('message').textContent = "Erro no pagamento: Dados do cartão não correspondem.";
                    document.getElementById('message').style.color = "red";
                }
            } else {
                // Caso nenhum cartão seja encontrado
                document.getElementById('message').textContent = "Erro no pagamento: Cartão não encontrado.";
                document.getElementById('message').style.color = "red";
            }
        })
        .catch(error => {
            console.error('Erro:', error); // Exibe erros no console
            document.getElementById('message').textContent = "Erro ao processar o pagamento.";
            document.getElementById('message').style.color = "red";
        });

    // Função para obter detalhes do produto da API
    async function fetchProductDetails() {
        try {
            const response = await fetch('http://localhost:1337/api/produtos');
            const data = await response.json(); // Assume que a resposta da API é JSON
            
            if (response.ok) {
                // Preenchendo os campos do produto com os dados da API
                document.querySelector('.product-details p strong:nth-child(1)').nextSibling.textContent = data.nome;
                document.querySelector('.product-details p strong:nth-child(2)').nextSibling.textContent = data.descricao;
                document.querySelector('.product-details p strong:nth-child(3)').nextSibling.textContent = `R$ ${data.preco.toFixed(2)}`;
            } else {
                console.error('Erro ao buscar os detalhes do produto:', data);
            }
        } catch (error) {
            console.error('Erro ao fazer requisição para a API:', error);
        }
    }

    // Chama a função ao carregar a página
    document.addEventListener('DOMContentLoaded', fetchProductDetails);
});
