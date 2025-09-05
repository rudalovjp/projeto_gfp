import React, { useState, useEffect, useContext, use } from 'react';
import { UsuarioContext } from '../UsuarioContext'
import { enderecoServidor } from '../utils'
import { MdCreditCard, MdSave, MdClose } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom'
import Estilos from '../styles/Estilos'

export default function CadContas() {
    const { dadosUsuario } = useContext(UsuarioContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [nome, setNome] = useState('');
    const [tipoTransacao, setTipoTransacao] = useState('ENTRADA');
    // const [saldoInicial, setSaldoInicial] = useState(0);

    const itemAlterar = location.state?.itemAlterar || null;

    useEffect(() => {
        if (itemAlterar) {
            setNome(itemAlterar.nome);
            setTipoTransacao(itemAlterar.tipo_conta);
            // setSaldoInicial(itemAlterar.saldo);
        }
    }, [itemAlterar])

    const botaoSalvar = async () => {
        if (nome.trim() == '') {
            alert('Informe o nome da conta')
            return
        }
        const dados = {
            nome: nome,
            tipo_transacao: tipoTransacao,
            // saldo: parseFloat(saldoInicial) || 0
        }

        try {
            let endpoint = `${enderecoServidor}/categorias`
            let metodo = 'POST'

            if (itemAlterar) {
                endpoint = `${enderecoServidor}/contas/${itemAlterar.id_categoria}`
                metodo = 'PUT'
            }

            const resposta = await fetch(endpoint, {
                method: metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${dadosUsuario.token}`
                },
                body: JSON.stringify(dados)
            })

            if (resposta.ok) {
            if (itemAlterar) {
                alert('Conta editada com sucesso!')
            } else {
                alert('Conta cadastrada com sucesso!')
            }
            navigate('/categorias')
        }
        } catch (error) {
            alert('Erro ao salvar conta:' + error.message)
            console.error('Erro ao salvar conta:', error.message)
        }
    }

    return (
        <div className='flex justify-center py-6 px-4 '>
            <section className='w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-gray-800'>
                {/* Cabeçalho */}
                <header className='flex itens-center gap-2 mb-6 border-b border-gray-200 pb-4'>
                    <MdCreditCard className='text-cyan-600 h-8 w-8' />
                    <h2 className='text-2xl font-bold'>
                        {itemAlterar ? 'Alterar Categoria' : 'Nova Categoria'}
                    </h2>
                </header>

                {/* Formulário de cadastro */}
                <div className='space-y-5 '>
                    <label className={Estilos.labelCadastro}>Nome da Categoria</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                        placeholder='Ex. Receita' className={Estilos.inputCadastro} />
                    <label className={Estilos.labelCadastro}>Tipo de Categoria</label>
                    <select value={tipoTransacao} onChange={(e) => setTipoTransacao(e.target.value)}
                        className={Estilos.inputCadastro}>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SAIDA">Saída</option>
                    </select>
                    {/* Botões de controle */}
                    <div className='flex justify-end gap-3 mt-8'>
                        <button className={Estilos.botaoOutline} onClick={() => navigate('/categorias')}>
                            <MdClose /> Cancelar
                        </button>
                        <button className={Estilos.botao} onClick={botaoSalvar}>
                            <MdSave /> Salvar
                        </button>
                    </div>
                </div>

            </section>
        </div>
    )
}