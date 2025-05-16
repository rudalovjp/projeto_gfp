import React, { useState, useEffect, use } from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Principal({ navigation }) {
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            } else {
                navigation.navigate('Login');
            }
        }
        buscarUsuarioLogado();
    }, [])
    
    const botaoLogout = () => {
        AsyncStorage.removeItem('UsuarioLogado')
        navigation.navigate('Login');
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text>Usuário: {usuario.nome}</Text>
                <Button title="Sair" onPress={botaoLogout} />
            </View>
            <Text>Tela Principal</Text>
        </View>

    )
}