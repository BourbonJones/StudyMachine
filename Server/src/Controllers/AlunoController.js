const Aluno = require("../Models/Aluno");

/**
 * Cria um aluno no Banco de Dados e retorna a mensagem de sucesso ou falha. Não admite duplicações
 * @param {*} options {nome do aluno, senha}
 * @returns {*} {status, message}
 */

async function createAluno(options) {
    try {
        let existente = await getAluno({ nome: options.nome });
        if (existente.status === "erro") {
            let aluno = new Aluno({ nome: options.nome, senha: options.senha, assuntos: [], testes: []});
            await aluno.save();
            return { status: "ok", message: "Aluno adicionado com sucesso!" };
        }
        else{
            return { status: "ok", message: "Aluno já existente" }
        }
    } catch (erro) {
        return { status: "erro", message: erro };
    }
}

/**
 * Retorna todas as infos do Aluno procurado ou retorna erro.
 * @param {*} options {nome do aluno}
 * @returns {*} {status, resposta: Obeject(Aluno)}
 */

async function getAluno(options) {
    try {
        let aluno = await Aluno.findOne({ nome: options.nome });
        if (aluno)
            return { status: "ok", resposta: aluno };
        return { status: "erro", resposta: "Error: Aluno is not found." };
    } catch (erro) {
        return { status: "erro", resposta: erro };
    }
}

/**
 * Atualiza a lista de assuntos em que o aluno está cadastrado bem como se há testes pendentes para ele fazer
 * @param {*} options {nome do Aluno, assunto, matricular(boolean)}
 * @returns {*} {status, message}
 */

async function updateMatriculasAluno(options) {
    try {
        let aluno = await Aluno.findOne({ nome: options.nome })
        let objectAssunto = options.assunto;
        if (options.matricular == false) { //Se é opção de se DESmatricular
            aluno.assuntos = aluno.assuntos.filter(assunto => assunto.assunto != objectAssunto.assunto);
            await aluno.save();
            return { status: "ok", message: "Assunto " + options.assunto.assunto + " desmarcardo com sucesso" };
        }
        else {//Se é opção de se matricular
            if (!aluno.assuntos.find(element => element.assunto == objectAssunto.assunto)) {
                aluno.assuntos.push(options.assunto);
                aluno.save();
                return { status: "ok", message: "Assunto " + options.assunto.assunto + " marcardo com sucesso" };
            }
            else {
                return { status: "erro", message: "Assunto já existente!" }
            }
        }
    } catch (erro) {
        return { status: "erro", message: erro }
    }
}

/**
 * Deleta Aluno
 * @param {*} options {nome do aluno} 
 * @returns {*} {status, message}
 */

async function deleteAluno(options) {
    try {
        await Aluno.deleteOne({ nome: options.nome });
        return { status: "ok", message: "Aluno removido com sucesso!" };
    } catch (erro) {
        return { status: "ok", message: erro };
    }
}
/**
 * 
 * @returns {*} {status, names[]}
 */
async function getAllAlunosNames(){
    try {
        let alunos = await Aluno.find();
        let nomes = [];
        for(let i in alunos){
            nomes.push(alunos[i].nome);
        }
        return {status: "ok", resposta: nomes}
    } catch (erro) {
        return {status: "erro", resposta: erro}
    }
}

/**
 * Seta testes para o Aluno
 * @param {*} options {nome do aluno, Object(teste)}
 * @returns {*} {status, message}
 */
async function setTeste(options){
    let aluno = await Aluno.findOne({ nome: options.nome })
    aluno.testes = options.teste;
    aluno.save();
    return { status: "ok", message: "Teste adicionado com sucesso ao aluno " + options.nome};
}

module.exports = {
    createAluno: createAluno,
    getAluno: getAluno,
    updateMatriculasAluno: updateMatriculasAluno,
    deleteAluno: deleteAluno,
    getAllAlunosNames: getAllAlunosNames,
    setTeste: setTeste
}