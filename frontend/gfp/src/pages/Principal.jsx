import Exercicio from "../components/Exercicio.jsx";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../UsuarioContext.jsx';

export default function Principal() {
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!dadosUsuario && !carregando) {
            navigate('/login'); // Redireciona para a página de login se não houver usuário logado
        }
    }, [dadosUsuario, carregando, navigate]);

    const botaoLogout = () => {
        try {
            localStorage.removeItem('Usuario logado');
            setDadosUsuario(null) // Redireciona para a página de login após o logout
            navigate('/');
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    }
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between', alignItems: 'center'}}>
                <p>Usuário: {dadosUsuario?.nome}</p> {/* ? deixa o código mais limpo, caso não tenha usuário logado */}
                <button onClick={botaoLogout}>Sair</button>
            </div>
            <div style={{ padding: '20px' }}>
                <h2>Principal</h2>
            </div>
        </div>
    )

}