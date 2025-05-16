import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class rotasCategorias {
    static async novaCategoria(req, res) {
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;

        try {
            const categoria = await BD.query('INSERT INTO categorias (nome, tipo_transacao, gasto_fixo, id_usuario) VALUES ($1,$2,$3,$4) RETURNING *', [nome, tipo_transacao, gasto_fixo, id_usuario]);
            res.status(201).json(categoria.rows[0]);
        } catch (error) {
            console.error('Erro ao criar categoria', error);
            res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
        }
    }
    static async atualizarCategoria(req, res) {
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;

        try {
            const categoria = await BD.query('UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, id_usuario = $4 WHERE id_categoria = $5 RETURNING *', [nome, tipo_transacao, gasto_fixo,id_usuario, id_categoria]);
            res.status(200).json(categoria.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar categoria', error: error.message });
        }
    }
    static async atualizar(req, res) {
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, id_usuario } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`);
                valores.push(tipo_transacao);
            }
            if (gasto_fixo !== undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`);
                valores.push(gasto_fixo);
            }
            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`);
                valores.push(id_usuario);
            }
            if (campos.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo fornecido para atualização' });
            }
            const query = `UPDATE categorias
                            SET ${campos.join(',')} 
                            WHERE id_categoria = ${id_categoria}
                            RETURNING *`;
                const categoria = await BD.query(query, valores);
                if (categoria.rows.length === 0) {
                    return res.status(404).json({ message: 'Categoria não encontrada' });
                }
                return res.status(200).json(categoria.rows[0]);
            } catch (error) {
                res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
            }
    }
    static async listarCategorias(req, res) {
        try {
            const categorias = await BD.query('SELECT * FROM categorias');
            res.status(200).json(categorias.rows);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar categorias', error: error.message });
        }
    }
    static async deletarCategoria(req, res) {
        const { id_categoria } = req.params;

        try {
            const categoria = await BD.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id_categoria]);
            return res.status(200).json({ message: 'Categoria deletada com sucesso', categoria: categoria.rows[0] });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar categoria', error: error.message });
        }
    }
    static async listarCategoriaPorId(req, res) {
        const { id_categoria } = req.params;

        try {
            const categoria = await BD.query('SELECT * FROM categorias WHERE id_categoria = $1', [id_categoria]);
            if (categoria.rows.length === 0) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }
            res.status(200).json(categoria.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar categoria', error: error.message });
        }
    }
    static async filtrarCategoria (req, res) {
        const { tipo_transacao } = req.query;

        try {
            const query = 'SELECT * FROM categorias WHERE tipo_transacao = $1 AND ativo = true ORDER BY nome DESC';
            const valores = [tipo_transacao]
            const resposta = await BD.query(query,valores) 
            return res.status(200).json(resposta.rows)
        } catch(error){
            console.error('Erro ao filtrar categoria', error);
            res.status(500).json({ message: 'Erro ao filtrar categoria', error: error.message });
        }
    }
}

export default rotasCategorias;