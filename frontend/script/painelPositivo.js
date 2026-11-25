
const cards = document.getElementById("cardsMensagens");

async function mostrarMensagens() {
    try {

       //O fetch busca as mensagens na API e o await espera o servidor responder.
        const resposta = await fetch("http://localhost:3000/mensagens-positivas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar mensagens");
        }

        const mensagens = await resposta.json();
        cards.innerHTML = "";

        if (mensagens.length === 0) {//verifica se não tem mensagens.
            // O innerHTML mostra um aviso e o return encerra a função
            cards.innerHTML = "<p>Nenhuma mensagem publicada ainda.</p>";
            return;
        }

        mensagens.forEach(function(mensagem) {//percorre as msg
            const card = document.createElement("div");//cria cards
            card.className = "card";

            const icone = document.createElement("div");
            icone.className = "icon";
            icone.textContent = "💛";

            const titulo = document.createElement("h3");
            titulo.textContent = mensagem.titulo;

            const autor = document.createElement("span");
            autor.textContent = "Mensagem da comunidade";

            const texto = document.createElement("p");
            texto.textContent = mensagem.mensagem;

            card.appendChild(icone);
            card.appendChild(titulo);
            card.appendChild(autor);
            card.appendChild(texto);

            cards.appendChild(card);
        });

    } catch (erro) {
        cards.innerHTML = "<p>Não foi possível carregar as mensagens. Verifique se o servidor está funcionando.</p>";
        console.error(erro);
    }
}

mostrarMensagens();
