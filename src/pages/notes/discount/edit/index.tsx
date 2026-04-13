import React from 'react'
import Container from '../../../../components/Container'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import { InputStyled } from '../../../../components/input/InputStyled'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import useEditDiscount from './UseEditDiscount'

export default function EditDiscount() {
    const { states, erros, actions } = useEditDiscount()
    return (
        <Container>
            <FormComponent nomeForm="Editar Desconto">
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputStyled
                    placeholder={'Descrição:'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    value={states.description}
                    onChangeText={(text) => {
                        actions.onChange('description')(text)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />

                <DescriptionTextInput description={'Valor:* '} erroMenssage={erros.value} />
                <InputMaskMoney
                    value={states.value ? states.value / 100 : null}
                    placeholder={'Valor'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        actions.onChange('value')(
                            value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                        )
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar Edição'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}

                <ViewButton>
                    <ButtonEditar onPress={() => actions.showConfirmDialog()}>
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
