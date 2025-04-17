import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors';
import rotasUsuarios from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotasLocalTransacoes from './routes/rotasLocalTransacoes.js';
import rotasTransacoes from './routes/rotasTransacoes.js';

const app = express();
 //testa a conexão com o banco de dados

app.use(cors()); //habilita o cors
app.use(express.json()); //habilita o json no express
testarConexao();
app.get('/', (req, res) => {
    res.send('API funcionando!'); //responde com uma mensagem de sucesso
})

//Rotas usuarios
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarUsuario)
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletarUsuario)
app.get('/usuarios', rotasUsuarios.listarUsuarios)
app.get('/usuarios/:id_usuario', rotasUsuarios.listarUsuarioPorId)
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar)
app.post('/login', rotasUsuarios.login)

//Rotas categorias
app.post('/categorias', rotasCategorias.novaCategoria)
app.put('/categorias/:id_categoria', rotasCategorias.atualizarCategoria)
app.get('/categorias', rotasCategorias.listarCategorias)
app.delete('/categorias/:id_categoria', rotasCategorias.deletarCategoria)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)
app.get('/categorias/:id_categoria', rotasCategorias.listarCategoriaPorId)

//Rotas subcategorias
app.post('/subcategorias', rotasSubCategorias.novaSubCategoria)
app.put('/subcategorias/:id_subcategoria', rotasSubCategorias.atualizarSubCategoria)
app.get('/subcategorias', rotasSubCategorias.listarSubCategorias)
app.delete('/subcategorias/:id_subcategoria', rotasSubCategorias.deletarSubCategoria)
app.get('/subcategorias/:id_subcategoria', rotasSubCategorias.listarSubCategoriaPorId)

//Rotas locais de transações
app.post('/localtransacoes', rotasLocalTransacoes.nova)
app.put('/localtransacoes/:id_local_transacao', rotasLocalTransacoes.atualizar)
app.get('/localtransacoes', rotasLocalTransacoes.listar)
app.delete('/localtransacoes/:id_local_transacao', rotasLocalTransacoes.deletar)
app.get('/localtransacoes/:id_local_transacao', rotasLocalTransacoes.listarPorID)

//Rotas transações
app.post('/transacoes', rotasTransacoes.nova)
app.put('/transacoes/:id_transacao', rotasTransacoes.atualizar)
app.get('/transacoes', rotasTransacoes.listar)
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletar)
app.get('/transacoes/:id_transacao', rotasTransacoes.listarPorID)

const porta = 3000; //define a porta do servidor
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`);
})

// {
//     "id_transacao": 1,
//     "valor": "100.00",
//     "descricao": "Emergencial",
//     "data_transacao": "2025-04-17T03:00:00.000Z",
//     "data_vencimento": "2025-05-17T03:00:00.000Z",
//     "data_pagamento": "2025-04-18T03:00:00.000Z",
//     "tipo_transacao": "SAIDA",
//     "id_local_transacao": 1,
//     "id_categoria": 3,
//     "id_subcategoria": 1,
//     "id_usuario": 1,
//     "num_parcelas": 3,
//     "parcela_atual": 1
// }