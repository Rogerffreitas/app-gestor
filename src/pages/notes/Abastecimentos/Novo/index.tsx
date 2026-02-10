import React, { useState, useRef } from 'react'
import { Alert, View } from 'react-native'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import { useAuth } from '../../../../contexts/AuthContext'
import { save } from '../../../../dao/AbastecimentoDAO'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { InputStyled } from '../../../../components/input/InputStyled'

export default function NovoDesconto({ navigation, route }) {
    const [descricao, setDescricao] = useState<string>('')
    const [valor, setValor] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    const [valorPorLitro, setValorPorLitro] = useState(0)
    const [observacao, setObservacao] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [descontar, setDescontar] = useState(false)
    const [obra, setObra] = useState<string>(route.params.obra)
    const [veiculo, setVeiculo] = useState<string>(route.params.veiculo)
    const [tipo, setTipo] = useState<string>(route.params?.tipo)
    const [erroMsgDescricao, setErroMsgDescricao] = useState('')
    const [erroMsgQuantidade, setErroMsgQuantidade] = useState('')
    const { usuario } = useAuth()

    async function _handlerSave() {
        if (usuario.id == null || usuario.empresaId == null) {
            Alert.alert('Error')
            navigation.goBack()
        }

        let melosaId = ''
        if (tipo == 'tanque') {
            melosaId = veiculo
        }
        if (validar()) {
            try {
                setIsLoading(true)

                const response = await save(
                    valor,
                    quantidade,
                    valorPorLitro,
                    descricao,
                    tipo,
                    observacao,
                    true,
                    melosaId,
                    0,
                    veiculo,
                    obra,
                    usuario.empresaId,
                    usuario.id,
                    descontar
                )

                if (response.id) {
                    Alert.alert('Abastecimento Cadastrado')
                    successVibration()
                    navigation.goBack()
                }
            } catch (error) {
                console.error(error.message)
                errorVibration()
                setIsLoading(false)
            }
        } else {
            errorVibration()
        }
    }

    function validar() {
        let valido = true
        if (descricao == null || descricao.length == 0) {
            setErroMsgDescricao('Preencha o campo obrigatório')
            valido = false
        }

        if (quantidade == null || quantidade == 0) {
            if (valor == null || valor == 0) {
                Alert.alert('Você deve informar um dos campos: QUANTIDADE OU VALOR')
                valido = false
            }
        }

        return valido
    }

    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Abastecimento">
                <DescriptionTextInput
                    description={'Descrição:* '}
                    erroMenssage={erroMsgDescricao}
                />
                <InputStyled
                    value={descricao}
                    placeholder={'Descrição'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        setDescricao(value)
                        setErroMsgDescricao(null)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '47%', marginRight: 20 }}>
                        <DescriptionTextInput description={'Quantidade: '} erroMenssage={''} />
                        <InputMaskNumber
                            value={quantidade}
                            placeholder={'Quantidade'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                setQuantidade(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
                                )
                                setErroMsgQuantidade(null)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '47%' }}>
                        <DescriptionTextInput description={'Valor por litro: '} erroMenssage={''} />
                        <InputMaskMoney
                            value={valorPorLitro}
                            placeholder={'Valor por litro'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                setValorPorLitro(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
                                )
                                let t =
                                    quantidade *
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
                                setValor(+t)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <DescriptionTextInput description={'Valor Total: '} erroMenssage={''} />
                <InputMaskMoney
                    value={valor}
                    placeholder={'Valor Total'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        setValor(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'))
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />
                <DescriptionTextInput description={'Observação:'} erroMenssage={''} />
                <InputStyled
                    value={observacao}
                    placeholder={'observação'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        setObservacao(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                {tipo == 'transporte' ? (
                    <CheckBox
                        checked={descontar}
                        onPressFunction={() => setDescontar(!descontar)}
                        description={'Descontar na fatura?'}
                    />
                ) : (
                    <></>
                )}
                {!isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={_handlerSave} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
