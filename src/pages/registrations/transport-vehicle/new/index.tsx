import React from 'react'
import { View } from 'react-native'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMask from '../../../../components/input/InputMask'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import { InputStyled } from '../../../../components/input/InputStyled'
import useNewTransportVehicle from './UseNewTransportVehicle'

export default function NewTransportVehicle({ navigation, route }) {
    const { work, transportVehicleServices } = route.params
    const { states, errors, handleClickSubmitButton, onChange } = useNewTransportVehicle({
        navigation,
        transportVehicleServices,
        work,
    })

    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Nova Caçamba">
                <DescriptionTextInput description={'Proprietário:* '} erroMenssage={errors.proprietaryName} />
                <InputComponent
                    placeholder={'Proprietário'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        onChange('proprietaryName')(value)
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
                                onChange('cpfCnpj')(value)
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
                                onChange('tel')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '65%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Motorista:* '} erroMenssage={errors.motorist} />
                        <InputComponent
                            placeholder={'Motorista'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('motorist')(value)
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
                            placeholder={'Placa'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('plate')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '48%', marginRight: 13 }}>
                        <DescriptionTextInput description={'Cor:* '} erroMenssage={errors.color} />
                        <InputComponent
                            placeholder={'Cor'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('color')(value)
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
                            placeholder={'Capacidade em M³'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('capacity')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handleClickSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
