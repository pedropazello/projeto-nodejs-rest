const fs = require('fs')
const path = require('path')

module.exports = (caminho, nomeDoArquivo, callBackImagemCriada) => {
  const tiposValidos = ['jpg', 'png', 'jpeg']
  const tipo = path.extname(caminho)
  const tipoEValido = tiposValidos.indexOf(tipo.substring(1)) !== -1

  if (tipoEValido) {
    const novoCaminho = `./assets/imagens/${nomeDoArquivo}${tipo}`

    fs.createReadStream(caminho)
      .pipe(fs.createWriteStream(novoCaminho))
      .on('finish', () => { callBackImagemCriada(false, novoCaminho) })
  } else {
    const erro = "Tipo é inválido"
    callBackImagemCriada(erro)
    console.log('Erro! Tipo inválido')
  }
}
