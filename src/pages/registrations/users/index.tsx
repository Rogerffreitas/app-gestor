import React, { useState } from 'react'
import { Alert } from 'react-native'
import ButtonAction from '../../../components/button/ButtonAction'
import FormComponent from '../../../components/form/FormTitleComponent'
import { useAuth } from '../../../contexts/AuthContext'
import { InputStyled } from '../../../components/input/InputStyled'
import Container from '../../../components/Container'
import ErroMsd from '../../../components/ErroMsg'

export default function Cadastros() {
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [username, setUsername] = useState('')
    const [confirmacaoSenha, setConfirmacaoSenha] = useState('')
    const [erroMsgNome, setErroMsgNome] = useState(null)
    const [erroMsgEmail, setErroMsgEmail] = useState(null)
    const [erroMsgConfirmacaoSenha, setErroMsgConfirmacaoSenha] = useState(null)
    const [erroMsgSenha, setErroMsgSenha] = useState(null)
    const [erroMsgUsername, setErroMsgUsername] = useState(null)

    const { user } = useAuth()

    async function _signUp() {
        if (_validar()) {
            /*
            try {
               const { user, message } = await Auth.cadastrar(
                    nome,
                    username,
                    email,
                    senha,
                    'usuario',
                    false,
                    true,
                    usuario.empresaId
                )

                if (user) {
                    setNome(null)
                    setEmail(null)
                    setConfirmacaoSenha(null)
                    setSenha(null)
                    setUsername(null)
                    Alert.alert(message)
                } else {
                    setNome(null)
                    setEmail(null)
                    setConfirmacaoSenha(null)
                    setSenha(null)
                    setUsername(null)
                    Alert.alert(message)
                }
            } catch (err) {
                Alert.alert('Error inesperado!')
            }*/
        }
    }

    function _validar() {
        let valido = true

        if (user.role !== 'admin') {
            Alert.alert('Você não tem permissão para fazer cadastro de usuário')
            valido = false
        }
        if (nome == null || nome.length == 0) {
            setErroMsgNome('Preencha o campo obrigatório')
            valido = false
        }

        if (username == null || username.length == 0) {
            setErroMsgUsername('Preencha o campo obrigatório')
            valido = false
        }

        if (senha == null || senha.length == 0) {
            setErroMsgSenha('Preencha o campo obrigatório')
            valido = false
        }
        if (confirmacaoSenha == null || confirmacaoSenha.length == 0) {
            setErroMsgConfirmacaoSenha('Preencha o campo obrigatório')
            valido = false
        }

        if (email == null || email.length == 0) {
            setErroMsgEmail('Preencha o campo com email válido')
            valido = false
        }
        const validorEmail =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                email
            )

        if (!validorEmail) {
            setErroMsgEmail('Preencha o campo com email válido')
            valido = false
        }

        if (senha !== confirmacaoSenha) {
            erroMsgSenha('As senhas estão diferentes!')
        }
        return valido
    }

    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Novo Usuário">
                <InputStyled
                    placeholder={'Nome'}
                    autoFocus={true}
                    autoCapitalize={'words'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(text) => {
                        setNome(text)
                        setErroMsgNome(null)
                    }}
                />
                <ErroMsd>{erroMsgNome}</ErroMsd>
                <InputStyled
                    placeholder={'Username'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(text) => {
                        setUsername(text)
                        setErroMsgUsername(null)
                    }}
                />
                <ErroMsd>{erroMsgUsername}</ErroMsd>
                <InputStyled
                    placeholder={'Email'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(text) => {
                        setEmail(text)
                        setErroMsgEmail(null)
                    }}
                />
                <ErroMsd>{erroMsgEmail}</ErroMsd>
                <InputStyled
                    placeholder={'Senha'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        setSenha(text)
                        setErroMsgSenha(null)
                    }}
                />
                <ErroMsd>{erroMsgSenha}</ErroMsd>
                <InputStyled
                    placeholder={'Confirmação de senha'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={true}
                    onChangeText={(text) => {
                        setConfirmacaoSenha(text)
                        setErroMsgConfirmacaoSenha(null)
                    }}
                />
                <ErroMsd>{erroMsgConfirmacaoSenha}</ErroMsd>
                <ButtonAction acao={'Salvar'} onPressFunction={_signUp} />
            </FormComponent>
        </Container>
    )
}
