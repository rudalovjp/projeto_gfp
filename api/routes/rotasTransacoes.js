import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class rotasTransacoes {
    static async nova(req, res) {
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try {
            const transacao = await BD.query('INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual]);
            res.status(201).json(transacao.rows[0]);
        } catch(error) {
            console.error('Erro ao criar transação', error);
            res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
        }
    }
    static async atualizar(req, res) {
        const { id_transacao } = req.params;
        const { valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual } = req.body;

        try {
            const transacao = await BD.query('UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4, data_pagamento = $5, tipo_transacao = $6, id_local_transacao = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *', [valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual, id_transacao]);
            res.status(200).json(transacao.rows[0]);
        } catch(error) {
            console.error('Erro ao atualizar transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }
    }
    static async listar(req, res) {
        try {
            const transacoes = await BD.query('SELECT * FROM transacoes');
            res.status(200).json(transacoes.rows);
        } catch(error) {
            console.error('Erro ao listar transações', error);
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
        }
    }
    static async deletar(req, res) {
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query('DELETE FROM transacoes WHERE id_transacao = $1 RETURNING *', [id_transacao]);
            return res.status(200).json({ message: 'Transação deletada com sucesso', transacao: transacao.rows[0] });
        } catch(error) {
            console.error('Erro ao deletar transação', error);
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
        }
    }
    static async listarPorID(req, res) {
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query('SELECT * FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            if(transacao.rows.length === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            res.status(200).json(transacao.rows[0]);
        } catch(error) {
            console.error('Erro ao listar transação', error);
            res.status(500).json({ message: 'Erro ao listar transação', error: error.message });
        }
    }
}
export default rotasTransacoes;