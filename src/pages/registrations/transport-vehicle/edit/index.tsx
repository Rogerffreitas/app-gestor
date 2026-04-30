import React from 'react'
import Container from '../../../../components/Container'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import { View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import InputMask from '../../../../components/input/InputMask'
import { InputStyled } from '../../../../components/input/InputStyled'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import useEditTransportVehicle from './UseEditTransportVehicle'

export default function App() {
    const { states, errors, actions } = useEditTransportVehicle()

    return (
        <Container>
            <FormComponent
                nomeForm={
                    states.transportVehicle ? 'Código: ' + states.transportVehicle.serverId : 'Editar Caçamba'
                }
            >
                <DescriptionTextInput description={'Proprietário:* '} erroMenssage={errors.proprietaryName} />
                <InputStyled
                    value={states.proprietaryName}
                    placeholder={'Proprietário do Veiculo'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('proprietaryName')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />

                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Cpf/Cnpj:* '} erroMenssage={errors.cpfCnpj} />
                        <InputStyled
                            value={states.cpfCnpj}
                            placeholder={'Cpf/Cnpj'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                actions.onChange('cpfCnpj')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                    <View style={{ width: '48%' }}>
                        <DescriptionTextInput description={'Telefone:* '} erroMenssage={errors.tel} />
                        <InputMask
                            value={states.tel}
                            type={'custom'}
                            mask={'(99)99999-9999'}
                            placeholder={'Telefone'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('tel')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>

                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '65%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Motorista:* '} erroMenssage={errors.motorist} />
                        <InputStyled
                            value={states.motorist}
                            placeholder={'Motorista do Veiculo'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                actions.onChange('motorist')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                    <View style={{ width: '30%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Placa:* '} erroMenssage={errors.plate} />
                        <InputMask
                            value={states.plate}
                            type={'custom'}
                            mask={'AAA-9S99'}
                            placeholder={'Placa do Veiculo'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('plate')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Cor:* '} erroMenssage={errors.color} />
                        <InputStyled
                            value={states.color}
                            placeholder={'Cor do Veiculo'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                actions.onChange('color')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Capacidade:* '} erroMenssage={errors.capacity} />

                        <InputMask
                            value={states.capacity}
                            type={'only-numbers'}
                            mask={''}
                            placeholder={'Capacidade do Veiculo em M³'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('capacity')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleClickEditButton} />
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
