const titulo = document.getElementById("titulo");
const texto = document.getElementById("texto");
const enviar = document.getElementById("enviar");
const lista = document.getElementById("listaDesabafos");

const API = "http://localhost:3000/desabafos";

enviar.addEventListener("click", async function () {
    if (!titulo.value.trim() || !texto.value.trim()) { //o trim vai remover espacos
        alert("Preencha tudo!");
        return;
    }

    try {
        const response = await fetch(API, {//BUSCA OS DADOS NO BACKEND
            
            method: "POST",
            headers: {
                "Content-Type": "application/json"
                //
            },
            body: JSON.stringify({
                titulo: titulo.value.trim(),
                texto: texto.value.trim()
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Desabafo publicado com sucesso!");t
            titulo.value = "";
            texto.value = "";
            await mostrarDesabafos();
        } else {
            alert(data.message || "Erro ao publicar desabafo.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
});

async function mostrarDesabafos() { //cria a funcao de mostrar desabafos
    try {
        const response = await fetch(API); //o fetch vai levar as informacoes no front para o back

        if (!response.ok) {
            throw new Error("Erro ao buscar desabafos.");
        }

        const desabafos = await response.json();//transforma a resposta em json
        lista.innerHTML = "";// vai limpar a lista, para nao fcarem duplicados

        desabafos.forEach(function (desabafo) {// para percorrer os desabafos
            
            const card = document.createElement("div");
            card.className = "desabafo";

            const tituloCard = document.createElement("h3");
            tituloCard.textContent = desabafo.titulo;

            const textoCard = document.createElement("p");
            textoCard.textContent = desabafo.texto;

            const acoes = document.createElement("div");
            acoes.className = "acoes";

            const botaoEditar = document.createElement("button");// para passar a funcao e chamar o ID para editar
            botaoEditar.textContent = "Editar";
            botaoEditar.addEventListener("click", function () {
                editar(desabafo.id);
            });

            const botaoRemover = document.createElement("button");
            botaoRemover.className = "remover";
            botaoRemover.textContent = "Remover";
            botaoRemover.addEventListener("click", function () {
                remover(desabafo.id);
            });

            acoes.appendChild(botaoEditar);//coloca tudo dentro dos cards
            acoes.appendChild(botaoRemover);

            card.appendChild(tituloCard);
            card.appendChild(textoCard);
            card.appendChild(acoes);

            lista.appendChild(card);//coloca tudo dentro e 1 lista E MOSTRA OS CARDS NA TELA SEGUINTE
        });

    } catch (error) {
        console.error(error);
        lista.innerHTML = "<p>Não foi possível carregar os desabafos.</p>";
    }
}

async function editar(id) {
    const novoTitulo = prompt("Novo título:");
    if (!novoTitulo || !novoTitulo.trim()) return;

    const novoTexto = prompt("Novo texto:");
    if (!novoTexto || !novoTexto.trim()) return;

    try {
        const response = await fetch(`${API}/${id}`, {// vai colocar tudo dentro da API com o ID para ser editado
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: novoTitulo.trim(),
                texto: novoTexto.trim()
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Desabafo editado com sucesso!");
            await mostrarDesabafos();
        } else {
            alert(data.message || "Erro ao editar desabafo.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
}

async function remover(id) {
    if (!confirm("Deseja realmente remover este desabafo?")) return;

    try {
        const response = await fetch(`${API}/${id}`, {// tudo dentro da api e id para remover
            method: "DELETE"
        });

        const data = await response.json();

        if (response.ok) {
            alert("Desabafo removido com sucesso!");
            await mostrarDesabafos();
        } else {
            alert(data.message || "Erro ao remover desabafo.");
        }
    } catch (error) {
        alert("Erro de conexão com a API.");
        console.error(error);
    }
}

mostrarDesabafos();//vai mostrar na tela de desabafos