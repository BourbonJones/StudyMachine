import React from "react";
import "../../Styles/Pages/Home.css";


import Welcome from '../Layouts/Welcome';

export default function Home() {
    return (
        <div id="main">
            <Welcome nav_mode="home"/>
            <div className="body_content">
                <div id="top" className="body_header">
                    <div className="body_subject">Como você deseja se conectar?</div>
                </div>
                <div className="choose_your_mode_box">
                    <div style={{color:"rgba(3, 65, 62,1)"}}>Escolha seu modo de acesso.</div>
                    <a href="./login?mode=aluno"> Aluno </a>
                    <a href="./login?mode=professor"> Professor</a>
                </div>
            </div>
        </div>
    );
}