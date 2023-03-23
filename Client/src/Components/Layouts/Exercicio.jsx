import React from "react";
import "../../Styles/Layouts/Welcome.css";

export default function Exercicio({ lista_exercicios, aluno, idTeste, assunto }) {
    var i = 0;
    var render_exercicios = lista_exercicios.map((exercicio) => (
        <div className="exercicio" key={i++}>
            <div>Questão {i}</div>
            <img src={exercicio.enunciado} alt="imagem" />
            <ul>
                <li>A: {exercicio.letraA}</li>
                <li>B: {exercicio.letraB}</li>
                <li>C: {exercicio.letraC}</li>
                <li>D: {exercicio.letraD}</li>
                <li>E: {exercicio.letraE}</li>
            </ul>
            <select id={exercicio.resposta} name={"select"+i}>
                <option value="a">a</option>
                <option value="b">b</option>
                <option value="c">c</option>
                <option value="d">d</option>
                <option value="e">e</option>
            </select>
        </div>
    ));

    function submeter_exercicios(e){
        e.preventDefault();
        var body = {
            assunto: assunto,
            id: idTeste,
            respostas: [],
            marcacao: [],
            mode: "send"
        }

        for(let i=0; i<lista_exercicios.length;i++){
            body.marcacao.push(e.target.elements["select"+(i+1)].value);
            body.respostas.push(e.target.elements["select"+(i+1)].id);
        }
        body.respostas = "[" + body.respostas.map((elemento) => elemento) + "]";
        body.marcacao = "[" + body.marcacao.map((elemento) => elemento) + "]";
        console.log(body);

        var url = "http://localhost:8081/aluno/teste/" + aluno;

        let request = new XMLHttpRequest();
        request.open("POST", url, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        alert("Teste Concluido! Voltar para a pagina do assunto.");
    }

    return (
        <div id="main">
            <form onSubmit={submeter_exercicios}>
            {render_exercicios}
            <button type="submit">Submeter</button>
            </form>
        </div>
    );
}