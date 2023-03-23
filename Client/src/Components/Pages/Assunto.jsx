import React from "react";
import "../../Styles/Pages/Aluno.css";

function requisicao(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
    return request.responseText;
}

const urlParams = new URLSearchParams(window.location.search);
const assunto = urlParams.get("assunto");
const aluno = urlParams.get("aluno");
console.log("assunto:", assunto);

var assunto_inicial = JSON.parse(requisicao("http://localhost:8081/professor/assuntos/" + assunto));

var infos_aluno = JSON.parse(requisicao("http://localhost:8081/aluno/" + aluno));
console.log(infos_aluno);


console.log("teste", infos_aluno.teste);

export default function Assunto() {

    function redirectToAluno() {
        window.location.replace("../aluno?aluno=" + aluno);
    }

    function redirectToTeste(e) {
        e.preventDefault();
        window.location.replace("./assunto/teste?aluno=" + aluno + "&assunto=" + assunto + "&teste=" + e.target.id);
    };

    function generateNewTest() {

        for(let i in infos_aluno.teste){
            if(infos_aluno.teste[i].nota_atual_aluno==null){
                alert("Ainda há um teste pendente! Você não pode pedir um novo teste agora.")
                return
            }
        }

        var body = {
            assunto: assunto.replaceAll("_"," "),
            mode: "create"
        }

        let request = new XMLHttpRequest();
        request.open("POST", "http://localhost:8081/aluno/teste/" + aluno, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        window.location.reload();
    }

    function matricular() {
        var body = {
            "nome": aluno,
            "matricular": true,
            "assunto":
            {
                "assunto": assunto.replaceAll("_"," "),
                "tem_teste": false
            }
        }

        let request = new XMLHttpRequest();
        request.open("PUT", "http://localhost:8081/aluno/matriculas", false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        alert("Matriculado com sucesso no assunto " + assunto.replaceAll("_"," ") + "!");
    }

    function desmatricular(){
        var body = {
            "nome": aluno,
            "matricular": false,
            "assunto":
            {
                "assunto": assunto.replaceAll("_"," "),
                "tem_teste": false
            }
        }

        let request = new XMLHttpRequest();
        request.open("PUT", "http://localhost:8081/aluno/matriculas", false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        alert("Desmatriculado do assunto " + assunto.replaceAll("_"," ") + ". :(");
    }

    //Renderiza testes
    var testes;
    if (infos_aluno.teste) {
        testes = infos_aluno.teste.map((teste) => (
            <li className="infos" key={teste.id}>
                <div className="info infoA" id={teste.id} onClick={redirectToTeste}>{teste.assunto}{" "}{teste.id}</div>
                <div className="info">{teste.nota_atual_aluno!=null ? ("Nota: " + teste.nota_atual_aluno) : "Pendente"}</div>
            </li>
        ));
    }

    var nota_assunto = infos_aluno.assuntos? infos_aluno.assuntos.filter((elemento) => elemento.nome === assunto.replaceAll("_"," ")).map((elemento) => elemento.nota)[0]:null;
console.log(nota_assunto);

    return (
        <div id="main">
            <nav>
                <header className="nav_header">
                    Study Machine
                </header>
                <ul style={{ fontSize: "15px" }}>Nome: {aluno}</ul>
                <ul style={{ fontSize: "15px" }}>Rendimento: {nota_assunto!=null? nota_assunto.toFixed(2): "?"}</ul>
                <ul style={{ height: "auto", border: "none" }}><button onClick={generateNewTest}>Gerar novo Teste</button></ul>
                <ul style={{ height: "auto", border: "none" }}><button onClick={matricular}>Matricular-se</button></ul>
                <ul style={{ height: "auto", border: "none" }}><button style={{backgroundColor: "red"}} onClick={desmatricular}>Desmatricular-se</button></ul>
            </nav>
            <div className="body_content">
                <div id="top" className="body_header">
                    <button onClick={redirectToAluno}>Voltar</button>
                    <div className="body_subject">{assunto.replaceAll("_", " ")}</div>
                    <div className="body_profile">Perfil</div>
                </div>
                <div className="body_assuntos">
                    <ul className="assuntos">
                        <li className="assuntos_header"><div className="info">Resumo</div></li>
                        {assunto_inicial.resposta.resumo && <img style={{ width: "50%" }} src={assunto_inicial.resposta.resumo} alt="Resumo" />}
                        <li className="assuntos_header"><div className="info"> Testes Cadastrados </div></li>
                        {testes}
                    </ul>
                </div>
            </div>
        </div>
    );

}