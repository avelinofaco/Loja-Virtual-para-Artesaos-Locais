
document.addEventListener("DOMContentLoaded", loadCartItems);
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM totalmente carregado.");
    await carregarCartaoDoUsuario();
    loadCartItems();
});

async function carregarCartaoDoUsuario() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.warn("Usuário não autenticado.");
        return;
    }

    try {
        const usuario = await buscarUsuario(token);
        if (!usuario) return;

        console.log("Buscando cartão do usuário...");
        const cartaoResponse = await fetch(
            `http://localhost:1337/api/cartaos?filters[usuario][id][$eq]=${usuario.id}&populate=*`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (!cartaoResponse.ok) throw new Error("Erro ao buscar cartão do usuário.");
        const data = await cartaoResponse.json();

        if (data.data.length > 0) {
            preencherCamposCartao(data.data[0]);
        } else {
            console.log("Nenhum cartão encontrado.");
        }
    } catch (error) {
        console.error("Erro ao carregar cartão do usuário:", error);
    }
}

function preencherCamposCartao(cartao) {
    document.getElementById("card-number").value = cartao.numero || "";
    document.getElementById("card-name").value = cartao.nome || "";
    document.getElementById("expiry-date").value = cartao.validade || "";
}
>>>>>>> parent of 5866721 (Merge branch 'main' of https://github.com/avelinofaco/Loja-Virtual-para-Artesaos-Locais)

document.getElementById("pay-button").addEventListener("click", async function (event) {
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

    try {
        const response = await fetch(
            `http://localhost:1337/api/cartaos?numero=${encodeURIComponent(cardNumber)}&nome=${encodeURIComponent(cardName.trim())}`
        );

        if (!response.ok) throw new Error("Erro na requisição à API");

        const data = await response.json();

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

            if (paymentSuccess) {
                document.getElementById("message").textContent = "Pagamento realizado com sucesso!";
                document.getElementById("message").style.color = "green";

                await salvarPedidoNoStrapi();

                setTimeout(() => {
                    window.location.href = "acompanharPedidos.html";
                }, 1000);
            } else {
                document.getElementById("message").textContent = "Erro no pagamento: Dados do cartão não correspondem.";
                document.getElementById("message").style.color = "red";
            }
        } else {
            document.getElementById("message").textContent = "Erro no pagamento: Nenhum cartão cadastrado.";
            document.getElementById("message").style.color = "red";
        }
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("message").textContent = "Erro ao processar o pagamento.";
        document.getElementById("message").style.color = "red";
    }
});

async function salvarPedidoNoStrapi() {
    const token = localStorage.getItem("jwt");
    if (!token) {
        console.error("Erro: Usuário não autenticado.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        console.error("Erro: Carrinho vazio.");
        return;
    }

    try {
        const userResponse = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!userResponse.ok) throw new Error("Erro ao obter usuário.");
        const usuario = await userResponse.json();

        const pedidoData = {
            data: {
                status: "Pendente",
                totalCompra: cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0),
                dataCompra: new Date().toISOString(),
                usuario: usuario.id, // Relaciona o pedido ao usuário logado
                pedidoItem: cart.map((item) => ({
                    name: item.name,
                    price: item.price,
                    image: item.image,
                })),
            },
        };

        const pedidoResponse = await fetch("http://localhost:1337/api/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pedidoData),
        });

        if (!pedidoResponse.ok) throw new Error("Erro ao salvar pedido no Strapi");

        console.log("Pedido salvo com sucesso!");
        localStorage.removeItem("cart"); // Limpa o carrinho após salvar no Strapi
    } catch (error) {
        console.error("Erro ao salvar pedido:", error);
    }
}

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
