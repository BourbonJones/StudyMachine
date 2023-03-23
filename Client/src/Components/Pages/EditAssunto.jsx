import React, { useState } from "react";
import Modal from "react-modal";
import "../../Styles/Pages/Professor.css";

function requisicao(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
    return request.responseText;
}

const urlParams = new URLSearchParams(window.location.search);
const assunto = urlParams.get("assunto");

Modal.setAppElement('#root');

var assunto_inicial = JSON.parse(requisicao("http://localhost:8081/professor/assuntos/" + assunto));


export default function EditAssunto() {
    const [modalOpen, setModal] = useState(false);
    const [modalMode, setMode] = useState("");

    var materia = assunto_inicial.resposta.materia;
    console.log(assunto_inicial.resposta.resumo)

    function redirectToProfessor(e) {
        e.preventDefault();
        window.location.replace("/professor");
    }

    function sendExercicio(e) {
        e.preventDefault();

        var body = {
            assunto: assunto.replaceAll(" ", "_"),
            resumo: null,
            exercicio: {
                enunciado: e.target.elements.exercicio.value,
                letraA: e.target.elements.letraA.value,
                letraB: e.target.elements.letraB.value,
                letraC: e.target.elements.letraC.value,
                letraD: e.target.elements.letraD.value,
                letraE: e.target.elements.letraE.value,
                resposta: e.target.elements.resposta.value,
                nivel: e.target.elements.nivel.value
            },
            mode: true
        }

        let request = new XMLHttpRequest();
        request.open("PUT", "http://localhost:8081/professor/assuntos/" + assunto, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));
    }

    function deleteExercicio(e) {
        e.preventDefault();

        var body = {
            assunto: assunto.replaceAll("_", " "),
            resumo: null,
            exercicio: {
                enunciado: e.target.id
            },
            mode: false
        }

        let request = new XMLHttpRequest();
        request.open("PUT", "http://localhost:8081/professor/assuntos/" + assunto, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        window.location.reload();
    }

    function sendResumo(e) {
        e.preventDefault();

        var body = {
            assunto: assunto.replaceAll(" ", "_"),
            resumo: e.target.elements.resumo.value,
            exercicio: null,
            mode: true
        }

        let request = new XMLHttpRequest();
        request.open("PUT", "http://localhost:8081/professor/assuntos/" + assunto, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));
    }

    function handleOpen() {
        setModal(true);
        setMode("exercicio");
    }

    function handleClose() {
        setModal(false)
    }

    function handleResumo() {
        setModal(true);
        setMode("resumo");
    }


    var assuntos = JSON.parse(requisicao("http://localhost:8081/professor/assuntos"));

    //renderiza lista de assuntos da mesma materia
    var lista_assuntos = assuntos.assuntos
        .filter(assunto => assunto.materia === materia)
        .map((assunto) => (
            <ul id={assunto.nome} key={assunto.nome}><a style={{ border: "none", backgroundColor: "#30404d" }} href={"/professor/assunto?assunto=" + assunto.nome.replaceAll(" ", "_")}>{assunto.nome}</a></ul>
        ));

    //Renderiza o resumo
    var resumo;
    if (assunto_inicial.resposta.resumo) {
        resumo = <li className="infos" key={assunto}><div className="info"><img src={assunto_inicial.resposta.resumo} alt="imagem" /></div>
            <button className="edit" onClick={handleResumo}>Editar</button>
        </li>
    }
    else {
        resumo = <li className="infos" key={assunto}>
            <button className="edit" onClick={handleResumo}>Adicionar Resumo</button>
        </li>
    }

    //Renderiza os exercicios
    var lista_exercicios = assunto_inicial.resposta.exercicios
        .map((exercicio) => (
            <li className="infos" key={exercicio.enunciado}>
                <div className="info"><img src={exercicio.enunciado} alt="imagem" /></div>
                <div className="info"><button id={exercicio.enunciado} className="delete" onClick={deleteExercicio}>Excluir</button></div>
            </li>
        ))
    return (
        <div id="main">
            <nav>
                <header className="nav_header">
                    Study Machine
                </header>
                <div>
                    {lista_assuntos}
                </div>
            </nav>
            <div className="body_content">
                <div id="top" className="body_header">
                    <button type="button" onClick={redirectToProfessor}>Voltar</button>
                    <div className="body_subject">{assunto.replaceAll("_", " ")}</div>
                    <button id="inserir_assunto" type="button" onClick={handleOpen}>Inserir Exercício</button>
                </div>
                <div className="body_assuntos">
                    <ul className="assuntos">
                        <li className="assuntos_header"><div className="info">Resumo</div></li>
                        {resumo}
                        <li className="assuntos_header"><div className="info">Exercícios</div></li>
                        {lista_exercicios}
                    </ul>
                </div>
            </div>
            <Modal isOpen={modalOpen} onRequestClose={handleClose} className="popup">
                <div className="modal_header">
                    <div className="popup_name">
                        {modalMode === "exercicio" && <div>Inserir Exercício </div>}
                        {modalMode === "resumo" && <div>Editar Resumo </div>}
                    </div>
                    <div><button onClick={handleClose}>Fechar</button></div>
                </div>
                {modalMode === "exercicio" &&
                    <form onSubmit={sendExercicio} className="popup_body">
                        <div className="body_item">
                            <div className="body_label">Enunciado:</div>
                            <div><input name="exercicio" placeholder="link do exercicio" /></div>
                        </div>
                        <div id="body_alternativas">
                            <div><input name="letraA" placeholder="letra A"></input></div>
                            <div><input name="letraB" placeholder="letra B"></input></div>
                            <div><input name="letraC" placeholder="letra C"></input></div>
                            <div><input name="letraD" placeholder="letra D"></input></div>
                            <div><input name="letraE" placeholder="letra E"></input></div>
                            <div>
                                <select name="nivel" placeholder="nivel">
                                    <option value="facil">Facil</option>
                                    <option value="medio">medio</option>
                                    <option value="dificil">dificil</option>
                                </select>
                            </div>
                        </div>
                        <div className="body_item">
                            <div className="body_label">Resposta:</div>
                            <div><input name="resposta" placeholder="Resposta"></input></div>
                        </div>
                        <div>
                            <button type="submit"> Enviar </button>
                        </div>
                    </form>}
                {modalMode === "resumo" &&
                    <form onSubmit={sendResumo} className="popup_body">
                        <div className="body_item">
                            <div className="body_label">Resumo:</div>
                            <div><input name="resumo" placeholder="link do resumo" /></div>
                        </div>
                        <div>
                            <button type="submit"> Enviar </button>
                        </div>
                    </form>
                }
            </Modal>
        </div>
    );
}