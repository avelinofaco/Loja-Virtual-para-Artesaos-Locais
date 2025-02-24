document.addEventListener("DOMContentLoaded", loadCartItems);

document.getElementById("pay-button").addEventListener("click", function (event) {
    event.preventDefault();
    loadCartItems();

    const cardNumber = document.getElementById("card-number").value;
    const cardName = document.getElementById("card-name").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
        document.getElementById("message").textContent = "Por favor, preencha todos os campos.";
        return;
    }

    fetch(
        `http://localhost:1337/api/cartaos?numero=${encodeURIComponent(cardNumber)}&nome=${encodeURIComponent(cardName.trim())}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro na requisição à API");
            }
            return response.json();
        })
        .then((data) => {
            if (data && data.data && data.data.length > 0) {
                let paymentSuccess = false;
    
                for (const card of data.data) {
                    const numeroFormatado = card.numero.trim();
                    const nomeFormatado = card.nome.trim().toLowerCase();
                    const validadeFormatada = card.validade.trim().replace(/\s/g, "");
                    const cvvFormatado = card.cvv.trim();
    
                    if (
                        numeroFormatado === cardNumber.trim() &&
                        nomeFormatado === cardName.trim().toLowerCase() &&
                        cvvFormatado === cvv.trim() &&
                        validadeFormatada === expiryDate.replace(/\s/g, "")
                    ) {
                        paymentSuccess = true;
                        break;
                    }
                }
    
                const messageElement = document.getElementById("message");
    
                if (paymentSuccess) {
                    messageElement.textContent = "Pagamento realizado com sucesso!";
                    messageElement.style.color = "green";
    
                    const cart = JSON.parse(localStorage.getItem("cart")) || [];
                    localStorage.setItem("pedidosFinalizados", JSON.stringify(cart));
                    localStorage.removeItem("cart");
    
                    setTimeout(() => {
                        window.location.href = "acompanharPedidos.html";
                    }, 1500);
                } else {
                    messageElement.textContent = "Erro no pagamento: Dados do cartão não correspondem.";
                    messageElement.style.color = "red";
                }
            } else {
                document.getElementById("message").textContent = "Erro no pagamento: Nenhum cartão cadastrado.";
                document.getElementById("message").style.color = "red";
            }
        })
        .catch((error) => {
            console.error("Erro:", error);
            document.getElementById("message").textContent = "Erro ao processar o pagamento.";
            document.getElementById("message").style.color = "red";
        });
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Itens do carrinho:", cart);

    const productContainer = document.querySelector(".product-details");
    productContainer.innerHTML = "<h3>Detalhes do Produto</h3>";

    let totalPrice = 0;

    if (!Array.isArray(cart) || cart.length === 0) {
        productContainer.innerHTML += "<p>Seu carrinho está vazio.</p>";
        return;
    }

    cart.forEach((item, index) => {
        const imageUrl = item.image || "https://via.placeholder.com/150";

        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <p><strong>Nome:</strong> ${item.name || "Nome indisponível"}</p>
            <p><strong>Preço:</strong> R$ ${(item.price ? parseFloat(item.price).toFixed(2) : "0.00")}</p>
            <button class="remove-button" data-index="${index}">Remover</button>
        `;
        productContainer.appendChild(productElement);
        totalPrice += parseFloat(item.price || 0);
    });

    const totalPriceElement = document.createElement("p");
    totalPriceElement.innerHTML = `<strong>Total da Compra:</strong> R$ ${totalPrice.toFixed(2)}`;
    productContainer.appendChild(totalPriceElement);

    document.querySelectorAll(".remove-button").forEach((button) => {
        button.addEventListener("click", function () {
            removeCartItem(button.getAttribute("data-index"));
        });
    });
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCartItems();
}
