import React, { useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import { deleteAbastecimento, update } from '../../../../dao/AbastecimentoDAO'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import { useAuth } from '../../../../contexts/AuthContext'
import { Alert, View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { InputStyled } from '../../../../components/input/InputStyled'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import { errorVibration, successVibration } from '../../../../services/VibrationService'

export default function EditarDesconto({ navigation, route }) {
    const { usuario } = useAuth()
    const [abastecimento, setAbastecimento] = useState(route.params?.abastecimento)
    const [descricao, setDescricao] = useState(route.params?.abastecimento.descricao)
    const [valor, setValor] = useState<number>(route.params?.abastecimento.valor.toFixed(2))
    const [quantidade, setQuantidade] = useState<number>(
        route.params?.abastecimento.quantidade.toFixed(2)
    )
    const [valorPorLitro, setValorPorLitro] = useState<number>(
        route.params?.abastecimento.valor_por_litro.toFixed(2)
    )
    const [tipo, setTipo] = useState<string>(route.params?.abastecimento.tipo)
    const [descontar, setDescontar] = useState(route.params?.abastecimento.descontar)
    const [observacao, setObservacao] = useState(route.params?.abastecimento.observacao)
    const [erroMsgDescricao, setErroMsgDescricao] = useState('')
    const [erroMsgQuantidade, setErroMsgQuantidade] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function _handlerSave() {
        if (usuario.id == null || usuario.empresaId == null) {
            Alert.alert('Error')
            errorVibration()
            navigation.goBack()
        }
        if (validar()) {
            try {
                setIsLoading(true)
                const response = await update(
                    abastecimento.id,
                    valor,
                    quantidade,
                    valorPorLitro,
                    descricao,
                    0,
                    observacao,
                    usuario.id,
                    descontar,
                    true
                )
                Alert.alert('Abastecimento Atualizado')
                navigation.goBack()
                successVibration()
            } catch (err) {
                console.log(err.mesage)
                setIsLoading(false)
            }
        } else {
            errorVibration()
        }
    }

    function validar() {
        let valido = true
        if (descricao == null || descricao.length == 0) {
            setErroMsgDescricao('Preecha o campo obrigatório')
            valido = false
        }

        if (quantidade == null || quantidade == 0) {
            setErroMsgQuantidade('Preencha o campo obrigatório')
            valido = false
        }

        return valido
    }

    async function _deletarAbastecimento() {
        if (abastecimento.fatura_id == 0 || abastecimento.fatura_status == 'cancelada') {
            console.log('ok')
            await deleteAbastecimento(abastecimento.id)
            Alert.alert('Abastecimento apagado')
            navigation.goBack()
        } else {
            Alert.alert('Não é possível apagar o Abastecimento', 'Existe uma fatura em aberto')
        }
    }

    function _showConfirmDialog() {
        return Alert.alert('Deseja apagar o Desconto?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    _deletarAbastecimento()
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    return (
        <Container>
            <FormComponent nomeForm="Editar abastecimento">
                <DescriptionTextInput
                    description={'Descrição:* '}
                    erroMenssage={erroMsgDescricao}
                />
                <InputStyled
                    value={descricao}
                    placeholder={'Descrição:'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        setDescricao(value)
                        setErroMsgDescricao(null)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />
                <DescriptionTextInput description={'Quantidade: '} erroMenssage={''} />
                <InputMaskNumber
                    value={quantidade}
                    placeholder={'Quantidade'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        setQuantidade(value.replace('R$ ', '').replace(/\./g, '').replace(',', '.'))
                        let v =
                            value.replace('R$ ', '').replace(/\./g, '').replace(',', '.') *
                            valorPorLitro
                        setValor(v)
                        setErroMsgQuantidade(null)
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: 13 }}>
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
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Valor Total: '} erroMenssage={''} />
                        <InputMaskMoney
                            value={valor}
                            placeholder={'Valor'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                setValor(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '.')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
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
                        description={'Descontar valor total na fatura?'}
                    />
                ) : (
                    <></>
                )}

                {!isLoading ? (
                    <ButtonAction acao={'Salvar Edição'} onPressFunction={_handlerSave} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}

                <ViewButton>
                    <ButtonEditar onPress={() => _showConfirmDialog()}>
                        <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                    </ButtonEditar>
                </ViewButton>
            </FormComponent>
        </Container>
    )
}

const ViewButton = styled.View`
    width: 100%;
    border-radius: 5px;
    background-color: red;
    flex-direction: row;
    padding: 7px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
