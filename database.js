const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db');

db.serialize(() => {
    // Cria a tabela de clientes
    db.run(`CREATE TABLE Cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE,
        nome TEXT
    )`);

    // Cria a tabela de endereços
    db.run(`CREATE TABLE Endereco (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo INTEGER,
        indice INTEGER,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        cidade TEXT,
        estado TEXT,
        cep TEXT,
        FOREIGN KEY (codigo) REFERENCES Cliente (codigo)
    )`);
});

module.exports = db;
