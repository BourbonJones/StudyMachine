import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./Styles/Pages/App.css";

import Home from './Components/Pages/Home';
import Login from './Components/Pages/Login';
import Aluno from './Components/Pages/Aluno';
import Professor from './Components/Pages/Professor';
import Assunto from './Components/Pages/Assunto';
import EditAssunto from './Components/Pages/EditAssunto';
import Teste from './Components/Pages/Teste';

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/aluno" element={<Aluno />} />
          <Route path="/aluno/assunto" element={<Assunto />} />
          <Route path="/aluno/assunto/teste" element={<Teste />} />
          <Route path="/professor" element={<Professor />} />
          <Route path="/professor/assunto" element={<EditAssunto />} />
      </Routes>

    </Router>
  );
}