const cards = document.getElementById("cardsDesabafos");

async function mostrarDesabafos() {
    const response = await fetch("http://localhost:3000/desabafos");//vai guardar a resposta no servidor
    const desabafos = await response.json();
    
    desabafos.forEach(function (desabafo) {//o forEach vai percorrer a lista de desabafos
        cards.innerHTML += `
            <div class="card">
                <div class="icon">👤</div>
                <h3>${desabafo.titulo}</h3>
                <span>Desabafo</span>
                <p>${desabafo.texto}</p>
            </div>
        `;
    });
}

mostrarDesabafos();