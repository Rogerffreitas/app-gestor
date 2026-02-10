import React from 'react'
import { View, Image } from 'react-native'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMask from '../../../../components/input/InputMask'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'
import styled from 'styled-components/native'
import useNewEquipment from './UseNewEquipment'

export default function NewEquipment({ navigation, route }) {
    const { equipmentServices } = route.params
    const { states, erros, handleClickType, onChange, handleSubmitButton, EquipmentOrVehicle } =
        useNewEquipment({
            equipmentServices,
            navigation,
        })
    return (
        <Container>
            {!states.type ? (
                <View style={{ width: '100%' }}>
                    <ButtonStyled
                        style={{ backgroundColor: '#000080' }}
                        onPress={() => handleClickType(EquipmentOrVehicle.EQUIPMENT)}
                    >
                        <ImageStyled>
                            <Image
                                source={require('../../../../assets/retro.png')}
                                style={{ height: 40, width: 75 }}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>CADASTRAR UMA MÁQUINA</TextContent>
                        </TextContent>
                    </ButtonStyled>
                    <ButtonStyled
                        style={{ backgroundColor: '#000080' }}
                        onPress={() => handleClickType(EquipmentOrVehicle.VEHICLE)}
                    >
                        <ImageStyled>
                            <Image
                                source={require('../../../../assets/pickup.png')}
                                style={{ height: 40, width: 100 }}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>CADASTRAR UM VEÍCULO</TextContent>
                        </TextContent>
                    </ButtonStyled>
                </View>
            ) : (
                <FormComponent nomeForm={'Cadastro de ' + states.type}>
                    <DescriptionTextInput
                        description={'Proprietário:* '}
                        erroMenssage={erros.proprietatyName}
                    />
                    <InputComponent
                        placeholder={'Proprietário do Equipamento'}
                        autoCapitalize={'characters'}
                        autoCorrect={false}
                        secureTextEntry={false}
                        onChangeTextFunction={(value: string) => {
                            onChange('proprietatyName')(value)
                        }}
                        autoFocus={false}
                        keyboardType={'default'}
                    />
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '48%', marginRight: 13 }}>
                            <DescriptionTextInput description={'Cpf/Cnpj:* '} erroMenssage={erros.cpfCnpj} />
                            <InputComponent
                                placeholder={'Cpf/Cnpj'}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('cpfCnpj')(value)
                                }}
                                autoFocus={false}
                                keyboardType={'default'}
                            />
                        </View>
                        <View style={{ width: '48%' }}>
                            <DescriptionTextInput description={'Telefone:* '} erroMenssage={erros.tel} />
                            <InputMask
                                value={states.tel}
                                type={'custom'}
                                mask={'(99)99999-9999'}
                                placeholder={'Telefone'}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('tel')(value)
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '48%', marginRight: 13 }}>
                            <DescriptionTextInput
                                description={states.isEquipment ? 'Operador:* ' : 'Motorista:* '}
                                erroMenssage={erros.operatorMotorist}
                            />
                            <InputComponent
                                placeholder={states.isEquipment ? 'Operador ' : 'Motorista '}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('operatorMotorist')(value)
                                }}
                                autoFocus={false}
                                keyboardType={'default'}
                            />
                        </View>

                        <View style={{ width: '48%', marginRight: 13 }}>
                            <DescriptionTextInput
                                description={states.isEquipment ? 'Modelo:* ' : 'Modelo/Placa:* '}
                                erroMenssage={erros.modelOrPlate}
                            />
                            <InputComponent
                                placeholder={states.isEquipment ? 'Modelo:* ' : 'Modelo/Placa:* '}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('modelOrPlate')(value)
                                }}
                                autoFocus={false}
                                keyboardType={'default'}
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '48%', marginRight: 13 }}>
                            <DescriptionTextInput
                                description={'Início do aluguel: '}
                                erroMenssage={erros.startRental}
                            />
                            <InputMask
                                value={states.startRental}
                                type={'custom'}
                                mask={'99/99/9999'}
                                placeholder={'Início do aluguel'}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('startRental')(value)
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={{ width: '48%' }}>
                            <DescriptionTextInput
                                description={states.isEquipment ? 'Horimetro:* ' : 'Hodômetro:* '}
                                erroMenssage={erros.hourMeterOrOdometer}
                            />
                            <InputMaskNumber2
                                value={''}
                                placeholder={states.isEquipment ? 'Horimetro ' : 'Hodômetro '}
                                autoCapitalize={'characters'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('hourMeterOrOdometer')(
                                        +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                    )
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '34%', marginRight: 17 }}>
                            <Content>
                                <TextError>{erros.monthlyPayment}</TextError>
                                <TextDescription>Mensalidade:*</TextDescription>
                            </Content>
                        </View>
                        <View style={{ width: '30%', marginRight: 4 }}>
                            <Content>
                                <TextError>{erros.valuePerHourKm}</TextError>
                                <TextDescription>
                                    {states.isEquipment ? 'Valor por hora:*' : 'Valor por Km:*'}
                                </TextDescription>
                            </Content>
                        </View>
                        <View style={{ width: '34%', marginRight: 1 }}>
                            <Content>
                                <TextError>{erros.valuePerDay}</TextError>
                                <TextDescription>Valor por Diária:* </TextDescription>
                            </Content>
                        </View>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row' }}>
                        <View style={{ width: '34%', marginRight: 13 }}>
                            <InputMaskMoney
                                value={''}
                                placeholder={'Mensalidade'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('monthlyPayment')(
                                        +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                    )
                                    if (states.isEquipment) {
                                        onChange('valuePerHourKm')(
                                            (
                                                value
                                                    .replace('R$ ', '')
                                                    .replace(/\./g, '')
                                                    .replace(',', '.') / 200
                                            )
                                                .toFixed(2)
                                                .replace('.', '')
                                        )

                                        onChange('valuePerDay')(
                                            (
                                                value
                                                    .replace('R$ ', '')
                                                    .replace(/\./g, '')
                                                    .replace(',', '.') / 30
                                            )
                                                .toFixed(2)
                                                .replace('.', '')
                                        )
                                    }
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={{ width: '28%', marginRight: 13 }}>
                            <InputMaskMoney
                                value={states.valuePerHourKm != 0 ? states.valuePerHourKm / 100 : ''}
                                placeholder={'V.por hora'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('valuePerHourKm')(
                                        +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                    )
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View style={{ width: '28%', marginRight: 13 }}>
                            <InputMaskMoney
                                value={states.valuePerDay != 0 ? states.valuePerDay / 100 : ''}
                                placeholder={'V. por Diária'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('valuePerDay')(
                                        +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                    )
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>

                    {!states.isLoading ? (
                        <ButtonAction acao={'Salvar'} onPressFunction={handleSubmitButton} />
                    ) : (
                        <ButtonActionLoading onPressFunction={() => {}} />
                    )}
                </FormComponent>
            )}
        </Container>
    )
}

const TextDescription = styled.Text`
    color: #000;
    font-size: 12px;
    font-weight: bold;
    margin-right: 10px;
`

const TextError = styled.Text`
    color: red;
    font-size: 12px;
    font-weight: bold;
`

const Content = styled.View`
    width: 95%;
    justify-items: flex-start;
    flex-direction: column;
    margin-top: 3px;
`
const TextContent = styled.Text`
    font-size: 20px;
    flex: 1;
    align-self: center;
    margin-top: 10px;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
`

const ButtonStyled = styled.TouchableOpacity`
    height: 120px;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    background-color: ${(props) => props.theme.colors.menu};
    padding: 5px;
    flex-direction: column;
    border-radius: 10px;
`

const ImageStyled = styled.View`
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    align-items: center;
    justify-content: center;
`
