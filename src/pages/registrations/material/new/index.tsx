import React from 'react'
import { View, StyleSheet } from 'react-native'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import useNewMaterial from './UseNewMaterial'
import { Reference } from '../../../../types'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'

export default function NewMaterial() {
    const { states, erros, actions } = useNewMaterial()

    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Novo Material">
                <DescriptionTextInput description={'Nome do Material:* '} erroMenssage={erros.name} />
                <InputComponent
                    placeholder={'Nome do Material'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        actions.onChange('name')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />
                <DescriptionTextInput description={'Densidade (t/m³):* '} erroMenssage={erros.density} />

                <InputMaskNumber
                    value={null}
                    placeholder={'Densidade (t/m³)'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        actions.onChange('density')(value.replace(/\./g, '').replace(',', ''))
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />

                <DescriptionTextInput description={'Valor (R$):* '} erroMenssage={erros.value} />
                <InputMaskMoney
                    value={null}
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

                <View style={styles.containerCheckbox}>
                    <View>
                        <CheckBox
                            checked={states.volume}
                            onPressFunction={() => {
                                actions.onChange('volume')(true)
                                actions.onChange('weight')(false)
                                actions.onChange('reference')(Reference.VOLUME)
                            }}
                            description={'Volume (m³)'}
                        />
                    </View>
                    <View>
                        <CheckBox
                            checked={states.weight}
                            onPressFunction={() => {
                                actions.onChange('volume')(false)
                                actions.onChange('weight')(true)
                                actions.onChange('reference')(Reference.WEIGHT)
                            }}
                            description={'Peso (t)'}
                        />
                    </View>
                </View>
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}

const styles = StyleSheet.create({
    containerCheckbox: {
        width: '100%',
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginBottom: 10,
    },
})
