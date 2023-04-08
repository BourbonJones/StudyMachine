const express = require("express");
const routes = express.Router();
const bodyParser = require("body-parser");
const { Assunto, Aluno, Professor } = require("./Database");

//BODY PARSER
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

//ROUTES
var dir_name = "/aluno/";
/*Get Aluno*/
routes.get(dir_name + ":aluno", async (req, res) => {
    let db_aluno = await Aluno.getAluno({ nome: req.params.aluno });
    let aluno;
    if (db_aluno.status == "ok") {
        aluno = db_aluno.resposta;

        let matriculas = aluno.assuntos;

        let matriculas_nome = [];
        let matriculas_teste = [];
        let matriculas_nota = [];
        for (let i in matriculas) {
            matriculas_nome.push(matriculas[i].assunto);
            matriculas_teste.push(matriculas[i].tem_teste);
            matriculas_nota.push(matriculas[i].nota);
        }

        let assuntos = await Assunto.getAllAssuntos();

        if (assuntos.status == 'ok') {
            let lista = assuntos.resposta;
            let resposta = {
                status: assuntos.status,
                assuntos: [],
                teste: aluno.testes
            }

            for (let i in lista) {
                let body = {
                    nome: lista[i].nome,
                    nome_for_link: lista[i].nome.replaceAll(" ", "_"),
                    materia: lista[i].materia
                }

                let index = matriculas_nome.indexOf(lista[i].nome);
                if (index != -1) {
                    body.matriculado = true;
                    body.tem_teste = matriculas_teste[index];
                    body.nota = matriculas_nota[index];
                }
                else {
                    body.matriculado = false;
                    body.tem_teste = false;
                    body.nota = null;
                }

                resposta.assuntos.push(body);
            }
            res.send(resposta);
        }
        else {
            res.send(assuntos);
        }
    }
    else {
        res.send(db_aluno);
    }


});
/*Create Aluno*/
routes.post(dir_name, async (req, res) => {
    let aluno = {
        "nome": req.body.nome,
        "senha": req.body.senha
    }
    console.log(aluno);
    let message = await Aluno.createAluno(aluno);
    res.send(message);
});
/*Update Aluno with Matriculas(Assuntos)*/
routes.put(dir_name + "matriculas", async (req, res) => {
    let aluno = {
        nome: req.body.nome,
        matricular: req.body.matricular,
        assunto: req.body.assunto
    }
    let message = await Aluno.updateMatriculasAluno(aluno);
    res.send(message);
});
/*Delete Aluno*/
routes.delete(dir_name + ":aluno", async (req, res) => {
    let aluno = {
        nome: req.params.aluno
    };
    let message = await Aluno.deleteAluno(aluno);
    res.send(message);
});
/*Cria um teste e adiciona no Aluno*/
routes.post(dir_name + "teste/:aluno", async (req, res) => {
    let db_aluno = await Aluno.getAluno({ nome: req.params.aluno });
    let assunto = await Assunto.getAssuntoByName({ nome: req.body.assunto });
    if (db_aluno.status === 'erro') {
        res.send(db_aluno);
        return;
    }
    let nota = null;
    let indice = null;
    //Criar Teste ----------------------------------------------------------
    if (req.body.mode === 'create') {

        for (let i in db_aluno.resposta.assuntos) {
            if (db_aluno.resposta.assuntos[i].assunto === req.body.assunto) {
                nota = db_aluno.resposta.assuntos[i].nota;
                console.log("CREATE NOTA:", nota);
                indice = i;
                break;
            }
        };
        if (!indice) {
            res.send({ status: "erro", message: "Aluno não matriculado neste assunto" });
            return;
        }

        let teste = {
            id: db_aluno.resposta.testes.length,
            nota_atual_aluno: null,
            assunto: req.body.assunto,
            exercicios: []
        };

        //Número mínimo de testes para entrar no algoritmo não atingido ----
        if (assunto.resposta.exercicios.length <= 8) {
            teste.exercicios = assunto.resposta.exercicios;
        }
        //Numero mínimo de testes atingido ---------------------------------
        else {
            let ex_qte_por_nivel = [];
            switch (true) {
                case nota < 0.75: ex_qte_por_nivel = [5, 3, 0];
                case nota < 0.80: ex_qte_por_nivel = [3, 4, 1];
                case nota < 0.90: ex_qte_por_nivel = [2, 4, 2];
                case nota < 0.95: ex_qte_por_nivel = [1, 4, 3];
            }
            let niveis = ['facil', 'medio', 'dificil']
            for (let i in ex_qte_por_nivel) {
                let limite = ex_qte_por_nivel[i];
                for (let j in assunto.resposta.exercicios) {
                    if (assunto.resposta.exercicios[j].nivel === niveis[i] && limite > 0) {
                        teste.exercicios.push(assunto.resposta.exercicios[j]);
                        limite--;
                    }
                }
            }
        }
        //-----------------------------------------------------------------
        db_aluno.resposta.testes.push(teste);
        db_aluno.resposta.assuntos.splice(indice, 1, { assunto: req.body.assunto, tem_teste: true, nota: nota });
        let new_aluno = await db_aluno.resposta.save();
        res.send({ teste: teste });


    } else if (req.body.mode === 'send') {
        //Calcular nota pós teste ------------------------------------------
        let aluno_respostas = req.body.marcacao.split(",");
        let teste_respostas = req.body.respostas.split(",");
        console.log(aluno_respostas, teste_respostas);
        let qte = aluno_respostas.length;
        let qte_certas = 0;
        for (let i in aluno_respostas) {
            if (aluno_respostas[i] == teste_respostas[i]) {
                qte_certas++;
            }
        }
        let notaTeste = qte_certas / qte;

        //Atualizar nota do aluno para o assunto do contexto --------------
        for(let i=0; i<db_aluno.resposta.assuntos.length;i++){
            console.log(db_aluno.resposta.assuntos[i].assunto, req.body.assunto);
            if(db_aluno.resposta.assuntos[i].assunto === req.body.assunto){
                console.log(db_aluno.resposta.assuntos[i].nota);
                console.log(notaTeste);
                console.log("notaAtualizada = ((2*" + db_aluno.resposta.assuntos[i].nota + ") + (3*" + notaTeste + "))/5");
                let notaAtualizada = db_aluno.resposta.assuntos[i].nota!=null? ((2*db_aluno.resposta.assuntos[i].nota)+(3*notaTeste))/5: notaTeste;
                console.log(notaAtualizada);
                db_aluno.resposta.assuntos.splice(i, 1, { assunto: req.body.assunto, tem_teste: false, nota:  notaAtualizada});
            }
        }
        //Atualizar a nota do aluno no teste feito ------------------------
        for(let i=0; i<db_aluno.resposta.testes.length;i++){
            if(db_aluno.resposta.testes[i].id == req.body.id){
                db_aluno.resposta.testes[i].nota_atual_aluno = notaTeste;
                db_aluno.resposta.testes.splice(i, 1, { id: db_aluno.resposta.testes[i].id, 
                    assunto: db_aluno.resposta.testes[i].assunto, 
                    nota_atual_aluno:  notaTeste,
                    exercicios: db_aluno.resposta.testes[i].exercicios});
            }
        }
        //Salvar atualizações ---------------------------------------------
        await db_aluno.resposta.save();

        res.send({ status: "ok", message: db_aluno.resposta})
    }
});
/*Delete Exercicio */
routes.delete(dir_name + ":aluno", async (req, res) => {
    let aluno = {
        nome: req.params.assunto,
        exercicio: req.params.enunciado
    };
    let message = await Aluno.deleteAluno(aluno);
    res.send(message);
});


module.exports = routes;