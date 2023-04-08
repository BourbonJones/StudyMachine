const mongoose = require("mongoose");
const Assunto = require("./Controllers/AssuntoController");
const Aluno = require("./Controllers/AlunoController");
const Professor = require("./Controllers/ProfessorController");

//Database
function connectToDatabase() {
    mongoose.connect("mongodb+srv://BourbonJones:ad8530fe@cluster0.rrnq8.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection; //Infos about mongoose connection
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to the database"));
}

//EXPORTS
module.exports = {
    connectToDatabase: connectToDatabase,
    Assunto: Assunto,
    Aluno: Aluno,
    Professor: Professor
}
