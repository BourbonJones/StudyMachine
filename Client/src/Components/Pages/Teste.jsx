import React from "react";
import Exercicio from "../Layouts/Exercicio";

const urlParams = new URLSearchParams(window.location.search);
const assunto = urlParams.get("assunto");
const aluno = urlParams.get("aluno");
const idTeste = urlParams.get("teste");


function pegarTeste() {
    let request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8081/aluno/" + aluno, false);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
    let response = JSON.parse(request.responseText);
    return response;
}

export default function Teste() {

    let response = pegarTeste();
    let teste = response.teste[idTeste];

    function redirectToAssunto() {
        window.location.replace("../assunto?aluno=" + aluno + "&assunto=" + assunto);
    }
    var exercicios = response.teste[idTeste].exercicios;

    return (
        <div id="main">
            <nav>
                <header className="nav_header">
                    Study Machine
                </header>
                <div style={{ padding: "10px" }}>Aluno: {aluno} </div>
                <div style={{ padding: "10px" }}>Assunto: {assunto.replaceAll("_", " ")}</div>
                <div style={{ padding: "10px" }}>Nota: {teste.nota_atual_aluno}</div>
            </nav>
            <div className="body_content">
                <div id="top" className="body_header">
                    <button onClick={redirectToAssunto}>Voltar</button>
                    <div className="body_subject">Teste de {assunto.replaceAll("_", " ")}</div>
                </div>
                <Exercicio lista_exercicios={exercicios} aluno={aluno} idTeste={idTeste} assunto={assunto.replaceAll("_", " ")} />
            </div>
        </div>
    );
}