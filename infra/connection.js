const mysql = require('mysql2')

const conexao = mysql.createConnection({
  host: 'db',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'agenda-petshop'
})

module.exports = conexao
