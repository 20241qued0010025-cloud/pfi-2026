import { Router } from "express";
import db from "../db/database.js";

const rotas = Router();

rotas.post("/cadastro", (req, res) => {
    const { username, password } = req.body;//Pega o nome de usuário e a senha que foram enviados pelo frontend.

    if (!username || !password) {
        return res.status(400).json({
            message: "Nome de usuário e senha são obrigatórios"
        });//Verifica se o usuário preencheu os dois campos. Se algum 
        //estiver vazio, envia um erro 400 com uma mensagem avisando que os campos são obrigatórios.
    }

    db.get(
        "SELECT id FROM usuarios WHERE nome_usuario = ?",//pede o ID do usuario e procura
        [username],
        (err, row) => {
            if (err) {
                return res.status(500).json({//Se acontecer algum erro ao consultar o banco, o servidor envia o código 500
                    message: "Erro ao verificar usuário"
                });
            }

            if (row) {
                return res.status(400).json({
                    message: "Nome de usuário já existe"
                });
            }

            db.run(
                "INSERT INTO usuarios (nome_usuario, senha) VALUES (?, ?)",//coloca informacoes na tabela
                [username, password],
                function (err) {//funcao que recebe erro
                    if (err) {
                        return res.status(500).json({//envia msg de erro ao front end
                            message: "Erro ao cadastrar usuário"
                        });
                    }

                    res.status(201).json({
                        //id: this.lastID,
                        //username: username/
               });
//se deu tudo certo, o servidor envia o código 201
//  indicando que o usuário foi cadastrado e também retorna o ID e o nome de usuário
                
                }
            );
        }
    );
});

// Login
rotas.post("/login", (req, res) => {
    const { username, password } = req.body;//pega o nome de usuário e a senha enviados pelo frontend  peo body

    if (!username || !password) {
        return res.status(400).json({
            message: "Nome de usuário e senha são obrigatórios"
        });
        //ve se o usuario preencheu tudo certo, se estiver algo vazio manda a msg
    }

    db.get(//consulta o bd
        "SELECT id, nome_usuario, senha FROM usuarios WHERE nome_usuario = ?",
        [username],
        (err, row) => {//err guarda o erro e row guarda o usuário encontrado
            if (err) {
                return res.status(500).json({
                    message: "Erro ao encontrar usuário"
                });
            }

            if (!row) {
                return res.status(401).json({
                    message: "Usuário não encontrado"
                });
            }

            if (row.senha !== password) {//compara a senha digitada com a do bd
                return res.status(401).json({
                    message: "Senha incorreta"
                });
            }

            res.json({
                id: row.id,
                username: row.nome_usuario//fazer login
            });
        }
    );
});

/////////////////Criar desabafo
rotas.post("/desabafos", (req, res) => {
    //    //Cria uma rota POST para receber os desabafos enviados pelo frontend

    const { titulo, texto } = req.body;

    if (!titulo || !texto) {//vai ver se o titulo e texto foram preenchidos
        return res.status(400).json({
            message: "Título e texto são obrigatórios"
        });
    }

    db.run(
        "INSERT INTO desabafos (titulo, texto) VALUES (?, ?)",//salva no bd
        [titulo, texto],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao salvar desabafo"
                });
            }

            res.status(201).json({
                id: this.lastID,
                titulo,
                texto
    //: Se o desabafo for salvo corretamente, envia uma confirmação com os dados dele para o frontend
            });
        }
    );
});

// Buscar desabafos
rotas.get("/desabafos", (req, res) => {
    db.all(//busca os desabafos e organiza
        "SELECT id, titulo, texto, data_criacao FROM desabafos ORDER BY id DESC",//organiza pela forma decrescente
        [],
        (err, rows) => {//guarda desabafos ou erros
            if (err) {
                return res.status(500).json({
                    message: "Erro ao buscar desabafos"
                });
            }

            res.json(rows);
            //envia todos os desabafos para o front exibir
        }
    );
});

// Editar desabafo
rotas.put("/desabafos/:id", (req, res) => {
    //PUT cria uma rota para editar um desabafo específico, identificado pelo ID.
    const { titulo, texto } = req.body;
    const { id } = req.params;

    if (!titulo || !texto) {
        return res.status(400).json({
            message: "Título e texto são obrigatórios"
        });
    }

    db.run(
        "UPDATE desabafos SET titulo = ?, texto = ? WHERE id = ?",
        //UPDATE atualiza o título e o texto do desabafo que possui aquele ID.
        [titulo, texto, id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao editar desabafo"
                });
            }

            if (this.changes === 0) {//informa quantos registros foram alterados
                return res.status(404).json({
                    message: "Desabafo não encontrado"
                });
            }

            res.json({
                message: "Desabafo editado com sucesso!"
            });
        }
    );
});

// Remover desabafo
rotas.delete("/desabafos/:id", (req, res) => {
    const { id } = req.params;
    //Pega o ID do desabafo que queremos excluir pelo endereço da rota.

    db.run(
        "DELETE FROM desabafos WHERE id = ?",
        //DELETE FROM exclui do banco o desabafo que possui aquele ID
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao remover desabafo"
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Desabafo não encontrado"
                });
            }

            res.json({
                message: "Desabafo removido com sucesso!"
            });
        }
    );
});

// Mensagens positivas: cadastrar
rotas.post("/mensagens-positivas", (req, res) => {
    const { titulo, mensagem } = req.body;
    //pega o título e o conteúdo da mensagem enviados pelo frontend.

    if (!titulo || !mensagem) {
        return res.status(400).json({
            message: "Título e mensagem são obrigatórios"
        });
    }

    db.run(
        "INSERT INTO mensagens_positivas (titulo, mensagem) VALUES (?, ?)",
        //INSERT INTO salva o título e a mensagem na tabela mensagens_positivas.
        [titulo, mensagem],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao salvar mensagem"
                });
            }

            res.status(201).json({
                id: this.lastID,
                titulo,
                mensagem
                //Se a mensagem for salva, envia uma confirmação com os dados dela para o frontend.
            });
        }
    );
});

// Mensagens positivas: listar
rotas.get("/mensagens-positivas", (req, res) => {
    db.all(//db.all busca todas as mensagens positivas
        "SELECT id, titulo, mensagem FROM mensagens_positivas ORDER BY id DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao buscar mensagens"
                });
            }

            res.json(rows);
        }
    );
});

// Mensagens positivas: editar
rotas.put("/mensagens-positivas/:id", (req, res) => {
    const { titulo, mensagem } = req.body;
    const { id } = req.params;
    //req.body pega os novos dados e req.params pega o ID da mensagem.

    if (!titulo || !mensagem) {
        return res.status(400).json({
            message: "Título e mensagem são obrigatórios"
        });
    }

    db.run(
        "UPDATE mensagens_positivas SET titulo = ?, mensagem = ? WHERE id = ?",
        //UPDATE atualiza o título e a mensagem do registro que possui aquele ID.
        [titulo, mensagem, id],
        function (err) {
            if (err) {//Verifica se aconteceu algum erro durante a edição.
                return res.status(500).json({
                    message: "Erro ao editar mensagem"
                });
            }

            if (this.changes === 0) {//informa quantos registros foram alterados.
                return res.status(404).json({
                    message: "Mensagem não encontrada"
                });
            }

            res.json({ message: "Mensagem editada com sucesso!" });
        }
    );
});

// Mensagens positivas: remover
rotas.delete("/mensagens-positivas/:id", (req, res) => {
    db.run(
        "DELETE FROM mensagens_positivas WHERE id = ?",
        [req.params.id],//informa o ID que será usado na exclusão..
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: "Erro ao remover mensagem"
                });
            }

            if (this.changes === 0) {//verifica se nenhum registro foi removido.
                return res.status(404).json({
                    message: "Mensagem não encontrada"
                });
            }

            res.json({ message: "Mensagem removida com sucesso!" });
            //verifica se nenhum registro foi removido.
        }
    );
});

export default rotas;
//permite que o server.js importe essas rotas e utilize elas no servidor.