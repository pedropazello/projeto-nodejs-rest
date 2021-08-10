const customExpress = require('./config/customExpress')
const conexao = require('./infra/database/connection')
const Tabelas = require('./infra/database/tables')

conexao.connect((erro) => {
  if (erro) {
    console.log(erro)
  } else {
    console.log('conectado com sucesso')

    Tabelas.init(conexao)

    const app = customExpress()
    app.listen(3000, '0.0.0.0', () => console.log('servidor rodando na porta 3000'))
  }
})
