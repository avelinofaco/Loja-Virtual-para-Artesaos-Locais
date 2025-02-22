// document.addEventListener("DOMContentLoaded", async function () {
//     const productContainer = document.querySelector("#product-list");
//     const editModal = document.getElementById("editModal");
//     const deleteModal = document.getElementById("deleteModal");
//     const editName = document.getElementById("editName");
//     const editPrice = document.getElementById("editPrice");
//     const saveChanges = document.getElementById("saveChanges");
//     const confirmDelete = document.getElementById("confirmDelete");
//     const closeModal = document.querySelectorAll(".closeModal");

//     let currentProductId = null;
//     let currentProductCard = null;

//     async function fetchProducts() {
//         let url = "http://localhost:1337/api/produtos?populate=*";
//         try {
//             const response = await fetch(url);
//             if (!response.ok) {
//                 throw new Error(`Erro na requisição de produtos: ${response.status}`);
//             }
//             const result = await response.json();
//             return result.data || [];
//         } catch (error) {
//             console.error("Erro ao buscar produtos:", error);
//             return [];
//         }
//     }

//     async function deleteProduct() {
//         if (!currentProductId) return;

//         try {
//             const response = await fetch(`http://localhost:1337/api/produtos/${currentProductId}`, {
//                 method: "DELETE",
//             });

//             if (!response.ok) {
//                 throw new Error(`Erro ao deletar produto: ${response.status}`);
//             }

//             currentProductCard.remove();
//             alert("Produto excluído com sucesso!");
//         } catch (error) {
//             console.error("Erro ao deletar produto:", error);
//             alert("Erro ao excluir produto.");
//         }

//         deleteModal.style.display = "none";
//     }

//     async function confirmDeleteProduct(documentId, productCard) {
//         currentProductId = documentId;
//         currentProductCard = productCard;
//         deleteModal.style.display = "flex";
//     }

//     async function editProduct(documentId, product) {
//         currentProductId = documentId;
//         editName.value = product.name;
//         editPrice.value = product.price;
//         editModal.style.display = "flex";
//     }

//     saveChanges.addEventListener("click", async () => {
//         if (!currentProductId) return;

//         const updatedProduct = {
//             name: editName.value,
//             price: parseFloat(editPrice.value)
//         };

//         try {
//             const response = await fetch(`http://localhost:1337/api/produtos/${currentProductId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ data: updatedProduct })
//             });

//             if (!response.ok) {
//                 throw new Error(`Erro ao atualizar produto: ${response.status}`);
//             }

//             alert("Produto atualizado com sucesso!");
//             editModal.style.display = "none";
//             renderProducts();
//         } catch (error) {
//             console.error("Erro ao editar produto:", error);
//             alert("Erro ao editar produto.");
//         }
//     });

//     confirmDelete.addEventListener("click", deleteProduct);

//     closeModal.forEach(button => {
//         button.addEventListener("click", () => {
//             editModal.style.display = "none";
//             deleteModal.style.display = "none";
//         });
//     });

//     async function renderProducts() {
//         const products = await fetchProducts();
//         productContainer.innerHTML = "";

//         if (products.length === 0) {
//             productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
//             return;
//         }

//         products.forEach((product) => {
//             const imageUrl =
//                 product.image && product.image.formats && product.image.formats.thumbnail
//                     ? `http://localhost:1337${product.image.formats.thumbnail.url}`
//                     : "https://via.placeholder.com/150";

//             const productCard = document.createElement("div");
//             productCard.classList.add("product-card");
//             productCard.innerHTML = `
//                 <img src="${imageUrl}" alt="${product.name}">
//                 <h3>${product.name}</h3>
//                 <p>${product.description}</p>
//                 <p><strong>R$ ${product.price}</strong></p>
//                 <button class="btn btn-primary edit-btn" data-id="${product.documentId}">Editar</button>
//                 <button class="btn btn-danger delete-btn" data-id="${product.documentId}">Excluir</button>
//             `;

//             productContainer.appendChild(productCard);

//             productCard.querySelector(".edit-btn").addEventListener("click", () => editProduct(product.documentId, product));
//             productCard.querySelector(".delete-btn").addEventListener("click", () => confirmDeleteProduct(product.documentId, productCard));
//         });
//     }

//     renderProducts();
// });






// document.addEventListener("DOMContentLoaded", async function () {
//   const productContainer = document.querySelector("#product-list");
//   const editModal = document.getElementById("editModal");
//   const deleteModal = document.getElementById("deleteModal");
//   const editName = document.getElementById("editName");
//   const editPrice = document.getElementById("editPrice");
//   const saveChanges = document.getElementById("saveChanges");
//   const closeModal = document.querySelectorAll(".closeModal");
//   const confirmDelete = document.getElementById("confirmDelete");
//   const productForm = document.getElementById("productForm");

//   let currentProductId = null;

//   // ✅ Busca produtos do Strapi
//   async function fetchProducts() {
//     let url = "http://localhost:1337/api/produtos?populate=*";
//     try {
//       const response = await fetch(url);
//       if (!response.ok)
//         throw new Error(`Erro ao buscar produtos: ${response.status}`);
//       const result = await response.json();
//       return result.data || [];
//     } catch (error) {
//       console.error("Erro ao buscar produtos:", error);
//       return [];
//     }
//   }

//   // ✅ Cadastra um novo produto
//   productForm.addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const name = document.getElementById("productName").value.trim();
//     const price = parseFloat(document.getElementById("productPrice").value);
//     const description = document
//       .getElementById("productDescription")
//       .value.trim();
//     const imageFile = document.getElementById("productImage").files[0];

//     if (!name || !price || !description || !imageFile) {
//       alert("Por favor, preencha todos os campos.");
//       return;
//     }

//     const formData = new FormData();

//     // Criando um JSON no formato esperado pelo Strapi
//     const jsonData = {
//       pedido_items: [
//         {
//           name,
//           price,
//           description,
//         },
//       ],
//       estatus: "Pendente", // Se necessário, ajuste para o status correto
//     };

//     formData.append("data", JSON.stringify(jsonData)); // Enviando os dados do produto como JSON
//     formData.append("files.image", imageFile); // Adicionando a imagem

    
//     try {
//         // 1️⃣ Enviar a imagem primeiro
//         const imageFormData = new FormData();
//         imageFormData.append("files", imageFile);

//         const imageResponse = await fetch("http://localhost:1337/api/upload", {
//             method: "POST",
//             body: imageFormData
//         });

//         if (!imageResponse.ok) {
//             throw new Error("Erro ao enviar imagem.");
//         }

//         const imageData = await imageResponse.json();
//         const imageId = imageData[0].id; // Pega o ID da imagem enviada

//         // 2️⃣ Agora, cadastrar o produto com a imagem associada
//         const productData = {
//             data: {
//                 name: name,
//                 price: price,
//                 description: description,
//                 image: imageId // Relaciona a imagem enviada ao produto
//             }
//         };

//         const response = await fetch("http://localhost:1337/api/produtos", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(productData)
//         });

//         if (!response.ok) {
//             const errorResponse = await response.json();
//             throw new Error(`Erro ao cadastrar produto: ${errorResponse.error.message}`);
//         }

//         alert("Produto cadastrado com sucesso!");
//         document.getElementById("productForm").reset();
//     } catch (error) {
//         console.error("Erro ao cadastrar produto:", error);
//         alert("Erro ao cadastrar produto.");
//     }
// });

//   // ✅ Editar produto (abrir modal)
//   async function editProduct(documentId, product) {
//     currentProductId = documentId;
//     editName.value = product.attributes.name;
//     editPrice.value = product.attributes.price;
//     editModal.style.display = "flex";
//   }

//   // ✅ Salvar edição do produto
//   saveChanges.addEventListener("click", async () => {
//     if (!currentProductId) return;

//     const updatedProduct = {
//       name: editName.value,
//       price: parseFloat(editPrice.value),
//     };

//     try {
//       const response = await fetch(
//         `http://localhost:1337/api/produtos/${currentProductId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ data: updatedProduct }),
//         }
//       );

//       if (!response.ok)
//         throw new Error(`Erro ao atualizar produto: ${response.status}`);

//       alert("Produto atualizado com sucesso!");
//       editModal.style.display = "none";
//       renderProducts();
//     } catch (error) {
//       console.error("Erro ao editar produto:", error);
//       alert("Erro ao editar produto.");
//     }
//   });

//   // ✅ Abrir modal de exclusão
//   async function deleteProduct(documentId, productCard) {
//     currentProductId = documentId;
//     deleteModal.style.display = "flex";

//     confirmDelete.onclick = async function () {
//       try {
//         const response = await fetch(
//           `http://localhost:1337/api/produtos/${currentProductId}`,
//           {
//             method: "DELETE",
//           }
//         );

//         if (!response.ok)
//           throw new Error(`Erro ao deletar produto: ${response.status}`);

//         productCard.remove();
//         alert("Produto excluído com sucesso!");
//         deleteModal.style.display = "none";
//       } catch (error) {
//         console.error("Erro ao deletar produto:", error);
//         alert("Erro ao excluir produto.");
//       }
//     };
//   }

//   // ✅ Fechar modais
//   closeModal.forEach((button) => {
//     button.addEventListener("click", () => {
//       editModal.style.display = "none";
//       deleteModal.style.display = "none";
//     });
//   });

//   // ✅ Renderizar produtos
//   async function renderProducts() {
//     const products = await fetchProducts();
//     productContainer.innerHTML = "";

//     if (products.length === 0) {
//       productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
//       return;
//     }

//     products.forEach((product) => {
//       const imageUrl =
//         product.image &&
//         product.image.formats &&
//         product.image.formats.thumbnail
//           ? `http://localhost:1337${product.image.formats.thumbnail.url}`
//           : "https://via.placeholder.com/150";

//       const productCard = document.createElement("div");
//       productCard.classList.add("product-card");
//       productCard.innerHTML = `
//                 <img src="${imageUrl}" alt="${product.name}">
//                 <h3>${product.name}</h3>
//                 <p>${product.description}</p>
//                 <p><strong>R$ ${product.price}</strong></p>
//                 <button class="btn btn-primary edit-btn" data-id="${product.documentId}">Editar</button>
//                 <button class="btn btn-danger delete-btn" data-id="${product.documentId}">Excluir</button>
//             `;

//       productContainer.appendChild(productCard);

//       productCard
//         .querySelector(".edit-btn")
//         .addEventListener("click", () => editProduct(product.id, product));
//       productCard
//         .querySelector(".delete-btn")
//         .addEventListener("click", () =>
//           deleteProduct(product.id, productCard)
//         );
//     });
//   }

//   renderProducts();
// });

document.addEventListener("DOMContentLoaded", async function () {
    const productContainer = document.querySelector("#product-list");
    const editModal = document.getElementById("editModal");
    const deleteModal = document.getElementById("deleteModal");
    const editName = document.getElementById("editName");
    const editPrice = document.getElementById("editPrice");
    const saveChanges = document.getElementById("saveChanges");
    const closeModal = document.querySelectorAll(".closeModal");
    const confirmDelete = document.getElementById("confirmDelete");
    const productForm = document.getElementById("productForm");
  
    let currentProductId = null;
  
    // ✅ Função para verificar se o usuário tem permissão de acesso
    async function verificarAcesso() {
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
      
          if (!response.ok) {
            throw new Error("Falha ao autenticar usuário.");
          }
      
          const usuario = await response.json();
      
          if (usuario.role.name !== "artesão") {
            alert("Acesso restrito! Apenas artesãos podem acessar esta página.");
            window.location.href = "index.html";
            return;
          }
      
          // Se o usuário for artesão e estiver acessando a página de login, redirecioná-lo para a tela de cadastro
          if (window.location.pathname.includes("login.html")) {
            window.location.href = "cadastro.html"; // Página onde o artesão pode cadastrar produtos
          }
      
        } catch (error) {
          console.error("Erro ao verificar usuário:", error);
          window.location.href = "login.html";
        }
      }
      
  
    // ✅ Chama a função ao carregar a página
    await verificarAcesso();
  
    // ✅ Busca produtos do Strapi
    async function fetchProducts() {
      let url = "http://localhost:1337/api/produtos?populate=*";
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Erro ao buscar produtos: ${response.status}`);
        const result = await response.json();
        return result.data || [];
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        return [];
      }
    }
  
    // ✅ Cadastra um novo produto
    productForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const token = localStorage.getItem("jwt");
      if (!token) {
        alert("Você precisa estar logado para cadastrar um produto!");
        return;
      }
  
      const name = document.getElementById("productName").value.trim();
      const price = parseFloat(document.getElementById("productPrice").value);
      const description = document
        .getElementById("productDescription")
        .value.trim();
      const imageFile = document.getElementById("productImage").files[0];
  
      if (!name || !price || !description || !imageFile) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
  
      try {
        // 1️⃣ Enviar a imagem primeiro
        const imageFormData = new FormData();
        imageFormData.append("files", imageFile);
  
        const imageResponse = await fetch("http://localhost:1337/api/upload", {
          method: "POST",
          body: imageFormData,
        });
  
        if (!imageResponse.ok) {
          throw new Error("Erro ao enviar imagem.");
        }
  
        const imageData = await imageResponse.json();
        const imageId = imageData[0].id; // Pega o ID da imagem enviada
  
        // 2️⃣ Agora, cadastrar o produto com a imagem associada
        const productData = {
          data: {
            name: name,
            price: price,
            description: description,
            image: imageId, // Relaciona a imagem enviada ao produto
          },
        };
  
        const response = await fetch("http://localhost:1337/api/produtos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adicionando o token para autenticação
          },
          body: JSON.stringify(productData),
        });
  
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`Erro ao cadastrar produto: ${errorResponse.error.message}`);
        }
  
        alert("Produto cadastrado com sucesso!");
        document.getElementById("productForm").reset();
      } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        alert("Erro ao cadastrar produto.");
      }
    });
  
    // ✅ Editar produto (abrir modal)
    async function editProduct(documentId, product) {
      currentProductId = documentId;
      editName.value = product.attributes.name;
      editPrice.value = product.attributes.price;
      editModal.style.display = "flex";
    }
  
    // ✅ Salvar edição do produto
    saveChanges.addEventListener("click", async () => {
      if (!currentProductId) return;
  
      const updatedProduct = {
        name: editName.value,
        price: parseFloat(editPrice.value),
      };
  
      try {
        const response = await fetch(
          `http://localhost:1337/api/produtos/${currentProductId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: updatedProduct }),
          }
        );
  
        if (!response.ok)
          throw new Error(`Erro ao atualizar produto: ${response.status}`);
  
        alert("Produto atualizado com sucesso!");
        editModal.style.display = "none";
        renderProducts();
      } catch (error) {
        console.error("Erro ao editar produto:", error);
        alert("Erro ao editar produto.");
      }
    });
  
    // ✅ Abrir modal de exclusão
    async function deleteProduct(documentId, productCard) {
      currentProductId = documentId;
      deleteModal.style.display = "flex";
  
      confirmDelete.onclick = async function () {
        try {
          const response = await fetch(
            `http://localhost:1337/api/produtos/${currentProductId}`,
            {
              method: "DELETE",
            }
          );
  
          if (!response.ok)
            throw new Error(`Erro ao deletar produto: ${response.status}`);
  
          productCard.remove();
          alert("Produto excluído com sucesso!");
          deleteModal.style.display = "none";
        } catch (error) {
          console.error("Erro ao deletar produto:", error);
          alert("Erro ao excluir produto.");
        }
      };
    }
  
    // ✅ Fechar modais
    closeModal.forEach((button) => {
      button.addEventListener("click", () => {
        editModal.style.display = "none";
        deleteModal.style.display = "none";
      });
    });
  
    // ✅ Renderizar produtos
    async function renderProducts() {
      const products = await fetchProducts();
      productContainer.innerHTML = "";
  
      if (products.length === 0) {
        productContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
      }
  
      products.forEach((product) => {
        const imageUrl =
          product.image &&
          product.image.formats &&
          product.image.formats.thumbnail
            ? `http://localhost:1337${product.image.formats.thumbnail.url}`
            : "https://via.placeholder.com/150";
  
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
                  <img src="${imageUrl}" alt="${product.name}">
                  <h3>${product.name}</h3>
                  <p>${product.description}</p>
                  <p><strong>R$ ${product.price}</strong></p>
                  <button class="btn btn-primary edit-btn" data-id="${product.documentId}">Editar</button>
                  <button class="btn btn-danger delete-btn" data-id="${product.documentId}">Excluir</button>
              `;
  
        productContainer.appendChild(productCard);
      });
    }
  
    renderProducts();
  });
  