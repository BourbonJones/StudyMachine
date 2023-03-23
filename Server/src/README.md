# Servidor  (backend)

## Comunicações
Frontend/Consumidor <-> Rotas <-> Controllers <-> Banco de Dados

## Rotas
Serão divididas entre aluno e professor pois cada tipo tem seus acessos e responsabilidades;

### Aluno
Rotas | Descrição
-------|----------
get("/aluno/:aluno") | Resgata todas as informações do `:aluno`
post("/aluno") | Cria um aluno
put("/aluno/matriculas") | Modifica a lista de matrículas do aluno
delete("/aluno/:aluno") | Deleta `:aluno`

### Professor
Rotas | Descrição
-------|----------
get("/professor") | Resgata todos os assuntos cadastrados
get("/professor/assuntos/:assunto") | Resgata as informações do `:assunto`
post("/assuntos") | Cria um assunto
put("/assuntos/:assunto") | Modifica as informações do `:assunto` (resumo ou exercícios)
delete("/assuntos/:assunto") | Deleta `:assunto`

## Base de Dados

### MongoDB Schemas
Posteriormente, será passado para mySQL.

#### Assuntos
Atributos:
* Uma categoria (Matéria);
* Uma lista de exercícios;
* Um resumo;

#### Alunos
Atributos:
* Nome
* Senha
* Assuntos (Matrículas)

#### Professores
Atributos:
* Nome
* Senha

Professores podem criar, modificar, deletar assuntos do banco de dados. 
