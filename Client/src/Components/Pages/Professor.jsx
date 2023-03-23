import React, { useState } from "react";
import Modal from "react-modal";
import "../../Styles/Pages/Aluno.css";
import "../../Styles/Pages/Professor.css";
import materias from "../../materias.json";

function pegar(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    return request.responseText;
}

Modal.setAppElement('#root');

var assuntos = JSON.parse(pegar("http://localhost:8081/professor/assuntos"));

export default function Professor() {

    const [subjectPage, setSubject] = useState("Matemática");
    const [modalOpen, setModal] = useState(false);

    function deleteAssunto(e) {
        var request = new XMLHttpRequest();
        request.open("DELETE", "http://localhost:8081/professor/assuntos/" + e.target.value, false);
        request.setRequestHeader("Content-type", "application/json");
        request.send();

        window.location.reload();
    }

    function sendAssunto(e) {
        e.preventDefault();
        var assunto = e.target.elements.assunto.value;
        var body = {
            nome: assunto,
            materia: subjectPage
        }

        let request = new XMLHttpRequest();
        request.open("POST", "http://localhost:8081/professor/assuntos", true);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));

        window.location.reload();
    }

    function redirectToEditAssunto(e){
        window.location.replace("/professor/assunto?assunto=" + e.target.value.replaceAll(" ", "_"))
    }

    function handleOpen(){
        setModal(true);
    }

    function handleClose(){
        setModal(false);
    }


    //Renderiza todas as materias na navbar
    var lista_materias = materias.lista.map((materia) => (
        <ul id={materia} key={materia} onClick={(e) => setSubject(e.target.id)}>{materia}</ul>
    ));

    //Renderiza assuntos da materia escolhida
    var lista_assuntos = assuntos.assuntos
        .filter(assunto => assunto.materia === subjectPage)
        .map((assunto) => (
            <li className="infos" key={assunto.nome}>
                <div className="info">{assunto.nome}</div>
                <button className="edit" value={assunto.nome} onClick={redirectToEditAssunto}>Editar</button>
                <button className="delete" type="button" value={assunto.nome} onClick={deleteAssunto}>Excluir</button>
            </li>
        ));

    return (
        <div id="main">
            <nav>
                <header className="nav_header">
                    Study Machine
                </header>
                {lista_materias}
            </nav>
            <div className="body_content">
                <div id="top" className="body_header">
                    <div className="body_subject">{subjectPage}</div>
                    <button style={{backgroundColor: "rgba(3, 65, 62,1)"}} type="button" onClick={handleOpen}>Inserir Assunto</button>
                </div>
                <div className="body_assuntos">
                    <ul className="assuntos">
                        <li className="assuntos_header">
                            <div className="info">Todos os assuntos de {subjectPage}</div>
                        </li>
                        {lista_assuntos}
                    </ul>
                </div>
            </div>
            <Modal isOpen={modalOpen} onRequestClose={handleClose} className="popup">
                <div className="modal_header">
                    <div className="popup_name">
                        <div> Inserir Assunto</div>
                    </div>
                    <div><button onClick={handleClose}>Fechar</button></div>
                </div>
                <form onSubmit={sendAssunto} className="popup_body">
                    <div className="body_item">
                        <div className="body_label">Assunto:</div>
                        <div><input name="assunto" placeholder="Assunto"></input></div>
                    </div>
                    <div className="body_item">
                        <div className="body_label">Matéria:</div>
                        <div>{subjectPage}</div>
                    </div>
                    <div>
                        <button type="submit"> Enviar </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}