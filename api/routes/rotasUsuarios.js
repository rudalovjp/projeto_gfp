import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'chave-secreta'; // Chave secreta para assinar o token JWT

class rotasUsuarios {
    static async novoUsuario(req, res) {
        const { nome, email, senha, tipo_acesso } = req.body;

        const saltRounds = 10; // Número de rounds para o bcrypt
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds); // Criptografa a senha

        try {
            const usuario = await BD.query('INSERT INTO usuarios (nome, email, senha, tipo_acesso) VALUES ($1, $2, $3, $4) RETURNING *', [nome, email, senhaCriptografada, tipo_acesso]);
            res.status(201).json("Usuario Cadastrado");
        } catch (error) {
            console.error('Erro ao criar usuário', error);
            res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
        }
    }

    static async atualizarUsuario(req, res) {
        const { id_usuario } = req.params;
        const { nome, email, senha, tipo_acesso } = req.body;

        try {
            const usuario = await BD.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5 RETURNING *', [nome, email, senha, tipo_acesso, id_usuario]);
            res.status(200).json(usuario.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar usuário', error: error.message });
        }
    }
    static async atualizar(req, res){
        const {id_usuario} = req.params
        const { nome, email, senha, tipo_acesso } = req.body;
        try{
            const campos = []
            const valores = []

        if(nome !== undefined){
            campos.push(`nome = $${valores.length + 1}`)
            valores.push(nome)
        }
        if(email !== undefined){
            campos.push(`email = $${valores.length + 1}`)
            valores.push(email)
        }
        if(senha !== undefined){
            campos.push(`senha = $${valores.length + 1}`)
            valores.push(senha)
        }
        if(tipo_acesso !== undefined){
            campos.push(`tipo_acesso = $${valores.length + 1}`)
            valores.push(tipo_acesso)
        }
        if (campos.length === 0){
            return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
        }

        const query = `UPDATE usuarios
                            SET ${campos.join(', ')}
                            WHERE id_usuario = ${id_usuario}
                            RETURNING *`;
           
            const usuario = await BD.query(query, valores)
        if(usuario.rows.length === 0){
            return res.status(404).json({message: 'Usuario não encontrado'})
        }
        return res.status(200).json(usuario.rows[0]);
        }catch(error){
            res.status(500).json({message:"erro ao atualizar o usuario", error: error.message})
        }
    }


    static async deletarUsuario(req, res) {
        const { id_usuario } = req.params;

        try {
            const usuario = await BD.query('UPDATE usuarios SET ativo = false WHERE id_usuario = $1 RETURNING *', [id_usuario]);
            return res.status(200).json({ message: 'Usuário deletado com sucesso', usuario: usuario.rows[0] });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar usuário', error: error.message });
        }
    }
    static async login(req, res) {
        const {email, senha} = req.body;
 
        try{
          const resultado = await BD.query(
            `SELECT * FROM usuarios WHERE email = $1`,
            [email]
          );
 
          if (resultado.rows.length === 0) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
          }
 
          const usuario = resultado.rows[0];
          const senhaValida = await bcrypt.compare(senha, usuario.senha)
 
          if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
          }
 
          const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                tipo_acesso: usuario.tipo_acesso
            }, JWT_SECRET,
            { expiresIn: '1h' });

            res.status(200).json({
            mensagem: "Login bem-sucedido",
            token: token
            })
 
          return res.status(200).json({message: "Login bem-sucedido"});
          // return res.status(200).json({message: "Login bem-sucedido", usuario});
 
        } catch (error) {
          console.error("Erro ao logar:", error);
          res.status(500).json({ message: "Erro ao logar", error: error.message });
        }
      }
    static async listarUsuarios(req, res) {
        try {
            const usuario = await BD.query('SELECT * FROM usuarios WHERE ativo = true');
            res.status(200).json(usuario.rows);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar usuários', error: error.message });
        }
    }
    static async listarUsuarioPorId(req, res) {
        const { id_usuario } = req.params;

        try {
            const usuario = await BD.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
            res.status(200).json(usuario.rows[0]);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar usuário', error: error.message });
        }
    }
}

export default rotasUsuarios;