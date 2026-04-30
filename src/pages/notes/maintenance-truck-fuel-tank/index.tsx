import Container from '../../../components/Container'
import React from 'react'
import { ActivityIndicator, FlatList, View, Image } from 'react-native'
import CardLine from '../../../components/cardLine/CardLine'
import ViewTituloCardLine from '../../../components/cardLine/ViewTituloCardLine'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ListaVazia from '../../../components/List/ListaVazia'
import Linha from '../../../components/cardLine/Line'
import ObraSelected from '../../../components/List/ObraSelected'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import useMaintenanceTruckFuelTank from './UseMaintenanceTruckFuelTank'
import styled from 'styled-components/native'
import { ScreenNames } from '../../../types'

export default function MaintenanceTruckFuelTank() {
    const { isLoadingList, maintenanceTrucks, maintenanceTruck, balance, navigation, actions, work } =
        useMaintenanceTruckFuelTank()

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }
    if (maintenanceTruck) {
        return (
            <Container>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={{ width: '90%' }}>
                        <CardLine
                            onPress={() => {
                                actions.setMaintenanceTruck(null)
                                navigation.setOptions({ title: 'Escolha uma melosa' })
                            }}
                            opacity={0.7}
                        >
                            <ViewTituloCardLineSelected>
                                <TextTitlo>{maintenanceTruck.modelOrPlate}</TextTitlo>
                                <ViewButtonCancel>
                                    <FontAwesome name="close" size={20} color={'#fff'} />
                                </ViewButtonCancel>
                            </ViewTituloCardLineSelected>
                            <Linha />
                            <CardLineContent>
                                <CardLineContentLeft>
                                    <TextTituloCardLine conteudo={'Proprietário:'} />
                                    <TextTituloCardLine conteudo={'Operador:'} />
                                    <TextTituloCardLine conteudo={'Capacidade:'} />
                                </CardLineContentLeft>
                                <CardLineContentRight>
                                    <TextConteudoCardLine conteudo={maintenanceTruck.nameProprietary} />
                                    <TextConteudoCardLine conteudo={maintenanceTruck.operatorMotorist} />
                                    <TextConteudoCardLine
                                        conteudo={`${maintenanceTruck.capacity ? maintenanceTruck.capacity / 100 : 0}L`}
                                    />
                                </CardLineContentRight>
                            </CardLineContent>
                        </CardLine>
                    </View>

                    <View style={{ width: '100%' }}>
                        <ButtonStyled
                            onPress={() => {
                                navigation.navigate(ScreenNames.MAINTENANCE_TRUCK_FUEL_SUPPLIES, {
                                    maintenanceTruck: maintenanceTruck,
                                })
                            }}
                        >
                            <ImageStyled>
                                <Image
                                    source={require('../../../assets/bico.png')}
                                    style={{ height: 35, width: 90 }}
                                />
                            </ImageStyled>
                            <TextContent>
                                <TextContent>Abastecimentos</TextContent>
                            </TextContent>
                        </ButtonStyled>
                        <ButtonStyled
                            style={{ backgroundColor: '#000080' }}
                            onPress={() => {
                                navigation.navigate(ScreenNames.MAINTENANCE_TRUCK_REFUEL_TANK, {
                                    maintenanceTruck: maintenanceTruck,
                                    workId: work.id,
                                })
                            }}
                        >
                            <ImageStyled>
                                <Image
                                    source={require('../../../assets/tanque.png')}
                                    style={{ height: 80, width: 100 }}
                                />
                            </ImageStyled>
                            <TextContent>
                                <TextContent>
                                    {`Tanque ( ${balance ? balance / 100 : 0} / ${maintenanceTruck.capacity ? maintenanceTruck.capacity / 100 : 0}) L`}
                                </TextContent>
                            </TextContent>
                        </ButtonStyled>
                    </View>
                </View>
            </Container>
        )
    }
    if (maintenanceTrucks.length != 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={maintenanceTrucks}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine
                                    onPress={() => {
                                        actions.handleClickItemMaintenanceTruckList(item)
                                    }}
                                    opacity={0.7}
                                >
                                    <ViewTituloCardLine titulo={item.modelOrPlate} />
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Operador:'} />
                                            <TextTituloCardLine conteudo={'Capacidade:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.nameProprietary} />
                                            <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                            <TextConteudoCardLine
                                                conteudo={`${item.capacity ? item.capacity / 100 : 0}L`}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content style={{ justifyContent: 'flex-start' }}>
                <ObraSelected
                    active={1}
                    onPress={() => {
                        navigation.goBack()
                    }}
                    titulo={work.name}
                    descricao={work.description}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ListaVazia />
                </View>
            </Content>
        </Container>
    )
}

const Content = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
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

const TextContent = styled.Text`
    font-size: 30px;
    flex: 1;
    align-self: center;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
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
