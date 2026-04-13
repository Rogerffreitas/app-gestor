import React from 'react'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import useNewDiscount from './UseNewDiscount'

export default function NewDiscount() {
    const { states, erros, actions } = useNewDiscount()
    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Desconto">
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputComponent
                    placeholder={'Descrição'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        actions.onChange('description')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />
                <DescriptionTextInput description={'Valor:* '} erroMenssage={erros.value} />
                <InputMaskMoney
                    value={states.value}
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
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
