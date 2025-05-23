// import './login.css';
import { useState } from 'react';
import { enderecoServidor } from '../utils';
import { useNavigate } from 'react-router-dom';

export default function Login() {
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" style={{ marginRight: '5px'}}
                checked={lembrar} onChange={(e) => setLembrar(e.target.checked)}/>
                <label>Lembrar-me</label>
            </div>
            <button className="login-button" onClick={botaoEntrar}>
                Entrar
            </button>
        </div>
    );
}
const styles = `
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color:rgb(48, 193, 229);
    padding: 20px;
}

.login-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}
.login-input {
    width: 100%;
    max-width: 300px;
    height: 40px;
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

.login-button {
    width: 100%;
    max-width: 300px;
    height: 40px;
    background-color: #007BFF;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}
.login-button:hover {
    background-color: #0056b3;
}
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);