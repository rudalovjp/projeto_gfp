import { BD } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class rotasSubCategorias {
    static async novaSubCategoria(req, res) {
        const { nome, id_categoria, gasto_fixo } = req.body;

        try {
            const subCategoria = await BD.query('INSERT INTO subcategorias (nome, id_categoria, gasto_fixo) VALUES ($1, $2, $3) RETURNING *', [nome, id_categoria, gasto_fixo]);
            res.status(201).json(subCategoria.rows[0]);
        } catch (error) {
            console.error('Erro ao criar subcategoria', error);
            res.status(500).json({ message: 'Erro ao criar subcategoria', error: error.message });
        }
    }
    static async atualizarSubCategoria(req, res) {
        const { id_subcategoria } = req.params;
        const { nome, id_categoria, gasto_fixo } = req.body;

        try {
            const subCategoria = await BD.query('UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3 WHERE id_subcategoria = $4 RETURNING *', [nome, id_categoria, gasto_fixo, id_subcategoria]);
            res.status(200).json(subCategoria.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar subcategoria', error: error.message });
        }
    }
    static async listarSubCategorias(req, res) {
        try {
            const subCategorias = await BD.query('SELECT * FROM subcategorias');
            res.status(200).json(subCategorias.rows);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar subcategorias', error: error.message });
        }
    }
    static async deletarSubCategoria(req, res) {
        const { id_subcategoria } = req.params;

        try {
            const subCategoria = await BD.query('DELETE FROM subcategorias WHERE id_subcategoria = $1 RETURNING *', [id_subcategoria]);
            return res.status(200).json({ message: 'Subcategoria deletada com sucesso', subCategoria: subCategoria.rows[0] });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar subcategoria', error: error.message });
        }
    }
    static async listarSubCategoriaPorId(req, res) {
        const { id_subcategoria } = req.params;

        try {
            const subCategoria = await BD.query('SELECT * FROM subcategorias WHERE id_subcategoria = $1', [id_subcategoria]);
            if (subCategoria.rows.length === 0) {
                return res.status(404).json({ message: 'Subcategoria não encontrada' });
            }
            res.status(200).json(subCategoria.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar subcategoria', error: error.message });
        }
    }
}
export default rotasSubCategorias;