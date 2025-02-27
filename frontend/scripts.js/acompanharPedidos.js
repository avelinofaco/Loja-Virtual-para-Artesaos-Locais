document.addEventListener("DOMContentLoaded", function () {
    carregarPedidosLocalStorage(); // Chama a função ao carregar a página
});

function carregarPedidosLocalStorage() {
    const pedidos = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];
    const listaPedidos = document.getElementById("product-list");
    listaPedidos.innerHTML = ""; // Limpa qualquer conteúdo anterior

    if (pedidos.length === 0) {
        listaPedidos.innerHTML = "<p>Nenhum pedido encontrado.</p>";
        return;
    }

    pedidos.forEach((item) => {
        const imageUrl = item.image || "https://via.placeholder.com/150";

        const pedidoDiv = document.createElement("div");
        pedidoDiv.classList.add("product-card");
        pedidoDiv.innerHTML = `
            <img src="${imageUrl}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>R$ ${parseFloat(item.price).toFixed(2)}</p>
        `;
        listaPedidos.appendChild(pedidoDiv);
    });
}
