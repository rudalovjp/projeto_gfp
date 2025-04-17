import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class rotasLocalTransacoes {
    static async nova(req, res) {
        const { nome, tipo_local, saldo } = req.body;

        try{
            const localTransacao = await BD.query('INSERT INTO local_transacao (nome, tipo_local, saldo) VALUES ($1, $2, $3) RETURNING *', [nome, tipo_local, saldo]);
            res.status(201).json(localTransacao.rows[0]);
        } catch(error){
            console.error('Erro ao criar local de transação', error);
            res.status(500).json({ message: 'Erro ao criar local de transação', error: error.message });
        }
    }
    static async atualizar(req, res) {
        const { id_local_transacao } = req.params;
        const { nome, tipo_local, saldo } = req.body;

        try{
            const localTransacao = await BD.query('UPDATE local_transacao SET nome = $1, tipo_local = $2, saldo = $3 WHERE id_local_transacao = $4 RETURNING *', [nome, tipo_local, saldo, id_local_transacao]);
            res.status(200).json(localTransacao.rows[0]);
        } catch(error){
            res.status(500).json({ error: 'Erro ao atualizar local de transação', error: error.message });
        }
    }
    static async listar(req, res) {
        try{
            const localTransacoes = await BD.query('SELECT * FROM local_transacao');
            res.status(200).json(localTransacoes.rows);
        }catch(error){
            res.status(500).json({ error: 'Erro ao listar locais de transação', error: error.message });
        }
    }
    static async deletar(req, res) {
        const { id_local_transacao } = req.params;

        try{
            const localTransacao = await BD.query('DELETE FROM local_transacao WHERE id_local_transacao = $1 RETURNING *', [id_local_transacao]);
            return res.status(200).json({ message: 'Local de transação deletado com sucesso', localTransacao: localTransacao.rows[0] });
        }catch(error){
            res.status(500).json({ error: 'Erro ao deletar local de transação', error: error.message });
        }
    }
    static async listarPorID(req, res) {
        const { id_local_transacao } = req.params;

        try{
            const localTransacao = await BD.query('SELECT * FROM local_transacao WHERE id_local_transacao = $1', [id_local_transacao]);
            if(localTransacao.rows.length === 0){
                return res.status(404).json({ message: 'Local de transação não encontrado' });
            }
            res.status(200).json(localTransacao.rows[0]);
        }catch(error){
            res.status(500).json({ error: 'Erro ao listar local de transação', error: error.message });
        }
    }
}
export default rotasLocalTransacoes;