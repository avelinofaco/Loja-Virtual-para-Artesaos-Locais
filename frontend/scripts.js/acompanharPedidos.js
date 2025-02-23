// document.addEventListener("DOMContentLoaded", async function () {
//     await carregarStatus();
//     await carregarPedidosFinalizados();
// });

// // Função para buscar os status dos pedidos
// async function carregarStatus() {
//     try {
//         const response = await fetch("http://localhost:1337/api/pedidos");
//         if (!response.ok) throw new Error("Erro ao carregar status");

//         const data = await response.json();
//         const statusList = data.data;

//         const select = document.getElementById("category-select");
//         select.innerHTML = "<option value=''>Todos os pedidos</option>"; // Opção padrão

//         if (!statusList || statusList.length === 0) {
//             select.innerHTML += "<option disabled>Nenhum status encontrado</option>";
//             return;
//         }

//         // Adiciona os status únicos ao select
//         const statusUnicos = [...new Set(statusList.map(pedido => pedido.estatus))];
//         statusUnicos.forEach(status => {
//             const option = document.createElement("option");
//             option.value = status;
//             option.textContent = status;
//             select.appendChild(option);
//         });

//         // Adiciona evento para filtrar pedidos por status
//         select.addEventListener("change", carregarPedidosFinalizados);
//     } catch (error) {
//         console.error("Erro ao buscar status:", error);
//     }
// }

// async function carregarPedidosFinalizados() {
//     try {
//         const selectedStatus = document.getElementById("category-select").value;
//         let url = "http://localhost:1337/api/pedidos?populate=pedido_items.image";

//         if (selectedStatus) {
//             url = `http://localhost:1337/api/pedidos?filters[estatus][$eq]=${selectedStatus}&populate=pedido_items.image`;
//         }

//         const response = await fetch(url);
//         if (!response.ok) throw new Error("Erro ao carregar pedidos");

//         const data = await response.json();
//         const pedidos = data.data;

//         renderizarPedidos(pedidos);
//     } catch (error) {
//         console.error("Erro ao buscar pedidos finalizados:", error);
//     }
// }

// // Função para renderizar os pedidos na tela
// function renderizarPedidos(pedidos) {
//     const lista = document.getElementById("product-list");
//     lista.innerHTML = ""; 

//     if (!pedidos || pedidos.length === 0) {
//         lista.innerHTML = "<p>Nenhum pedido encontrado.</p>";
//         return;
//     }

//     pedidos.forEach(pedido => {
//         const pedidoDiv = document.createElement("div");
//         pedidoDiv.classList.add("product-card");

//         const itensPedido = pedido.pedido_items || [];

//         pedidoDiv.innerHTML = `
//             ${itensPedido.map(item => {
//                 const imageUrl = item.image?.formats?.thumbnail?.url
//                     ? `http://localhost:1337${item.image.formats.thumbnail.url}`
//                     : "https://via.placeholder.com/150";
                
//                 return `
//                 <div class="product-card">
//                     <img src="${imageUrl}" alt="${item.name}">
//                     <h3>${item.name}</h3>
//                     <p>R$ ${item.price.toFixed(2)}</p>
//                 </div>`;
//             }).join("")}
//         `;
//         lista.appendChild(pedidoDiv);
//     });
// }
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
