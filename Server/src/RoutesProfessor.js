
const express = require("express");
const routes = express.Router();
const bodyParser = require("body-parser");
const { Assunto, Aluno, Professor } = require("./Database");

//BODY PARSER
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

//ROUTES
var dir_name = "/professor/";
/*Get All Assuntos */
routes.get(dir_name + "assuntos", async (req, res) => {

    let assuntos = await Assunto.getAllAssuntos();

    if (assuntos.status == 'ok') {
        let lista = assuntos.resposta;
        let resposta = {
            status: assuntos.status,
            assuntos: []
        }

        for (let i in lista) {
            let body = {
                nome: lista[i].nome,
                nome_for_link: lista[i].nome.replaceAll(" ", "_"),
                materia: lista[i].materia,
            }

            resposta.assuntos.push(body);
        }
        res.send(resposta);
    }
    else{
        res.send(assuntos.status);
    }
});
/*Get infos of Assunto*/
routes.get(dir_name + "assuntos/:assunto", async (req, res) => {
    let name = req.params.assunto.replaceAll("_"," ");

    if (name) {
        let assunto = await Assunto.getAssuntoByName({nome: name});

        if (assunto.status === "ok") {
            if(assunto.resposta.length === 0)
                res.send({status: "erro", message: "Nenhum assunto com esse nome foi encontrado!"});
            else
                res.send(assunto);
        }
        else{
            res.send(assunto);
        }
    }
    else{
        res.send({status: "erro", message: "Nome não dado!"});
    }

    
});
/*Create Assunto*/
routes.post(dir_name + "assuntos", async (req, res) => {
    let assunto = {
        nome: req.body.nome ? req.body.nome : null,
        resumo: null,
        materia: req.body.materia ? req.body.materia : null,
        exercicios: null
    };

    let message = await Assunto.createAssunto(assunto);
    res.send(message);
});
/*Update Assunto with either Resumo or Exercicio (delete exercicio)*/
routes.put(dir_name + "assuntos/:assunto", async (req, res) => {
    let req_assunto = req.params.assunto.replaceAll("_"," ");
        let assunto = await Assunto.updateAssunto({nome: req_assunto, resumo: req.body.resumo, exercicio: req.body.exercicio, mode: req.body.mode});
        res.send(assunto);
});
/*Delete Assunto (Todos os alunos devem ter assuntos desmarcados)*/
routes.delete(dir_name + "assuntos/:assunto", async (req, res) => {
    let assunto = {
        nome: req.params.assunto.replaceAll("_"," ")
    }
    var alunos = await Aluno.getAllAlunosNames();
    //Tem q desmatricular todos os alunos desse assunto
    for(let i in alunos){
        let aluno = {
            nome: alunos[i],
            matricular: false,
            assunto: req.params.assunto
        }
        await Aluno.updateMatriculasAluno(aluno);
    }
    //Get Aluno com Assunto, Desmarcar Assunto em cada Aluno e enfim Deletar o Assunto
    let message = await Assunto.deleteAssunto(assunto);
    res.send(message);
});

module.exports = routes;