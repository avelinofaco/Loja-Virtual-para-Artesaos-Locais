const API_URL = 'http://localhost:1337/api/users'; 

// Capturar o formulário e adicionar evento de submit
document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    createUser(username, email, password);
    this.reset();
});

// Função para carregar usuários e exibir na tabela
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <button onclick="editUser(${user.id})">Editar</button>
                    <button onclick="deleteUser(${user.id})">Deletar</button>
                </td>
            `;
            userList.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
}

// Função para cadastrar usuário
async function createUser(username, email, password) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (response.ok) fetchUsers();
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
    }
}

// Função para editar usuário
async function editUser(id) {
    const newUsername = prompt('Novo nome de usuário:');
    const newEmail = prompt('Novo email:');
    if (!newUsername || !newEmail) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: newUsername, email: newEmail })
        });
        if (response.ok) fetchUsers();
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
    }
}

// Função para deletar usuário
async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) fetchUsers();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
    }
}

// Carregar usuários ao carregar a página
document.addEventListener('DOMContentLoaded', fetchUsers);
