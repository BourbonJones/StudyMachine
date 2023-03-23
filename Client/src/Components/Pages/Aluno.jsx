import React, { useState } from "react";
import "../../Styles/Pages/Aluno.css"
import materias from "../../materias.json";
import Welcome from "../Layouts/Welcome";

const urlParams = new URLSearchParams(window.location.search);
const aluno = urlParams.get("aluno");

function pegar(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    return request.responseText;
}

var assuntos = JSON.parse(pegar("http://localhost:8081/aluno/" + aluno));

export default function Aluno() {
    const [subjectPage, setSubject] = useState("Matemática");

    function changeSubjectPage(newSubject){
        setSubject(newSubject);
    }

    function redirectToAssunto(e) {
        e.preventDefault();
        window.location.replace("./aluno/assunto?aluno=" + aluno + "&assunto=" + e.target.id.replaceAll(" ","_"));
    };

    //Renderiza assuntos da materia escolhida

    var lista_assuntos;
    if (assuntos.status === "ok") {
        lista_assuntos = assuntos.assuntos
            .filter(assunto => assunto.materia === subjectPage)
            .map((assunto) => (
                <li className="infos" key={assunto.nome}>
                    <div className="info infoA" id={assunto.nome} onClick={redirectToAssunto}>{assunto.nome}</div>
                    <div className="info">{assunto.matriculado ? "Sim" : "Não"}</div>
                    <div className="info">{assunto.tem_teste ? "Teste Pendente" : "Sem Testes Agendados"}</div>
                </li>
            ));
    }
    else {
        lista_assuntos = <h1 className="erro">Page Fault</h1>
    }

    return (
        <div id="main">
            <Welcome nav_mode="materias" materias={materias} functionName={changeSubjectPage}/>
            <div className="body_content">
                <div id="top" className="body_header">
                    <div className="body_subject">{subjectPage}</div>
                    <div className="body_profile">Perfil</div>
                </div>
                <div className="body_assuntos">
                    <ul className="assuntos">
                        <li className="assuntos_header">
                            <div className="info">Assuntos</div>
                            <div className="info">Matriculado</div>
                            <div className="info">Status</div>
                        </li>
                        {lista_assuntos}
                    </ul>
                </div>
            </div>
        </div>
    );
}