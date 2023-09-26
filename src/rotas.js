const express = require("express");
const { listarConsultas,
        criarConsulta,
        atualizarConsulta,
        cancelarConsulta,
        finalizarConsulta,
        laudo,
        medico
    } = require("./controladores/consultas")

const rotas = express();

rotas.use(express.json());

rotas.get("/consultas", listarConsultas);
rotas.post("/consulta", criarConsulta);
rotas.put("/consulta/:identificadorConsulta/paciente", atualizarConsulta);
rotas.delete("/consulta/:identificadorConsulta", cancelarConsulta);
rotas.post("/consulta/finalizar", finalizarConsulta);
rotas.get("/consulta/laudo", laudo);
rotas.get("/consultas/medico", medico);

module.exports = rotas;