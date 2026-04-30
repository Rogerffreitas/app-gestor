import React from 'react'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { InputStyled } from '../../../../components/input/InputStyled'
import useEditDeposit from './UseEditDeposit'

export default function () {
    const { erros, states, actions } = useEditDeposit()

    return (
        <Container>
            <FormComponent nomeForm="Editar Jazida">
                <DescriptionTextInput description={'Nome do Jazida:* '} erroMenssage={erros.name} />
                <InputStyled
                    value={states.name}
                    placeholder={'Nome do Jazida'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('name')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputStyled
                    value={states.description}
                    placeholder={'Descrição'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('description')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
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

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
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
