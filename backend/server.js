
import express from "express";
import cors from "cors";
import rotas from "./router/rotas.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", rotas);

const servidor = app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

servidor.on("close", () => {
    console.log("O servidor foi fechado!");
});

process.on("exit", (codigo) => {
    console.log("O processo Node.js encerrou. Código:", codigo);
});

setInterval(() => {
    console.log("Servidor continua ativo...");
}, 5000);
