import React from 'react'
import Container from '../../../../components/Container'
import ButtonDropApontamento from '../../../../components/button/ButtonDropApontamento'
import { View } from 'react-native'
import InputMaskNumber2 from '../../../../components/input/InputMaskNumber2'
import styled from 'styled-components/native'
import { InputStyled } from '../../../../components/input/InputStyled'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMask from '../../../../components/input/InputMask'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import useEditHourMeterMonitoring from './UseEditHourMeterMonitoring'

export default function EditHourMeterMonitoring() {
    const { states, erros, work, actions } = useEditHourMeterMonitoring()
    return (
        <Container>
            <ButtonDropApontamento
                onPress={() => {}}
                numero={'1'}
                titulo={'OBRA:'}
                conteudo={work.name}
                corIcon={'green'}
                nomeIcon={states.iconWork}
                tamanho={15}
            />
            <ButtonDropApontamento
                onPress={() => {}}
                numero={'2'}
                titulo={'EQUIPAMENTO'}
                conteudo={' Modelo: ' + states.modelOrPlate}
                corIcon={'green'}
                nomeIcon={states.iconWork}
                tamanho={15}
            />

            <View
                style={{
                    width: '90%',
                    backgroundColor: '#fff',
                    padding: 20,
                    marginTop: 10,
                    borderRadius: 10,
                }}
            >
                <Content>
                    <TextDescription>Data:*</TextDescription>
                    <TextError>{erros.date}</TextError>
                </Content>
                <InputMask
                    value={states.date}
                    type={'custom'}
                    mask={'99/99/9999'}
                    placeholder={'Data'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        actions.onChange('date')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'numeric'}
                />
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        style={{
                            width: '47%',
                        }}
                    >
                        <Content>
                            <TextDescription>
                                {states.isEquipment ? 'H. Inicial:*' : 'Km Inicial:* '}
                            </TextDescription>
                            <TextError>{erros.start}</TextError>
                        </Content>
                        <InputMaskNumber2
                            value={states.start ? states.start / 10 : null}
                            placeholder={'Inicial:'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('start')(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={true}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View
                        style={{
                            width: '47%',
                        }}
                    >
                        <Content>
                            <TextDescription>
                                {states.isEquipment ? 'H. Final:*' : 'Km Final:*'}
                            </TextDescription>
                            <TextError>{erros.final}</TextError>
                        </Content>
                        <InputMaskNumber2
                            value={states.final ? states.final / 10 : null}
                            placeholder={'Final:'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                actions.onChange('final')(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={true}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <Content>
                    <TextDescription>Observação:</TextDescription>
                    <TextError>{erros.observation}</TextError>
                </Content>
                <InputStyled
                    value={states.observation}
                    placeholder={'Observação'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        actions.onChange('observation')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}

                <ViewButton>
                    <ButtonEditar onPress={() => actions.showConfirmDialog()}>
                        <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                    </ButtonEditar>
                </ViewButton>
            </View>
        </Container>
    )
}

const TextDescription = styled.Text`
    color: #000;
    font-size: 17px;
    font-weight: bold;
    margin-right: 10px;
`

const TextError = styled.Text`
    color: red;
    font-size: 10px;
    font-weight: bold;
`

const Content = styled.View`
    width: 95%;
    justify-items: flex-start;
    flex-direction: row;
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

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
