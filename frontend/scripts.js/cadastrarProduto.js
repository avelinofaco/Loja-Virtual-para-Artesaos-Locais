const apiUrl = 'http://localhost:1337/api/produtos'; // URL da sua API do Strapi
localStorage.setItem("jwt", data.jwt); // Substitua com seu token de autenticação

// Função para cadastrar um novo produto
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value;

    const productData = {
        data: {
            Nome: name,
            preco: price,
            Descricao: description,
            Imagem: image
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();
        
        // Verificar se o status da resposta é 2xx (sucesso)
        if (response.ok) {
            alert('Produto cadastrado com sucesso!');
            loadProducts(); // Atualiza a lista de produtos
            // Limpar os campos do formulário após o cadastro
            document.getElementById('productForm').reset(); // Limpa todos os campos do formulário
        } else {
            // Exibir a mensagem de erro detalhada
            console.error('Erro ao cadastrar produto:', result);
            alert(`Erro ao cadastrar produto: ${result.error ? result.error.message : 'Erro desconhecido'}`);
        }
    } catch (error) {
        // Erro na requisição
        console.error('Erro ao enviar requisição:', error);
        alert('Erro ao cadastrar produto: ' + error.message);
    }
});

// Função para carregar todos os produtos
async function loadProducts() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const products = await response.json();
            const productList = document.getElementById('productList');
            productList.innerHTML = ''; // Limpa a lista antes de adicionar os novos produtos
            
            // Exibe os produtos na tela
            products.data.forEach(product => {
                const productItem = document.createElement('li');
                productItem.innerHTML = `
                    <strong>${product.attributes.Nome}</strong><br>
                    Preço: R$ ${product.attributes.preco}<br>
                    Descrição: ${product.attributes.Descricao}<br>
                    <button onclick="deleteProduct(${product.id})">Excluir</button>
                `;
                productList.appendChild(productItem);
            });
        } else {
            console.error('Erro ao carregar produtos');
            alert('Erro ao carregar produtos');
        }
    } catch (error) {
        console.error('Erro na requisição GET:', error);
        alert('Erro ao carregar produtos');
    }
}

// Função para excluir um produto
async function deleteProduct(productId) {
    const confirmDelete = confirm('Você tem certeza que deseja excluir este produto?');
    
    if (confirmDelete) {
        try {
            const response = await fetch(`${apiUrl}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Produto excluído com sucesso!');
                loadProducts(); // Atualiza a lista de produtos
            } else {
                console.error('Erro ao excluir produto');
                alert('Erro ao excluir produto');
            }
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            alert('Erro ao excluir produto');
        }
    }
}

// Carrega os produtos assim que a página for carregada
document.addEventListener('DOMContentLoaded', loadProducts);
