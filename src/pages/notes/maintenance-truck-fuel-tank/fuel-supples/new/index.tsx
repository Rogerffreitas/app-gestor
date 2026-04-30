import React from 'react'
import Container from '../../../../../components/Container'
import styled from 'styled-components/native'
import { ActivityIndicator, FlatList, View } from 'react-native'
import CardLine from '../../../../../components/cardLine/CardLine'
import Linha from '../../../../../components/cardLine/Line'
import ViewTituloCardLine from '../../../../../components/cardLine/ViewTituloCardLine'
import CardLineContent from '../../../../../components/cardLine/CardLineContent'
import TextTituloCardLine from '../../../../../components/cardLine/TextTituloCardLine'
import CardLineContentLeft from '../../../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../../../components/cardLine/TextConteudoCardLine'
import Novo from './_form'
import useNewMaintenanceTruckFuelSupply from './UseNewMaintenanceTruckFuelSupply'
import { FuelSupplyTypes } from '../../../../../types'

export default function NewMaintenanceTruckFuelSupply() {
    const { isLoadingList, dataList, form, erros, isLoading, actions, navigation, type } =
        useNewMaintenanceTruckFuelSupply()

    const renderItem = ({ item }) => {
        if (type === FuelSupplyTypes.EQUIPMENT) {
            return (
                <CardLine
                    onPress={() => {
                        actions.handleClickItemWorkEquipment(item)
                    }}
                    opacity={0.7}
                >
                    <ViewTituloCardLine titulo={item.equipment.modelOrPlate} />
                    <Linha />
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
                <ViewTituloCardLine titulo={item.nameProprietary} />
                <Linha />
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
    }

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (form.isVisible) {
        return (
            <Container>
                <Content>
                    <Novo
                        type={type}
                        form={form}
                        erros={erros}
                        handlerClickButtonSubmit={actions.handleSubmitButton}
                        isLoading={isLoading}
                        onChange={actions.onChange}
                        navigation={navigation}
                    />
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <FlatList
                    style={{ width: '90%' }}
                    data={dataList}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            </Content>
        </Container>
    )
}

const Content = styled.View`
    width: 100%;
    flex: 1;
    align-items: center;
`
