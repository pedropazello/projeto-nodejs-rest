const { default: axios } = require('axios')
const moment = require('moment')
const conexao = require('../infra/connection')

class Atendimento {
  adiciona(atendimento, res) {
    const dataCriacao = moment().format('YYYY-MM-DD')
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD')

    const dataValida = moment(data).isSameOrAfter(dataCriacao)
    const clienteValido = atendimento.cliente.length >= 5

    const validacoes = [
      {
        nome: 'data',
        valido: dataValida,
        mensagem: 'Data deve ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: clienteValido,
        mensagem: 'Cliente deve ter pelo menos cinco caracteres'
      }
    ]

    const erros = validacoes.filter(campo => !campo.valido)
    const existemErros = erros.length

    if (existemErros) {
      res.status(400).json(erros)
    } else {
      const atendimentoDatado = {...atendimento, dataCriacao, data}

      const sql = `INSERT INTO atendimentos SET ?`

      conexao.query(sql, atendimentoDatado, (erro, resultados) => {
        if (erro) {
          res.status(400).json(erro)
        } else {
          res.status(201).json(resultados)
        }
      })
    }
  }

  lista(res) {
    const sql = `SELECT * FROM atendimentos`

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json(resultados)
      }
    })
  }

  buscaPorId(id, res) {
    const sql = `SELECT * FROM atendimentos WHERE id = ${id}`

    conexao.query(sql, async (erro, resultados) => {
      const atendimento = resultados[0]
      const cpf = atendimento.cliente

      if (erro) {
        res.status(400).json(erro)
      } else {
        console.log("buscando pelo axios")

        const { data } = await axios.get(`http://clientes:8082/${cpf}`)
        atendimento.cliente = data

        res.status(200).json(atendimento)
      }
    })
  }

  altera(id, valores, res) {
    const sql = `UPDATE atendimentos SET ? where id=?`

    if (valores.data) {
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }

    conexao.query(sql, [valores, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json({...valores, id})
      }
    })
  }

  deleta(id, res) {
    const sql = `DELETE FROM atendimentos where id = ?`

    conexao.query(sql, [id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json({id})
      }
    })
  }
}

module.exports = new Atendimento
