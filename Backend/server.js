const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "vigilante"
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar:", err);
    return;
  }

  console.log("Banco conectado");
});

app.get("/users", (req, res) => {

  db.query(
    "SELECT * FROM usuarios",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);
    }
  );

});

app.post("/register", (req, res) => {

  const { nome, email, senha } = req.body;

  db.query(
    "INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)",
    [nome, email, senha],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Usuário cadastrado"
      });
    }
  );

});

app.post("/login", (req, res) => {

  const { email, senha } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "Usuário inválido"
        });
      }

      res.json({
        message: "Login realizado",
        usuario: result[0]
      });

    }
  );

});

app.put("/users/:id", (req, res) => {

  const { id } = req.params;

  const { nome, email } = req.body;

  db.query(
    "UPDATE usuarios SET nome=?, email=? WHERE id=?",
    [nome, email, id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Atualizado com sucesso"
      });

    }
  );

});


app.delete("/users/:id", (req, res) => {

  const { id } = req.params;

  db.query(
    "DELETE FROM usuarios WHERE id=?",
    [id],
    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "Usuário removido"
      });

    }
  );

});



app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});