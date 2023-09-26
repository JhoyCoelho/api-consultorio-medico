const { consultorio } = require("../bancodedados");
let { idConsulta, consultas, consultasFinalizadas, laudos } = require("../bancodedados");

const listarConsultas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query;
    
    if (!cnes_consultorio || !senha_consultorio) {
        return res.status(401).json({ "mensagem": "Cnes ou senha não informados!" });
    }else if (cnes_consultorio !== consultorio.cnes || senha_consultorio !== consultorio.senha) {
        return res.status(401).json({ "mensagem": "Cnes ou senha inválidos!" });
    }

    if (consultas.length < 1) {
        return res.status(204).send();
    }

    return res.status(200).json(consultas);
};

const criarConsulta = (req, res) => {
    const { tipoConsulta, valorConsulta, paciente } = req.body;
    const { nome, cpf, dataNascimento, celular, email, senha} = paciente;

    if (!tipoConsulta || !valorConsulta || !paciente) {
        return res.status(400).json({ "mensagem": "É obrigatório que sejam preenchidos todos os campos" });
    }
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ "mensagem": "É obrigatório informar todos os dados do paciente" });      
    }

    if (isNaN(valorConsulta)){
        return res.status(400).json({ "mensagem": "O valor da consulta deve ser um valor numérico" });
    }

    const validarCpf = consultas.some((consulta) => {
        return consulta.paciente.cpf === cpf;
    });
    if (validarCpf) {
        return res.status(400).json({ "mensagem": "Já existe uma consulta em andamento com o cpf ou e-mail informado!" });
    }

    const medicoDisponivel = consultorio.medicos.find((medico) => {
        return medico.especialidade === tipoConsulta;
    });

    if (!medicoDisponivel) {
        return res.status(404).json({ "mensagem": "O tipo de consulta informado não consta nas especialidades dos médicos disponíveis" });
    }

    idConsulta++;
    const novaConsulta = {
        "identificador": idConsulta,
        "tipoConsulta": tipoConsulta,
        "identificadorMedico": medicoDisponivel.identificador,
        "finalizada": false,
        "valorConsulta": valorConsulta,
        "paciente": {
            "nome": nome,
            "cpf": cpf,
            "dataNascimento": dataNascimento,
            "celular": celular,
            "email": email,
            "senha": senha
        }
    };
    consultas.push(novaConsulta);

    return res.status(204).send();
};

const atualizarConsulta = (req, res) => {
    const { nome, cpf, dataNascimento, celular, email, senha} = req.body;
    const { identificadorConsulta } = req.params;
    if (!nome || !cpf || !dataNascimento || !celular || !email || !senha) {
        return res.status(400).json({ "mensagem": "É obrigatório informar todos os dados do paciente" });      
    }
    
    if (!identificadorConsulta) {
        return res.status(400).json({ "mensagem": "É obrigatório informar o Identificador da Consulta" });
    }else if (isNaN(identificadorConsulta)) {
        return res.status(400).json({ "mensagem": "O Identificador deve ser um valor numérico" });
    }

    const consultaValida = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    });

    if (!consultaValida) {
        return res.status(404).json({ "mensagem": "Consulta não encontra" });
    }

    const validarCpf = consultas.some((consulta) => {
        return consulta.paciente.cpf === cpf;
    });
    if (validarCpf) {
        return res.status(400).json({ "mensagem": "Cpf já consta na base!" });
    }

    const validarEmail = consultas.some((consulta) => {
        return consulta.paciente.email === email;
    });
    if (validarEmail) {
        return res.status(400).json({ "mensagem": "E-mail já consta na base!" });
    }

    if (consultaValida.finalizada) {
        return res.status(403).json({ "mensagem": "A consulta só pode ser alterada se a mesma não estiver finalizada" });
    }

    consultaValida.paciente.nome = nome;
    consultaValida.paciente.cpf = cpf;
    consultaValida.paciente.dataNascimento = dataNascimento;
    consultaValida.paciente.celular = celular;
    consultaValida.paciente.email = email;
    consultaValida.paciente.senha = senha;
    
    return res.status(204).send()
};

const cancelarConsulta = (req, res) => {
    const { identificadorConsulta } = req.params;

    if (!identificadorConsulta) {
        return res.status(400).json({ "mensagem": "É obrigatório informar o Identificador da Consulta" });
    }else if (isNaN(identificadorConsulta)) {
        return res.status(400).json({ "mensagem": "O Identificador deve ser um valor numérico" });
    }

    const consultaEncontrada = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    });

    if (!consultaEncontrada) {
        return res.status(404).json({ "mensagem": "Consulta não encontrada" });
    }

    if (consultaEncontrada.finalizada === true) {
        return res.status(403).json({ "mensagem": "A consulta só pode ser removida se a mesma não estiver finalizada" });
    }

    consultas = consultas.filter((consulta) => {
        return consulta.identificador !== Number(identificadorConsulta);
    });

    return res.status(204).send();
};

const finalizarConsulta = (req, res) => {
    const { identificadorConsulta, textoMedico } = req.body;
    
    if (!identificadorConsulta || !textoMedico) {
        return res.status(400).json({ "mensagem": "É obrigatório preencher todos os campos" });
    }

    const consultaEncontrada = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    })

    if (!consultaEncontrada) {
        return res.status(404).json({ "mensagem": "Consulta não encontrada"});
    }

    if (consultaEncontrada.finalizada) {
        return res.status(403).json({ "mensagem": "Essa consulta já foi finalizada" });
    }

    if (textoMedico <= 0 || textoMedico > 200) {
        return res.status(400).json({ "mensagem": "O tamanho do textoMedico não está dentro do esperado" });
    }

    consultaEncontrada.finalizada = true;
    
    laudos.push({
        "identificador": consultaEncontrada.identificador,
        "identificadorConsulta": consultaEncontrada.identificador,
        "identificadorMedico": consultaEncontrada.identificadorMedico,
        "textoMedico": textoMedico,
        "paciente": consultaEncontrada.paciente
    });
    consultasFinalizadas.push({
        "identificador": consultaEncontrada.identificador,
        "tipoConsulta": consultaEncontrada.tipoConsulta,
        "identificadorMedico": consultaEncontrada.identificadorMedico,
        "finalizada": true,
        "identificadorLaudo": consultaEncontrada.identificador,
        "valorConsulta": consultaEncontrada.valorConsulta,
        "paciente": consultaEncontrada.paciente
    });

    return res.status(204).send();
};

const laudo = (req,res) => {
    const { identificador_consulta, senha } = req.query;

    const consultaEncontrada = consultas.find((consulta) => {
        return consulta.identificador === Number(identificador_consulta);
    });

    if (!identificador_consulta || !senha || isNaN(identificador_consulta)) {
        return res.status(400).json({ "mensagem": "Consulta médica não encontrada!" });
    } else if (!consultaEncontrada) {
        return res.status(404).json({ "mensagem": "Consulta médica não encontrada!" });
    } else if (senha !== consultaEncontrada.paciente.senha) {
        return res.status(403).json({ "mensagem": "Consulta médica não encontrada!" });
    }else if (!consultaEncontrada.finalizada) {
        return res.status(404).json({ "mensagem": "Consulta médica não encontrada!" });
    }

    const laudoEncontrado = laudos.find((laudo) => {
        return laudo.identificador === Number(consultaEncontrada.identificador);
    })

    return res.status(200).json(laudoEncontrado);
};

const medico = (req, res) => {
    const { identificador_medico } = req.query;

    const medicoEncontrado = consultorio.medicos.find((medico) => {
        return medico.identificador === Number(identificador_medico);
    });

    if (!identificador_medico || isNaN(identificador_medico)) {
        return res.status(400).json({ "mensagem": "O médico informado não existe na base!" });
    } else if (!medicoEncontrado) {
        return res.status(404).json({ "mensagem": "O médico informado não existe na base!" });
    }

    let consultasAtendidas = consultas.filter((consulta) => {
        return consulta.identificadorMedico === Number(medicoEncontrado.identificador);
    })
    consultasAtendidas = consultasAtendidas.filter((consulta) => {
        return consulta.finalizada === true;
    })
    
    return res.status(200).json(consultasAtendidas);
};

module.exports = {
    listarConsultas,
    criarConsulta,
    atualizarConsulta,
    cancelarConsulta,
    finalizarConsulta,
    laudo,
    medico
};