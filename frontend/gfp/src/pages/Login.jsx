// import './login.css';
import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../UsuarioContext';
import { enderecoServidor } from '../utils';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { dadosUsuario, setDadosUsuario } = useContext(UsuarioContext);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [logado, setLogado] = useState("");
    const [lembrar, setLembrar] = useState(false);

    const navigate = useNavigate(); // Hook para navegação entre páginas

    async function botaoEntrar(e) {
        e.preventDefault();
        
        try {
            if (email === "" || senha === "") {
                throw new Error("Preencha todos os campos!");
            }
            const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                //  chave: valor
                    email: email,
                    senha: senha
                })
            })
            
            if (resposta.ok) {
                const dados = await resposta.json();
                //no projeto não irá retornar uma mensagem, mas sim uma nova página
                setLogado('Login bem-sucedido!');
                localStorage.setItem('Usuario logado', JSON.stringify({...dados, lembrar})); // Armazena o token no localStorage
                setDadosUsuario(dados); // Atualiza o contexto com os dados do usuário
                navigate('/principal'); // Redireciona para a página principal após o login bem-sucedido
            } else {
                setLogado('Email ou senha incorretos')
                throw new Error('Email ou senha incorretos!');
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            alert(error.message);
            return;
        }
    }

     useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await localStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                const usuario = JSON.parse(usuarioLogado);
                setDadosUsuario(usuario);
                if (usuario.lembrar == true) {
                    navigate('/principal');
                }
            } else {
                navigate('Login');
            }
        }
    }, [])

    return (
    <div className="login-container">
        <div className="login-box">
            <h1 className="login-title">Bem-vindo</h1>
            <input
                type="email"
                placeholder="Email"
                className="login-input"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <input
                type="password"
                placeholder="Senha"
                className="login-input"
                onChange={(e) => setSenha(e.target.value)}
                value={senha}
            />
            <label className="login-switch">
                <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                />
                Lembrar-me
            </label>
            <button className="login-button" onClick={botaoEntrar}>
                Entrar
            </button>
        </div>
    </div>
);
}

const styles = `
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #30c1e5 0%, #1e3c72 100%);
    padding: 20px;
}

.login-box {
    background: #fff;
    padding: 40px 32px 32px 32px;
    border-radius: 16px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 320px;
}

.login-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 24px;
    color: #1e3c72;
    letter-spacing: 1px;
}

.login-input {
    width: 100%;
    height: 44px;
    margin-bottom: 18px;
    padding: 0 12px;
    border: 1px solid #b0bec5;
    border-radius: 8px;
    font-size: 16px;
    background: #f8fafc;
    transition: border 0.2s;
}
.login-input:focus {
    border: 1.5px solid #30c1e5;
    outline: none;
    background: #fff;
}

.login-switch {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    font-size: 15px;
    color: #1e3c72;
}
.login-switch input[type="checkbox"] {
    margin-right: 8px;
    accent-color: #30c1e5;
}

.login-button {
    width: 100%;
    height: 44px;
    background: linear-gradient(90deg, #30c1e5 0%, #1e3c72 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(30,60,114,0.08);
    transition: background 0.3s, transform 0.1s;
    margin-top: 8px;
}
.login-button:hover {
    background: linear-gradient(90deg, #1e3c72 0%, #30c1e5 100%);
    transform: translateY(-2px) scale(1.03);
}

@media (max-width: 400px) {
    .login-box {
        min-width: unset;
        width: 100%;
        padding: 24px 8px;
    }
}
`;

// Adiciona o estilo ao documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
// const styles = `
// .login-container {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     height: 100vh;
//     background-color:rgb(48, 193, 229);
//     padding: 20px;
// }

// .login-title {
//     font-size: 24px;
//     font-weight: bold;
//     margin-bottom: 20px;
//     color: #333;
// }
// .login-input {
//     width: 100%;
//     max-width: 300px;
//     height: 40px;
//     margin-bottom: 15px;
//     padding: 10px;
//     border: 1px solid #ddd;
//     border-radius: 5px;
//     font-size: 16px;
// }

// .login-button {
//     width: 100%;
//     max-width: 300px;
//     height: 40px;
//     background-color: #007BFF;
//     color: #fff;
//     border: none;
//     border-radius: 5px;
//     font-size: 16px;
//     font-weight: bold;
//     cursor: pointer;
//     transition: background-color 0.3s;
// }
// .login-button:hover {
//     background-color: #0056b3;
// }
// `;
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);