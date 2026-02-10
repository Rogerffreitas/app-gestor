import React from 'react'
import Container from '../../../../components/Container'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import { Alert, View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import InputMask from '../../../../components/input/InputMask'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import { InputStyled } from '../../../../components/input/InputStyled'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'
import UseEditEquipment from './UseEditEquipment'

export default function EditEquipment({ navigation, route }) {
    const { equipmentServices, equipment } = route.params
    if (equipment == null || equipment == undefined) {
        Alert.alert('Erro', 'Equipamento não encontrado')
        navigation.goBack()
        return
    }
    const { states, erros, onChange, handleEditButton, showConfirmDialog } = UseEditEquipment({
        equipment,
        equipmentServices,
        navigation,
    })

    return (
        <Container>
            <FormComponent
                nomeForm={equipment.serverId ? 'Código: ' + equipment.serverId : 'Editar Equipamento'}
            >
                <DescriptionTextInput description={'Proprietário:* '} erroMenssage={erros.proprietatyName} />
                <InputStyled
                    value={states.proprietatyName}
                    placeholder={'Proprietário do Equipamento'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('proprietatyName')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Cpf/Cnpj:* '} erroMenssage={erros.cpfCnpj} />
                        <InputStyled
                            value={states.cpfCnpj}
                            placeholder={'Cpf/Cnpj'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
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
                            description={equipment.isEquipment ? 'Operador:* ' : 'Motorista:* '}
                            erroMenssage={erros.operatorMotorist}
                        />
                        <InputStyled
                            value={states.operatorMotorist}
                            placeholder={equipment.isEquipment ? 'Operador' : 'Motorista'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                onChange('operatorMotorist')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput
                            description={equipment.isEquipment ? 'Modelo:* ' : 'Modelo/Placa:* '}
                            erroMenssage={erros.modelOrPlate}
                        />
                        <InputStyled
                            value={states.modelOrPlate}
                            placeholder={equipment.isEquipment ? 'Modelo ' : 'Modelo/Placa'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
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
                            description={equipment.isEquipment ? 'Horimetro:*' : 'Hodômetro:*'}
                            erroMenssage={erros.hourMeterOrOdometer}
                        />
                        <InputMaskNumber2
                            value={states.hourMeterOrOdometer / 10}
                            placeholder={equipment.isEquipment ? 'Horimetro ' : 'Hodômetro '}
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
                                {equipment.isEquipment ? 'Valor por hora:*' : 'Valor por km:*'}{' '}
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
                            value={states.monthlyPayment / 100}
                            placeholder={'Mensalidade'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('monthlyPayment')(
                                    +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '28%', marginRight: 13 }}>
                        <InputMaskMoney
                            value={states.valuePerHourKm / 100}
                            placeholder={equipment.isEquipment ? 'Valor por hora' : 'Valor por km'}
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
                            value={states.valuePerDay / 100}
                            placeholder={'Valor por diária'}
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
                    <ButtonAction acao={'Salvar'} onPressFunction={handleEditButton} />
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
