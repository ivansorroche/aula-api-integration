const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
app.use(bodyParser.json());

// Rotas para Cliente

app.post('/clientes', (req, res) => {
    const { codigo, nome } = req.body;
    db.run(`INSERT INTO Cliente (codigo, nome) VALUES (?, ?)`, [codigo, nome], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

app.get('/clientes', (req, res) => {
    db.all(`SELECT * FROM Cliente`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.get('/clientes/:codigo', (req, res) => {
    const { codigo } = req.params;
    db.get(`SELECT * FROM Cliente WHERE codigo = ?`, [codigo], (err, row) => {
        console.log(err, row, 'err, row GET CLIENTE')
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: row });
    });
});

app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { codigo, nome } = req.body;
    db.run(`UPDATE Cliente SET codigo = ?, nome = ? WHERE id = ?`, [codigo, nome, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/clientes/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Cliente WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

// Rotas para Endereco

app.post('/clientes/:codigo/enderecos', (req, res) => {
    const { indice, logradouro, numero, complemento, cidade, estado, cep } = req.body;
    const { codigo } = req.params;

     db.get(`SELECT * FROM Cliente WHERE codigo = ?`, [codigo], (err, row) => {
        if (!row) {
            return res.status(400).json({ error: "Codigo inexistente" });
        }
        db.run(`INSERT INTO Endereco (codigo, indice, logradouro, numero, complemento, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [codigo, indice, logradouro, numero, complemento, cidade, estado, cep], function(err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.json({ id: this.lastID });
        });
    });    
 
});

app.get('/enderecos', (req, res) => {
    db.all(`SELECT * FROM Endereco`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.get('/clientes/:codigo/enderecos', (req, res) => {
    const { codigo } = req.params;

    db.get(`SELECT * FROM Endereco WHERE codigo = ?`, [codigo], (err, row) => {
        if (!row) {
            return res.status(400).json({ error: 'Não foram encontrados enderecos com esse codigo!'});
        }
        res.json({ data: row });
    });

});

app.put('/enderecos/:id', (req, res) => {
    const { id } = req.params;
    const { codigo, indice, logradouro, numero, complemento, cidade, estado, cep } = req.body;
    db.run(`UPDATE Endereco SET codigo = ?, indice = ?, logradouro = ?, numero = ?, complemento = ?, cidade = ?, estado = ?, cep = ? WHERE id = ?`, 
    [codigo, indice, logradouro, numero, complemento, cidade, estado, cep, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ updated: this.changes });
    });
});

app.delete('/enderecos/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM Endereco WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ deleted: this.changes });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
