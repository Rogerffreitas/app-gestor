import Container from '../../../components/Container'
import LottieView from 'lottie-react-native'
import styled from 'styled-components/native'
import { ActivityIndicator, FlatList, View, Image } from 'react-native'
import useFinancial from './UseFinancial'
import ListaVazia from '../../../components/List/ListaVazia'
import ItemObra from '../../../components/List/ItemObra'
import ObraSelected from '../../../components/List/ObraSelected'
import React, { useCallback } from 'react'
import CardLine from '../../../components/cardLine/CardLine'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ViewTituloCardLine from '../../../components/cardLine/ViewTituloCardLine'
import Line from '../../../components/cardLine/Line'
import MenuOption from './components/MenuOption'
import MenuOptionSelected from './components/MenuOptionSelected'

const ASSETS_MAP = {
    fatura: require('../../../assets/fatura.json'),
    faturas: require('../../../assets/faturas.json'),
    truck: require('../../../assets/truck2.json'),
    maquina: require('../../../assets/maquina.png'),
}

export default function Financial() {
    const { animation, isConnected, actions, states, work } = useFinancial()

    const renderTransportOrEquipmentItem = useCallback(
        ({ item }) => {
            if (states.type === 'Equipamentos') {
                return (
                    <CardLine
                        onPress={() => {
                            actions.handleClickItemWorkEquipment(item)
                        }}
                        opacity={0.7}
                    >
                        <ViewTituloCardLine titulo={item.equipment.modelOrPlate} />
                        <Line />
                        <CardLineContent>
                            <CardLineContentLeft>
                                <TextTituloCardLine conteudo="Proprietário:" />
                                <TextTituloCardLine conteudo="Operador:" />
                            </CardLineContentLeft>
                            <CardLineContentRight>
                                <TextConteudoCardLine conteudo={item.equipment.nameProprietary} />
                                <TextConteudoCardLine conteudo={item.equipment.operatorMotorist} />
                            </CardLineContentRight>
                        </CardLineContent>
                    </CardLine>
                )
            }

            return (
                <CardLine
                    onPress={() => {
                        actions.handleClickItemTransportVehicle(item)
                    }}
                    opacity={0.7}
                >
                    <ViewTituloCardLine titulo={`${item.nameProprietary} - ${item.plate}`} />
                    <Line />
                    <CardLineContent>
                        <CardLineContentLeft>
                            <TextTituloCardLine conteudo="Placa:" />
                            <TextTituloCardLine conteudo="Cor:" />
                            <TextTituloCardLine conteudo="Capacidade:" />
                        </CardLineContentLeft>
                        <CardLineContentRight>
                            <TextConteudoCardLine conteudo={item.plate} />
                            <TextConteudoCardLine conteudo={item.color} />
                            <TextConteudoCardLine conteudo={`${item.capacity} m³`} />
                        </CardLineContentRight>
                    </CardLineContent>
                </CardLine>
            )
        },
        [states.type]
    )

    if (!isConnected) {
        return (
            <Container>
                <Content>
                    <Card>
                        <CardContent>
                            <View style={{ height: '70%', justifyContent: 'center' }}>
                                <LottieView
                                    autoPlay
                                    ref={animation}
                                    style={{ width: 100, height: 100 }}
                                    source={require('../../../assets/wifioff.json')}
                                />
                            </View>
                            <View style={{ height: '30%', justifyContent: 'center' }}>
                                <TextContent>
                                    <TextInfo>VOCÊ ESTÁ OFFLINE</TextInfo>
                                </TextContent>
                            </View>
                        </CardContent>
                    </Card>
                </Content>
            </Container>
        )
    }

    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (!work) {
        return (
            <Container>
                <FlatList
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    data={states.works}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <ItemObra
                                active={0.2}
                                onPress={() => {
                                    actions.handleSelectWork(item)
                                }}
                                titulo={item.name}
                                descricao={item.description}
                            />
                        )
                    }}
                />
            </Container>
        )
    }

    if (work && !states.screenType && !states.type) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            actions.resetWork()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <MenuOption
                        label="Gerar Fatura"
                        onPress={() => actions.setScreenType('Gerar fatura', 'fatura')}
                        source={require('../../../assets/fatura.json')}
                        isLottie={true}
                        bgColor="#000080"
                    />

                    <MenuOption
                        label="Gerenciar Faturas"
                        onPress={() => actions.setScreenType('Gerenciar faturas', 'faturas')}
                        source={require('../../../assets/faturas.json')}
                        isLottie={true}
                        lottieSize={60}
                        bgColor="#000080"
                    />
                </Content>
            </Container>
        )
    }

    if (work && states.screenType && !states.type) {
        return (
            <Container>
                <Content>
                    <MenuOptionSelected
                        label={states.screenType}
                        onPress={() => actions.setScreenType(null, null)}
                        source={ASSETS_MAP[states.screenImage]}
                        isLottie={true}
                        lottieSize={states.screenType === 'Gerar fatura' ? 80 : 60}
                    />

                    <MenuOption
                        label="Caçambas"
                        onPress={() => actions.handleSelectedType('Caçambas', 'truck')}
                        source={require('../../../assets/truck2.json')}
                        isLottie={true}
                        bgColor="#000080"
                    />

                    <MenuOption
                        label="Equipamentos"
                        onPress={() => actions.handleSelectedType('Equipamentos', 'maquina')}
                        source={require('../../../assets/maquina.png')}
                        isLottie={false}
                        bgColor="#000080"
                    />
                </Content>
            </Container>
        )
    }

    if (work && states.screenType && states.type && states.dataList.length == 0) {
        return (
            <Container>
                <Content style={{ justifyContent: 'flex-start' }}>
                    <MenuOptionSelected
                        label={states.type}
                        onPress={() => actions.resetType()}
                        source={ASSETS_MAP[states.typeImage]}
                        isLottie={states.type === 'Caçambas'}
                    />
                    {states.isLoadingDataLista ? (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#666" />
                        </View>
                    ) : (
                        <ListaVazia />
                    )}
                </Content>
            </Container>
        )
    }

    if (work && states.screenType && states.type && states.dataList.length > 0)
        return (
            <Container>
                <MenuOptionSelected
                    label={states.type}
                    onPress={() => actions.resetType()}
                    source={ASSETS_MAP[states.typeImage]}
                    isLottie={states.type === 'Caçambas'}
                />
                {states.isLoadingDataLista ? (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#666" />
                    </View>
                ) : (
                    <FlatList
                        style={{ width: '90%' }}
                        data={states.dataList}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransportOrEquipmentItem}
                    />
                )}
            </Container>
        )

    return (
        <Container>
            <Content>
                <ListaVazia />
            </Content>
        </Container>
    )
}

const Card = styled.View`
    align-items: center;
    flex: 1;
    justify-content: center;
    justify-items: center;
`
const CardContent = styled.View`
    align-items: center;
    background-color: #f91;
    width: 250px;
    height: 250px;
    border-radius: 10px;
    border: 10px;
    border-color: #000;
`

const TextContent = styled.Text`
    font-size: 30px;
    flex: 1;
    align-self: center;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
`

const TextInfo = styled.Text`
    font-size: 20px;
    align-self: center;
    color: #000;
    font-weight: bold;
`
const Content = styled.View`
    width: 100%;
    flex: 1;
    align-content: center;
`
