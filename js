
const express = require('express');
const app = express();
const porta = process.env.PORT || 3000;

app.use(express.static('.'));

app.listen(porta, () => console.log('Servidor rodando!'));
