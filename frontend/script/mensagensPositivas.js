const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const enviar = document.getElementById("enviar");
const lista = document.getElementById("listaDesabafos");

const API = "http://localhost:3000/mensagens-positivas";

enviar.addEventListener("click", async function () {
    if (!titulo.value.trim() || !texto.value.trim()) {//verifica se o título OU o texto estão vazios.
        alert("Preencha tudo!");
        return;
    }

    try {//executa o codigo
        const response = await fetch(API, {
            method: "POST",//método utilizado para enviar novas informações ao servidor.
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo.value.trim(),
                mensagem: texto.value.trim()
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Mensagem publicada com sucesso!");
            titulo.value = "";
            texto.value = "";
            await mostrarMensagens();
        } else {
            alert(data.message || "Erro ao publicar mensagem.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
});

async function mostrarMensagens() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Erro ao buscar mensagens.");
        }

        const mensagens = await response.json();
        lista.innerHTML = "";//limpa o conteúdo da lista antes de mostrar as mensagens novamente.

        if (mensagens.length === 0) {//verifica a quantidade de elementos de uma lista e se e igual a 0
            lista.innerHTML = "<p>Nenhuma mensagem publicada ainda.</p>";
            return;
        }

        mensagens.forEach(function (mensagem) {//percorre cada elemento de uma lista
            const card = document.createElement("div");
            card.className = "desabafo";

            const tituloCard = document.createElement("h3");
            tituloCard.textContent = mensagem.titulo;

            const textoCard = document.createElement("p");
            textoCard.textContent = mensagem.mensagem;

            const acoes = document.createElement("div");
            acoes.className = "acoes";

            const botaoEditar = document.createElement("button");
            botaoEditar.textContent = "Editar";

            botaoEditar.addEventListener("click", function () {
                editar(mensagem.id);//chama a função de edição passando o ID da mensagem que será editada
            });

            const botaoRemover = document.createElement("button");
            botaoRemover.className = "remover";
            botaoRemover.textContent = "Remover";

            botaoRemover.addEventListener("click", function () {
                remover(mensagem.id);//chama a função de remoção passando o ID da mensagem que será excluída
            });

            acoes.appendChild(botaoEditar);
            acoes.appendChild(botaoRemover);

            card.appendChild(tituloCard);
            card.appendChild(textoCard);
            card.appendChild(acoes);

            lista.appendChild(card);//adiciona o card criado dentro da lista de mensagens, fazendo ele aparecer na tela
        });

    } catch (error) {
        console.error(error);
        lista.innerHTML = "<p>Não foi possível carregar as mensagens.</p>";
    }
}

async function editar(id) {
    const novoTitulo = prompt("Novo título:");

    if (!novoTitulo || !novoTitulo.trim()) return;

    const novaMensagem = prompt("Nova mensagem:");

    if (!novaMensagem || !novaMensagem.trim()) return;

    try {
        const response = await fetch(`${API}/${id}`, {//endereço da mensagem que queremos editar
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: novoTitulo.trim(),
                mensagem: novaMensagem.trim()
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Mensagem editada com sucesso!");
            await mostrarMensagens();
        } else {
            alert(data.message || "Erro ao editar mensagem.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
}

async function remover(id) {
    if (!confirm("Deseja realmente remover esta mensagem?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {//endereço da mensagem que queremos remover
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            alert("Mensagem removida com sucesso!");
            await mostrarMensagens();
        } else {
            alert(data.message || "Erro ao remover mensagem.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
}

mostrarMensagens();