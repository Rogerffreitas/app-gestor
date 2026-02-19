import React from 'react'
import Container from '../../../../components/Container'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import { View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { InputStyled } from '../../../../components/input/InputStyled'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import useEditFuelSupply from './useEditFuelSupply'
import { FuelSupplyTypes } from '../../../../types'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'

export default function EditFuelSupply({ navigation, route }) {
    const { fuelSupplyServices, fuelSupply } = route.params
    const { states, erros, setStates, onChange, handleEditButton, showConfirmDialog } = useEditFuelSupply({
        fuelSupplyServices,
        fuelSupply,
        navigation,
    })

    return (
        <Container>
            <FormComponent nomeForm="Editar abastecimento">
                <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
                <InputStyled
                    value={states.description}
                    placeholder={'Descrição:'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('description')(value)
                    }}
                    autoFocus={true}
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
                    description={states.type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
                    erroMenssage={erros.hourMeterOrKmMeter}
                />
                <InputMaskNumber2
                    value={states.hourMeterOrKmMeter ? states.hourMeterOrKmMeter / 10 : null}
                    placeholder={states.type === FuelSupplyTypes.EQUIPMENT ? 'Horímetro' : 'Odômetro'}
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
                {states.type == FuelSupplyTypes.TRANSPORT_VEHICLE ? (
                    <CheckBox
                        checked={states.isDiscount}
                        onPressFunction={() =>
                            setStates((state) => ({ ...state, isDiscount: !state.isDiscount }))
                        }
                        description={'Descontar valor total na fatura?'}
                    />
                ) : (
                    <></>
                )}

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar Edição'} onPressFunction={handleEditButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}

                <ViewButton>
                    <ButtonEditar onPress={() => showConfirmDialog()}>
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
