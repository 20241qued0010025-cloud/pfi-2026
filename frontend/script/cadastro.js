// Procura o formulario no HTML
const form = document.getElementById("form-cadastro");

form.addEventListener("submit", async function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // Pega os dados digitados pelo usuário
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Envia os dados do frontend para o backend
        const response = await fetch("http://localhost:3000/cadastro", {
            method: "POST", // Envia informações

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ username, password })
        });

        // Recebe a resposta do servidor
        const data = await response.json();

        if (response.ok) {``
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "../index.html";
        } else {
            alert(data.message || "Erro ao cadastrar. Tente novamente!");
        }

    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
});