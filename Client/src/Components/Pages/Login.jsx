import React from "react";
import { useState } from "react";
import Modal from "react-modal";
import "../../Styles/Pages/Home.css";
import "../../Styles/Pages/Login.css";

import Welcome from "../Layouts/Welcome";
Modal.setAppElement('#root');

const urlParams = new URLSearchParams(window.location.search);
const mode_user = urlParams.get("mode");

export default function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [modalOpen, setModal] = useState(false);

    function redirectToHomePage(event) {
        event.preventDefault();

        if (user !== '') {
            if (mode_user === "aluno") {
                window.location.replace('./' + mode_user + "?aluno=" + user);
            }
            else if (mode_user === "professor") {
                window.location.replace('./' + mode_user);
            }
        }
        else {
            alert("Digite o nome do usuario!")
        }
    };

    function cadastrar(e) {
        e.preventDefault();
        var body = {
            "nome": e.target.elements.nome.value,
            "senha": e.target.elements.senha.value
        }
        let request = new XMLHttpRequest();
        request.open("POST", "http://localhost:8081/aluno", false);
        request.setRequestHeader("Content-type", "application/json");
        request.send(JSON.stringify(body));
        console.log(request.responseText);

        window.location.replace('./aluno?aluno=' + e.target.elements.nome.value);
    }

    function handleOpen() {
        setModal(true);
    }

    function handleClose() {
        setModal(false);
    }

    return (
        <div id="main">
            <Welcome nav_mode="home" />
            <div className="body_content">
                <div id="top" className="body_header">
                    <div className="body_subject">Como você deseja se conectar?</div>
                    <button onClick={handleOpen}>Cadastre-se</button>
                </div>
                <form className="choose_your_mode_box">
                    <label style={{ color: "black" }}>Usuário: <input type="text" placeholder="user" value={user} onChange={(e) => setUser(e.target.value)} /></label>
                    <label style={{ color: "black" }}>Senha: <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
                    <button id="submit_login" type="submit" onClick={redirectToHomePage}>Logar</button>
                </form>
            </div>
            <Modal isOpen={modalOpen} onRequestClose={handleClose} className="popup">
                <div className="modal_header">
                    <div className="popup_name">
                        <div>Cadastro</div>
                    </div>
                    <div><button onClick={handleClose}>Fechar</button></div>
                </div>
                <form onSubmit={cadastrar} className="popup_body">
                    <div className="body_item">
                        <div className="body_label">Nome:</div>
                        <div><input name="nome" placeholder="Nome"></input></div>
                    </div>
                    <div className="body_item">
                        <div className="body_label">Senha:</div>
                        <div><input name="senha" placeholder="Senha"></input></div>
                    </div>
                    <div>
                        <button type="submit"> Enviar </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}