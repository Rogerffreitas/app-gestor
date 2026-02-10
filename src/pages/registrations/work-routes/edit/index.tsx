import React from 'react'
import Container from '../../../../components/Container'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import { InputStyled } from '../../../../components/input/InputStyled'
import { Text, View, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import InputMaskMoney from '../../../../components/input/InputMaskMoney'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoneyPrecision3 from '../../../../components/input/InputMaskMoneyPrecision3'
import InputMask from '../../../../components/input/InputMask'
import useEditRoute from './UseEditRoute'
import { useConfig } from '../../../../contexts/ConfigContext'

export default function App({ navigation, route }) {
    const { workRoutesServices, work, workRoute } = route.params
    const { states, erros, handlerClickEditButton, showConfirmDialog, onChange } = useEditRoute({
        navigation,
        workRoute,
        work,
        workRoutesServices,
    })
    const { config } = useConfig()
    return (
        <Container>
            <FormComponent nomeForm={workRoute.server_id ? 'Código: ' + workRoute.server_id : 'Editar rota'}>
                {!config.workRoutes.includes(workRoute.arrivalLocation) ? (
                    <View style={{ width: '100%' }}>
                        <DescriptionTextInput
                            description={'Local de Origem:* '}
                            erroMenssage={erros.arrivalLocation}
                        />
                        <Text style={styles.textSaida}>{workRoute.arrivalLocation}</Text>

                        <DescriptionTextInput
                            description={'Local de Destino:* '}
                            erroMenssage={erros.departureLocation}
                        />
                        <InputStyled
                            value={states.departureLocation}
                            placeholder={'Local de Destino'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                onChange('departureLocation')(value)
                            }}
                            autoFocus={true}
                            keyboardType={'default'}
                        />

                        {erros.km ? (
                            <View style={{ width: '100%' }}>
                                <ContentError>
                                    <TextError>{erros.km}</TextError>
                                </ContentError>
                            </View>
                        ) : (
                            <></>
                        )}

                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ width: '47%' }}>
                                <DescriptionTextInput
                                    description={'Distância em Km:* '}
                                    erroMenssage={erros.km}
                                />

                                <InputMaskNumber
                                    value={workRoute.km / 100}
                                    placeholder={'Distância em KM'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    secureTextEntry={false}
                                    onChangeTextFunction={(value) => {
                                        onChange('km')(
                                            value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                        )
                                    }}
                                    autoFocus={false}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={{ width: '47%' }}>
                                <DescriptionTextInput
                                    description={'Estaca de destino:* '}
                                    erroMenssage={erros.initialPicket}
                                />

                                <InputMask
                                    value={workRoute.initialPicket}
                                    type={'only-numbers'}
                                    mask={'defaults'}
                                    placeholder={'Estaca de destino:'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    secureTextEntry={false}
                                    onChangeTextFunction={(value) => {
                                        onChange('initialPicket')(value)
                                    }}
                                    autoFocus={false}
                                    keyboardType={'numeric'}
                                />
                            </View>
                        </View>

                        <DescriptionTextInput description={'Valor:* '} erroMenssage={erros.value} />
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '60%' }}>
                                <InputMaskMoneyPrecision3
                                    value={workRoute.value / 1000}
                                    placeholder={'Valor'}
                                    autoCapitalize={'none'}
                                    autoCorrect={false}
                                    secureTextEntry={false}
                                    onChangeTextFunction={(value) => {
                                        onChange('value')(
                                            value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                        )
                                    }}
                                    autoFocus={false}
                                    keyboardType={'numeric'}
                                />
                            </View>
                            <View style={{ width: '30%', marginLeft: 10 }}>
                                <CheckBox
                                    checked={states.isFixedValue}
                                    onPressFunction={() => onChange('isFixedValue')(!states.isFixedValue)}
                                    description={'Valor fixo?'}
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={{ width: '100%' }}>
                        <View
                            style={{
                                backgroundColor: '#c9c9c9',
                                alignItems: 'center',
                                marginTop: 10,
                                marginBottom: 10,
                                padding: 5,
                                borderRadius: 3,
                                borderColor: '#000',
                                borderWidth: 0.5,
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                                {workRoute.arrivalLocation}
                            </Text>
                        </View>
                        <View>
                            <DescriptionTextInput description={'Valor:* '} erroMenssage={erros.value} />
                            <InputMaskMoney
                                value={states.value / 1000}
                                placeholder={'Valor'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    onChange('value')(
                                        value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                    )
                                }}
                                autoFocus={false}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>
                )}

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar Edição'} onPressFunction={handlerClickEditButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}

                <ViewButton>
                    <ButtonEditar onPress={showConfirmDialog}>
                        <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                    </ButtonEditar>
                </ViewButton>
            </FormComponent>
        </Container>
    )
}

const styles = StyleSheet.create({
    textSaida: {
        paddingTop: 15,
        paddingLeft: 10,
        paddingBottom: 15,
        borderColor: '#00000080',
        borderWidth: 1,
        marginTop: 1,
        borderRadius: 5,
        fontWeight: '600',
        backgroundColor: '#00000010',
    },
})

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

const TextError = styled.Text`
    color: red;
    font-size: 12px;
    font-weight: bold;
`

const ContentError = styled.View`
    width: 95%;
    justify-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`
