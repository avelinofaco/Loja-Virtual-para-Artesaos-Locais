document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        return;
    }

    let total = 0;

    cart.forEach(product => {
        // Criar um item do carrinho para cada produto
        const productElement = document.createElement("article");
        productElement.classList.add("cart-item");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <h3>${product.name}</h3>
                <p>R$ ${product.price.toFixed(2)}</p>
                <label for="quantity-${product.name}">Quantidade:</label>
                <input type="number" id="quantity-${product.name}" value="${product.quantity}" min="1">
                <button class="remove-item" data-product-name="${product.name}">Remover</button>
            </div>
        `;
        cartItemsContainer.appendChild(productElement);

        // Calcular o total
        total += product.price * product.quantity;
    });

    // Atualizar o total
    totalPriceElement.innerText = `R$ ${total.toFixed(2)}`;

    // Adicionar funcionalidade para remover item
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            const productName = this.getAttribute("data-product-name");

            // Filtra o produto removido
            const updatedCart = cart.filter(item => item.name !== productName);
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            // Recarrega a página para atualizar o carrinho
            location.reload();
        });
    });

    // Atualizar a quantidade do produto
    document.querySelectorAll(".item-details input").forEach(input => {
        input.addEventListener("input", function () {
            const productName = this.id.replace("quantity-", "");
            const quantity = parseInt(this.value);

            // Atualiza a quantidade no cart
            const updatedCart = cart.map(item => {
                if (item.name === productName) {
                    item.quantity = quantity;
                }
                return item;
            });

            // Salva no localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            // Atualiza o total
            updateTotal(updatedCart);
        });
    });
});

// Função para atualizar o total de forma eficiente
function updateTotal(cart) {
    const totalPriceElement = document.getElementById("total-price");
    let total = 0;
    cart.forEach(product => {
        total += product.price * product.quantity;
    });
    totalPriceElement.innerText = `R$ ${total.toFixed(2)}`;
}
