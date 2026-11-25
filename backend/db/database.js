
import sqlite3 from "sqlite3";//importa o SQLITE

const db = new sqlite3.Database("./desabafaqi.db", (err) => {//faz a conexao com o bd
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Banco de dados conectado com sucesso!");
    }
});

db.serialize(() => {//faz as operações do banco serem executadas em ordem.
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_usuario TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS desabafos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            texto TEXT NOT NULL,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mensagens_positivas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            mensagem TEXT NOT NULL
        )
    `);
});

export default db;
//Exporta o db para que outros arquivos do backend 
// possam utilizar a conexão com o banco de dados.