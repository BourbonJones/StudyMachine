const Professor = require("../Models/Professor");

/**
 * Cria um professor no Banco de Dados e retorna mensagem de sucesso ou falha
 * @param {*} options {nome do Professor, Senha}
 * @returns {*} {status, message}
 */

async function setProfessor(options){
    let professor = new Professor({ nome: options.nome, senha: options.senha});
    try{
        await professor.save();
        return {status: "ok", "message": "Professor adicionada com sucesso!"};
    }catch(erro){
        return {status: "erro", "message": erro};
    }
}

/**
 * Retorna as infos do Professor procurado
 * @param {*} options {nome do Professor}
 * @returns {*} {status, resposta: Object(Professor)}
 */

async function getProfessor(options){
    try{
        let professor = await Professor.findById(options.id);
        return {status: "ok", resposta: professor};
    }catch(erro){
        return {status: "erro", resposta: erro};
    }
}


module.exports = {
    setProfessor: setProfessor,
    getProfessor: getProfessor
}