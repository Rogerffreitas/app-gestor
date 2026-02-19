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
import useNewFuelSupply from './useNewFuelSupply'
import { FuelSupplyTypes } from '../../../../types'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'

export default function NewFuelSupply({ navigation, route }) {
    const { fuelSupplyServices, workId, transportVehicleOrWorkEquipmentId, type } = route.params
    const { states, erros, setStates, onChange, handleSubmitButton } = useNewFuelSupply({
        navigation,
        workId,
        transportVehicleOrWorkEquipmentId,
        fuelSupplyServices,
        type,
    })

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
                        onChange('description')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '47%', marginRight: 20 }}>
                        <DescriptionTextInput description={'Quantidade: '} erroMenssage={erros.quantity} />
                        <InputMaskNumber
                            value={states.quantity ? states.quantity / 100 : null}
                            placeholder={'Quantidade'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('quantity')(
                                    +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '47%' }}>
                        <DescriptionTextInput
                            description={'Valor por litro: '}
                            erroMenssage={erros.valuePerLiter}
                        />
                        <InputMaskMoney
                            value={states.valuePerLiter ? states.valuePerLiter / 100 : null}
                            placeholder={'Valor por litro'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('valuePerLiter')(
                                    +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <DescriptionTextInput
                    description={type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
                    erroMenssage={erros.hourMeterOrKmMeter}
                />
                <InputMaskNumber2
                    value={states.hourMeterOrKmMeter ? states.hourMeterOrKmMeter / 10 : null}
                    placeholder={type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        onChange('hourMeterOrKmMeter')(+value.replace(/\./g, '').replace(',', ''))
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />
                <DescriptionTextInput description={'Observação:'} erroMenssage={''} />
                <InputStyled
                    value={states.observation}
                    placeholder={'observação'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('observation')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                {type === FuelSupplyTypes.TRANSPORT_VEHICLE ? (
                    <CheckBox
                        checked={states.isDiscount}
                        onPressFunction={() =>
                            setStates((state) => ({ ...state, isDiscount: !state.isDiscount }))
                        }
                        description={'Descontar na fatura?'}
                    />
                ) : (
                    <></>
                )}
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
