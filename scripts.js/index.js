document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".search-container input");
    const productCards = document.querySelectorAll(".product-card");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();

        productCards.forEach(card => {
            const productName = card.querySelector("h3").innerText.toLowerCase();
            if (productName.includes(searchText)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });

    document.querySelectorAll("#button-car").forEach(button => {
        button.addEventListener("click", function () {
            const card = this.closest(".product-card");
            const productName = card.querySelector("h3").innerText;
            const productPrice = card.querySelector("strong").innerText.replace("R$ ", "");
            const productImage = card.querySelector("img").src;

            const product = {
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            };

            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Produto adicionado ao carrinho!");
        });
    });
});
