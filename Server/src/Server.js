//IMPORTS
const express = require("express");
const cors = require("cors");
const routesAlunos = require("./RoutesAluno");
const routesProfessor = require("./RoutesProfessor");
const database = require("./Database");
//CONFIGS
const app = express();
const port = 8081;

//CORS
app.use(cors());

//DATABASE
database.connectToDatabase();

//ROUTES

app.use(routesAlunos);
app.use(routesProfessor);

//PORT
app.listen(port, function(){
    console.log("Servidor rodando na url http://localhost:" + port);
});