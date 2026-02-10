import React from 'react'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import useNewDeposit from './UseNewDeposit'

export default function NewDeposit({ navigation, route }) {
    const { depositServices } = route.params
    const { erros, states, handleSubmitButton, onChange } = useNewDeposit({
        navigation,
        depositServices,
    })
    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Nova Jazida">
                <DescriptionTextInput description={'Nome do Jazida:* '} erroMenssage={erros.name} />
                <InputComponent
                    placeholder={'Nome do Jazida'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        onChange('name')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputComponent
                    placeholder={'Descrição'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        onChange('description')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={false}
                />
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
