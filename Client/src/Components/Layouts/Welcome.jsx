import React from 'react';
import '../../Styles/Layouts/Welcome.css'

export default function Welcome({nav_mode, materias, functionName}) {
    var render = <div>Nada</div>

     //Renderiza todas as materias na navbar
     var lista_materias = materias? materias.lista.map((materia) => (
        <ul style={{borderBottom: "solid black 3px", fontSize: "25px"}} id={materia} key={materia} onClick={(e) => functionName(e.target.id)}>{materia}</ul>
    )) : 0;

    if (nav_mode === "home") {
        render =
            <nav id="navbar">
                <header className="nav_header">
                    Study Machine
                </header>
                <div>
                    <p>Study Machine é seu auxiliar nos estudos te entregando quantos exercícios você precisar para aprender.</p>
                    <p>Mas lembre-se que quem corre atrás é você, a verdadeira máquina de estudos!</p>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq1KXWDlvHHKAt-VMJFGQC88lDe93rCH4zoA&usqp=CAU"
                        alt="Imagem Ilustrativa" />
                </div>
            </nav>
    }
    else if (nav_mode === "materias") {
        render = <nav id="navbar">
            <header className="nav_header">
                Study Machine
            </header>
            <div>
                {lista_materias}
            </div>
        </nav>
    }
    return (
        <div>
            {render}
        </div>
    )
}