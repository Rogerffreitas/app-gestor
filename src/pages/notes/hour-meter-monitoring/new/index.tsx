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
import useNewHourMeterMonitoring from './UseNewHourMeterMonitoring'

export default function NewHourMeterMonitoring() {
    const { states, erros, work, workEquipment, actions } = useNewHourMeterMonitoring()
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
                conteudo={workEquipment.equipment.modelOrPlate}
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

                <Content>
                    <TextError>{erros.start}</TextError>
                </Content>
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
                        <TextDescription>
                            {states.isEquipment ? 'H. Inicial:*' : 'Km Inicial:* '}
                        </TextDescription>
                        <InputMaskNumber2
                            value={states.start ? states.start / 10 : null}
                            placeholder={'Horimetro inicial:'}
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
                        <TextDescription>{states.isEquipment ? 'H. Final:*' : 'Km Final:*'}</TextDescription>
                        <InputMaskNumber2
                            value={states.final ? states.final / 10 : null}
                            placeholder={'Horimetro final:'}
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
                    onSubmitEditing={() => actions.handleSubmitButton}
                />
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={actions.handleSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
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
