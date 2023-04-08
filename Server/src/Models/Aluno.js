const mongoose = require("mongoose");

const aluno = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    assuntos: {
        type: Array
    },
    testes:{
        type: Array
    }
});
var Aluno = mongoose.model("aluno", aluno);

module.exports = Aluno;