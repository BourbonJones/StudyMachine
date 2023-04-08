const Assunto = require("../Models/Assunto");

/**
 * Retorna todos os assuntos cadastrados.
 * @returns {*} {status, resposta: LISTA DE ASSUNTOS -> Object(Assunto)[]}
 */
async function getAllAssuntos() {
    try {
        let assuntos = await Assunto.find();
        return ({ status: "ok", resposta: assuntos });
    } catch (erro) {
        return ({ status: "error", resposta: erro });
    }
}

/**
 * Cria um assunto no Banco de Dados (Não admite duplicações)
 * @param {*} options {nome do Assunto, materia}
 * @returns {*} {status, message}
 */
async function createAssunto(options) {
    try {
        let existente = await getAssuntoByName({ name: options.nome });
        if (existente.status === "erro") {
            let assunto = new Assunto({ nome: options.nome, materia: options.materia });
            await assunto.save();
            return ({ status: "ok", message: "Assunto adicionado com sucesso!" });
        }
        else {
            return { status: "ok", message: "Assunto já existente" }
        }
    } catch (erro) {
        return ({ status: "erro", message: erro });
    }
}

/**
 * Retorna todas as infos do Assunto procurado
 * @param {*} options {nome do Assunto}
 * @returns {*} {status, resposta: Object(Assunto)}
 */
async function getAssuntoByName(options) {
    try {
        let assunto = await Assunto.findOne({ nome: options.nome });
        if (assunto)
            return ({ status: "ok", resposta: assunto });
        return ({ status: "erro", resposta: "Error: Assunto is not found." })
    } catch (erro) {
        return ({ status: "erro", resposta: erro });
    }
}

/**
 * Atualiza as informações de um assunto (Resumo ou Exercícios);
 * Admite duplicações de exercícios. E apenas uma informação no resumo (Será necessário passar mais de uma info no resumo)
 * @param {*} options {nome do Assunto, resumo, exercicio, mode}
 * @returns {*} {status, message}
 */
async function updateAssunto(options) {
    try {
        let assunto = await Assunto.findOne({ nome: options.nome });
        if (assunto) {
            //Se MODE == true -> Inserção de elementos (resumo ou exercicios)
            if (options.mode) {
                if (options.resumo != null) {
                    assunto.resumo = options.resumo
                }
                if (options.exercicio != null) {
                    for(let i in assunto.exercicios){
                        if(assunto.exercicios[i].enunciado == options.exercicio.enunciado){
                            return ({ status: "erro", message: "Esse exercicio já foi inserido!" });
                        }
                    }
                    assunto.exercicios.push(options.exercicio);
                }
                await assunto.save();
                return ({ status: "ok", message: assunto });
            }
            //Se MODE == false -> Exclusão de exercício apenas (resumo só é editado, nunca excluido)
            else {
                console.log("mode: false");
                let exercicios = assunto.exercicios;
                let novo_array = [];
                for (let i in exercicios) {
                    if (exercicios[i].enunciado != options.exercicio.enunciado) {
                        novo_array.push(exercicios[i]);
                    }
                }
                assunto.exercicios = novo_array;
                await assunto.save();
                return { status: "ok", message: assunto };
            }
        }
        else {
            return ({ status: "ok", message: "Assunto " + options.nome + " não encontrado" });
        }
    } catch (erro) {
        return ({ status: "erro", message: "Erro Code:", erro });
    }


}
/**
 * Deleta Assunto
 * @param {*} options {nome do assunto} 
 * @returns {*} {status, message}
 */
async function deleteAssunto(options) {
    try {
        await Assunto.deleteOne({ nome: options.nome });
        return { status: "ok", message: "Assunto " + options.nome + " removido com sucesso" };
    } catch (erro) {
        return ({ status: "erro", message: erro });
    }
}

module.exports = {
    getAllAssuntos: getAllAssuntos,
    createAssunto: createAssunto,
    getAssuntoByName: getAssuntoByName,
    updateAssunto: updateAssunto,
    deleteAssunto: deleteAssunto
}