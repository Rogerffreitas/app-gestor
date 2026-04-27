import Container from '../../../../components/Container'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import Line from '../../../../components/cardLine/Line'
import styled from 'styled-components/native'
import useGenerateInvoice from './ UseGenerateInvoice'
import TitleInvoice from '../components/TitleInvoice'

export default function GenerateInvoice() {
    const { states, type, transportVehicleOrWorkEquipment, actions } = useGenerateInvoice()

    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <View style={{ width: '95%' }}>
                    <TitleInvoice
                        item={transportVehicleOrWorkEquipment}
                        type={type}
                        goBack={actions.goBack}
                    />
                </View>
                <Card onPress={actions.showDataInicial} style={{ backgroundColor: '#fff' }}>
                    <Titulo>Data Inicial</Titulo>
                    <Line />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Data>{states.startDate.toLocaleString()}</Data>
                    </View>
                </Card>
                <Card onPress={actions.showDataFinal} style={{ backgroundColor: '#fff' }}>
                    <Titulo>Data Final</Titulo>
                    <Line />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Data>{states.endDate.toLocaleString()}</Data>
                    </View>
                </Card>
                <CardBotao onPress={actions.loadAll}>
                    <TextoBotao>BUSCAR</TextoBotao>
                </CardBotao>
            </Content>
        </Container>
    )
}

const Titulo = styled.Text`
    width: 100%;
    background-color: ${(props) => props.theme.colors.menu};
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    height: 40px;
    border-radius: 4px;
    text-align: center;
`

const Data = styled.Text`
    width: 100%;
    height: 10px;
    font-size: 20px;
    flex: 1;
    color: #696969;
    font-weight: bold;
`

const Content = styled.View`
    align-items: center;
    flex: 1;
    width: 100%;
`

const Card = styled.Pressable`
    width: 90%;
    height: 80px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    border-radius: 4px;
    background-color: #fff;
    padding: 4px;
`

const CardBotao = styled.TouchableOpacity`
    width: 90%;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    border-radius: 4px;
    background-color: red;
    height: 40px;
`

const TextoBotao = styled.Text`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    border-radius: 4px;
`

const ViewTituloCardLineSelected = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.selected};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
    justify-content: space-between;
`

const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
const ViewButtonCancel = styled.View`
    height: 35px;
    margin: 5px;
    width: 35px;
    margin-right: 10px;
    background-color: red;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border-color: #fff;
    border-width: 2px;
`
