const mongoose = require("mongoose");

const assunto = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    resumo: {
        type: String,
    },
    materia: {
        type: String,
        required: true
    },
    exercicios: {
        type: Array
    }
});
var Assunto = mongoose.model("assunto", assunto);

module.exports = Assunto;