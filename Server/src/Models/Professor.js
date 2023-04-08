const mongoose = require("mongoose");

const professor = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
});
var Professor = mongoose.model("professor", professor);

module.exports = Professor;