import Exercicio from "../components/Exercicio.jsx";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Principal() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const buscarUsuarioLogado = () => {
            const usuarioLogado = localStorage.getItem('Usuario logado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            } else {
                navigate('/'); // Redireciona para a página de login se não houver usuário logado
            }
        }
        buscarUsuarioLogado();
    }, []);
    const botaoLogout = () => {
        try {
            localStorage.removeItem('Usuario logado');
            setUsuario(null) // Redireciona para a página de login após o logout
            navigate('/');
        } catch (error) {
            console.error('Erro ao realizar logout:', error);
        }
    }
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between', alignItems: 'center'}}>
                <p>Usuário: {usuario.nome}</p>
                <button onClick={botaoLogout}>Sair</button>
            </div>
            <div style={{ padding: '20px' }}>
                <h2>Principal</h2>
            </div>
        </div>
    )

}