import React from 'react'
import { FlatList, View, ActivityIndicator, Image } from 'react-native'
import styled from 'styled-components/native'
import Container from '../../../../components/Container'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import CardLine from '../../../../components/cardLine/CardLine'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import ListaVazia from '../../../../components/List/ListaVazia'
import Linha from '../../../../components/cardLine/Line'
import SyncButton from '../../../../components/sync-button'
import LottieView from 'lottie-react-native'
import useMaintenanceTruckFuelSupplies from './UseMaintenanceTruckFuelSupplies'
import { FuelSupplyTypes } from '../../../../types'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'
import MenuOptionSelected from '@/src/pages/registrations/financial/components/MenuOptionSelected'
import getDataFormatada from '@/src/services/formatarData'

const ASSETS_MAP = {
    truck: require('../../../../assets/truck2.json'),
    maquina: require('../../../../assets/maquina.png'),
}
export default function MaintenanceTruckFuelSupplies() {
    const { states, animation, actions } = useMaintenanceTruckFuelSupplies()

    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }
    if (!states.fuelType) {
        return (
            <Container>
                <View style={{ width: '100%' }}>
                    <ButtonStyled
                        onPress={() => {
                            actions.loadData(FuelSupplyTypes.TRANSPORT_VEHICLE, 'truck')
                        }}
                    >
                        <ImageStyled>
                            <LottieView
                                autoPlay
                                ref={animation}
                                style={{ width: 90, height: 90 }}
                                source={require('../../../../assets/truck2.json')}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Caçambas</TextContent>
                        </TextContent>
                    </ButtonStyled>
                    <ButtonStyled
                        style={{ backgroundColor: '#000080' }}
                        onPress={() => {
                            actions.loadData(FuelSupplyTypes.EQUIPMENT, 'maquina')
                        }}
                    >
                        <ImageStyled>
                            <Image
                                source={require('../../../../assets/maquina.png')}
                                style={{ height: 35, width: 90 }}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Equipamentos</TextContent>
                        </TextContent>
                    </ButtonStyled>
                </View>
            </Container>
        )
    }
    if (states.maintenanceTruckFuelSupplyList.length > 0) {
        return (
            <Container>
                <MenuOptionSelected
                    label={states.fuelType === FuelSupplyTypes.EQUIPMENT ? 'Equipamentos' : 'Caçambas'}
                    onPress={() => actions.resetType()}
                    source={ASSETS_MAP[states.typeImage]}
                    isLottie={states.fuelType === FuelSupplyTypes.TRANSPORT_VEHICLE}
                />
                <ContentCardList>
                    <FlatList
                        style={{ flex: 1, width: '95%' }}
                        data={states.maintenanceTruckFuelSupplyList}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1 }}>
                                    <CardLine onPress={() => ({})} opacity={1}>
                                        <ViewTituloCardLine titulo={item.modelOrPlate}>
                                            <View
                                                style={{
                                                    width: '10%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <SyncButton item={item} model={'abastecimento'} />
                                            </View>
                                            {index == 0 ? (
                                                <ButtonEditar
                                                    onPress={() => actions.handleClickButtonEdit(item)}
                                                >
                                                    <FontAwesome
                                                        name={'edit'}
                                                        size={20}
                                                        style={{ color: '#fff' }}
                                                    />
                                                </ButtonEditar>
                                            ) : (
                                                <></>
                                            )}
                                        </ViewTituloCardLine>
                                        <Linha />
                                        <CardLineContent>
                                            <CardLineContentLeft>
                                                <TextTituloCardLine conteudo={'Proprietário:'} />
                                                <TextTituloCardLine conteudo={'Motorista:'} />
                                                <TextTituloCardLine conteudo={'Quantidade:'} />
                                                <TextTituloCardLine conteudo={'Data:'} />
                                                <TextTituloCardLine conteudo={'Observação:'} />

                                                {states.fuelType == FuelSupplyTypes.TRANSPORT_VEHICLE && (
                                                    <TextTituloCardLine conteudo={'Descontar? '} />
                                                )}
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine conteudo={item.nameProprietary} />
                                                <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.quantity.toLocaleString('pt-BR', {
                                                            style: 'decimal',
                                                            maximumFractionDigits: 2,
                                                        }) + ' L'
                                                    }
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={getDataFormatada(
                                                        item.fuelSupply.createdAt
                                                    ).substring(0, 10)}
                                                />
                                                <TextConteudoCardLine conteudo={item.observation} />

                                                {states.fuelType == FuelSupplyTypes.TRANSPORT_VEHICLE && (
                                                    <TextConteudoCardLine
                                                        conteudo={item.isDiscount ? 'Sim' : 'Não'}
                                                    />
                                                )}
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                </View>
                            )
                        }}
                    ></FlatList>
                </ContentCardList>
                <ButtonNewRegister activeOpacity={0.7} onPressFunction={actions.handleClickButtonNew} />
            </Container>
        )
    }
    if (states.maintenanceTruckFuelSupplyList.length == 0) {
        return (
            <Container>
                <MenuOptionSelected
                    label={states.fuelType === FuelSupplyTypes.EQUIPMENT ? 'Equipamentos' : 'Caçambas'}
                    onPress={() => actions.resetType()}
                    source={ASSETS_MAP[states.typeImage]}
                    isLottie={states.fuelType === FuelSupplyTypes.TRANSPORT_VEHICLE}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ListaVazia />
                </View>
                <ButtonNewRegister activeOpacity={0.7} onPressFunction={actions.handleClickButtonNew} />
            </Container>
        )
    }
}

const ContentCardList = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
