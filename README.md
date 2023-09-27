# API REST de um Consultório Médico

Essa é uma API de um consultório e consiste no agendamento e gerenciamento de consultas médicas, laudos, etc. Nela, os dados não podem ser acessados ou alterados por qualquer pessoa, sendo necessária a verificação e validação de dados, garantindo assim a segurança e a proteção dos dados dos pacientes.

## Funcionalidades

- Criar consultas médicas;
- Listar consultas médicas;
- Atualizar dados de pacientes (para consultas não finalizadas);
- Cancelar consultas médicas;
- Finalizar consultas médicas;
- Listar laudos;
- Listar consultas de acordo com a especialidade do médico que atendeu.

## Persistência de dados

É importante destacar que todos os dados na API são persistidos em memória e, durante a execução, serão guardados dentro do arquivo `bancodedados.js`, porém esses dados só serão mantidos enquato o servidor estiver rodando, após finalizar ou reiniciar o servidor, os dados são zerados novamente.

## Requisitos para o funcionamento da API

Além do Git, é necessário ter o Node.js e o npm instalados em sua máquina para instalação das dependências do projeto e para inicializar o servidor. Também é necessária uma ferramenta para testar a API e seus endpoints, como o Postman ou o Insomnia.

## tecnologias 

- JavaScript
- Node.js
- npm
- Express

## Instalação 

- Primeiro crie um clone desse repositório localmente na sua máquina
- Na pasta criada onde colonou o repositório, abra o seu terminal digite:
```
npm install
```
*Esse comando serve para instalar todas as dependências do projeto*

- Ainda no terminal, para inicializar o Servidor digite o comando:
```
npm run dev
```
*Pronto, o servidor foi iniciado. ( Caso queira derrubar o servidor basta pressionar as teclas ` Ctrl + C ` no terminal )*

## Rotas
![Rotas-Insomnia](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/27b12574-3d5f-4071-90cc-e4ba3fec8fcb)

- [GET] /consultas

Para Listar consultas é preciso utilicar o verbo `GET` passando a seguinte rota `http://localhost:3000/consultas?cnes_consultorio=1001&senha_consultorio=CubosHealth@2022` onde serão verificados e validados o CNES e a senha do consultório. A lista de consultas só será retornada se esses dados forem válidos.

![Lista-Consultas](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/c7a1accd-b81f-47ff-a7a8-bb9e6eedf486)

- [POST] /consulta

Para Criar consultas é preciso utilicar o verbo `POST` passando a seguinte rota `http://localhost:3000/consulta` onde serão verificados e validados os dados passados no corpo da requisição. A consulta só é criada se os critérios forem atendidos.

![Criar-Consulta](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/f6ee5e47-ace9-4b54-a1f6-ef87a5825b59)

- [PUT] /consulta/:identificadorConsulta/paciente

Para Atualizar consultas é preciso utilicar o verbo `PUT` passando a seguinte rota `http://localhost:3000/consulta/@id/paciente` (substitua "@id" por um identificador válido). Serão verificados tanto o Id da consulta quanto os dados passados no corpo da requisição.

![Atualizar-consulta](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/7386a1b1-5ab9-4008-9f78-dc6c8cd4634c)

- [DELETE] /consulta/:identificadorConsulta

Para Cancelar consultas é preciso utilicar o verbo `DELETE` passando a seguinte rota `http://localhost:3000/consulta/@id` (substitua "@id" por um identificador válido). Será verificado se o identificador é válido e cancelada a consulta correspondente.

![Cancelar-Consulta](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/0c4e76ab-7ff7-47a9-858a-45e6f2f5a592)

- [POST] /consulta/finalizar

Para Finalizar consultas é preciso utilicar o verbo `POST` passando a seguinte rota `http://localhost:3000/consulta/finalizar` e serão verificados e validados os dados passados no corpo da requisição. Ao finalizar uma consulta é gerado um laudo.

![Finalizar-Consulta](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/c81a9bf6-6ab7-4c05-b7af-335537760b79)

- [GET] /consulta/laudo

Para Listar Laudos é preciso utilicar o verbo `GET` passando a seguinte rota `http://localhost:3000/consulta/laudo?identificador_consulta=@id&senha=1234` (substitua "@id" por um identificador válido), onde serão verificados e validados o identificador da consulta e a senha do paciente, retornando o Laudo correspondente.

![Laudos](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/dcaa21ee-8005-452f-a5ee-9ba60842af8c)

- [GET] /consultas/medico

Para Listar as consultas que um médico específico fez, é preciso utilicar o verbo `GET` passando a seguinte rota `http://localhost:3000/consultas/medico?identificador_medico=@id` (substitua "@id" por um identificador válido), onde será verificado se existe o médico solicitado, e caso exista, será retornada a lista de todas as consultas correspondentes à especialidade desse médico.

![Medico](https://github.com/JhoyCoelho/api-consultorio-medico/assets/140108354/2bb9607a-11a2-4698-aefe-b3d0824ec983)
