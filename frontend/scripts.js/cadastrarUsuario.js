const API_URL = "http://localhost:1337/api";
const TOKEN = localStorage.getItem(); // Substitua pelo token do admin
// Função para listar usuários e exibir na tabela
async function listarUsuarios() {
    try {
        const resposta = await fetch(`${API_URL}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        const usuarios = await resposta.json();
        atualizarTabela(usuarios);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
    }
}

// Atualiza a tabela de usuários
function atualizarTabela(usuarios) {
    const tabela = document.getElementById("user-list");
    tabela.innerHTML = "";
    usuarios.forEach(user => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <button onclick="editarUsuario(${user.id}, prompt('Novo nome:', '${user.username}'))">Editar</button>
                <button onclick="alterarStatusUsuario(${user.id}, ${!user.blocked})">
                    ${user.blocked ? 'Ativar' : 'Desativar'}
                </button>
                <button onclick="removerUsuario(${user.id})">Remover</button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

// Função para editar um usuário
async function editarUsuario(id, novoNome) {
    if (!novoNome) return;
    try {
        await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: novoNome })
        });
        listarUsuarios();
    } catch (erro) {
        console.error("Erro ao editar usuário:", erro);
    }
}

// Função para ativar/desativar um usuário
async function alterarStatusUsuario(id, ativo) {
    try {
        await fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ blocked: !ativo })
        });
        listarUsuarios();
    } catch (erro) {
        console.error("Erro ao alterar status do usuário:", erro);
    }
}

// Função para remover um usuário
async function removerUsuario(id) {
    try {
        await fetch(`${API_URL}/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        listarUsuarios();
    } catch (erro) {
        console.error("Erro ao remover usuário:", erro);
    }
}