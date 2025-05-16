import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class rotasNovasContas {
    static async nova(req, res) {
        const { nome, tipo_conta, saldo } = req.body;

        try{
            const contas = await BD.query('INSERT INTO contas (nome, tipo_conta, saldo) VALUES ($1, $2, $3) RETURNING *', [nome, tipo_conta, saldo]);
            res.status(201).json(contas.rows[0]);
        } catch(error){
            console.error('Erro ao criar local de transação', error);
            res.status(500).json({ message: 'Erro ao criar local de transação', error: error.message });
        }
    }
    static async atualizar(req, res) {
        const { id_conta } = req.params;
        const { nome, tipo_conta, saldo } = req.body;

        try{

            const contas = await BD.query('UPDATE contas SET nome = $1, tipo_conta = $2, saldo = $3 WHERE id_conta = $4 RETURNING *', [nome, tipo_conta, saldo, id_conta]);
            res.status(200).json(contas.rows[0]);
        } catch(error){
            res.status(500).json({ error: 'Erro ao atualizar local de transação', error: error.message });
        }
    }
    static async listar(req, res) {
        try{
            const contas = await BD.query('SELECT * FROM contas');
            res.status(200).json(contas.rows);
        }catch(error){
            res.status(500).json({ error: 'Erro ao listar locais de transação', error: error.message });
        }
    }
    static async deletar(req, res) {
        const { id_conta } = req.params;

        try{
            const contas = await BD.query('DELETE FROM contas WHERE id_conta = $1 RETURNING *', [id_conta]);
            return res.status(200).json({ message: 'Local de transação deletado com sucesso', contas: contas.rows[0] });
        }catch(error){
            res.status(500).json({ error: 'Erro ao deletar local de transação', error: error.message });
        }
    }
    static async listarPorID(req, res) {
        const { id_conta } = req.params;

        try{
            const contas = await BD.query('SELECT * FROM contas WHERE id_conta = $1', [id_conta]);
            if(contas.rows.length === 0){
                return res.status(404).json({ message: 'Local de transação não encontrado' });
            }
            res.status(200).json(contas.rows[0]);
        }catch(error){
            res.status(500).json({ error: 'Erro ao listar local de transação', error: error.message });
        }
    }
    static async filtrarConta (req, res) {
        const { nome } = req.query;

        try {
            const query = 'SELECT * FROM contas WHERE nome = $1 AND ativo = true ORDER BY saldo DESC';
            const valores = [nome]

            const resposta = await BD.query(query,valores) 
            
            return res.status(200).json(resposta.rows)
        } catch(error){
            console.error('Erro ao filtrar conta', error);
            res.status(500).json({ message: 'Erro ao filtrar conta', error: error.message });
        }
    }
}
export default rotasNovasContas;