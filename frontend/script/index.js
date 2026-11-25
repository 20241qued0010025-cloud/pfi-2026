const form = document.getElementById("form-login");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"}, //Headers sao os envios de respostas
            body: JSON.stringify({ username, password }) //body vai ser onde sao colocados os dados
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("usuario", JSON.stringify(data));
            window.location.href = "./painel.html";
        } else {
            alert(data.message || "Usuário ou senha incorretos");
        }

    } catch (error) {
        alert("Erro de conexão com a API");
        console.error(error);
    }
});
