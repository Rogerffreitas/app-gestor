import React from 'react'
import { View } from 'react-native'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import { InputStyled } from '../../../../components/input/InputStyled'
import useNewFuelSupply from './UseNewFuelSupply'
import { FuelSupplyTypes } from '../../../../types'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'

export default function NewFuelSupply() {
    const { states, erros, type, actions } = useNewFuelSupply()

    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Abastecimento">
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputStyled
                    value={states.description}
                    placeholder={'Descrição'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('description')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '47%', marginRight: 20 }}>
                        <DescriptionTextInput description={'Quantidade:* '} erroMenssage={erros.quantity} />
                        <InputMaskNumber
                            value={states.quantity ? states.quantity / 100 : null}
                            placeholder={'Quantidade'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('quantity')(
                                    +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '47%' }}>
                        <DescriptionTextInput
                            description={'Valor por litro:* '}
                            erroMenssage={erros.valuePerLiter}
                        />
                        <InputMaskMoney
                            value={states.valuePerLiter ? states.valuePerLiter / 100 : null}
                            placeholder={'Valor por litro'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('valuePerLiter')(
                                    +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                {type != FuelSupplyTypes.MAINTENANCE_TRUCK_TANK && (
                    <>
                        <DescriptionTextInput
                            description={type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
                            erroMenssage={erros.hourMeterOrOdometer}
                        />

                        <InputMaskNumber2
                            value={states.hourMeterOrOdometer ? states.hourMeterOrOdometer / 10 : null}
                            placeholder={type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('hourMeterOrOdometer')(
                                    +value.replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </>
                )}
                <DescriptionTextInput description={'Observação:'} erroMenssage={''} />
                <InputStyled
                    value={states.observation}
                    placeholder={'observação'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('observation')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                {type === FuelSupplyTypes.TRANSPORT_VEHICLE ? (
                    <CheckBox
                        checked={states.isDiscount}
                        onPressFunction={() =>
                            actions.setStates((state) => ({ ...state, isDiscount: !state.isDiscount }))
                        }
                        description={'Descontar na fatura?'}
                    />
                ) : (
                    <></>
                )}
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
