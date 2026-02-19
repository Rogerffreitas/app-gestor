import React from 'react'
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native'
import Container from '../../../components/Container'
import Content from '../../../components/Content'
import ListaVazia from '../../../components/List/ListaVazia'
import CardLine from '../../../components/cardLine/CardLine'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import Linha from '../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ViewTituloCardLine from '../../../components/cardLine/ViewTituloCardLine'
import ObraSelected from '../../../components/List/ObraSelected'
import useTransport from './UseTransport'

export default function TransportNote({ navigation, route }) {
    const {
        work,
        transportVehicleServices,
        materialTransportServices,
        workRoutesServices,
        materialServices,
    } = route.params
    const { transportVehicles, isLoadingList, handleClickItemTransportVehicle, saveWork } = useTransport({
        transportVehicleServices,
        materialTransportServices,
        workRoutesServices,
        materialServices,
        navigation,
        work,
    })

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (work && transportVehicles.length == 0) {
        return (
            <Container>
                <Content>
                    <View style={{ justifyContent: 'flex-start', flex: 1, width: '95%' }}>
                        <ObraSelected
                            active={1}
                            onPress={() => {
                                saveWork(null)
                                navigation.goBack()
                            }}
                            titulo={work.name}
                            descricao={work.description}
                        />
                        <ListaVazia />
                    </View>
                </Content>
            </Container>
        )
    }

    if (work && transportVehicles.length > 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            saveWork(null)
                            navigation.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />

                    <View
                        style={{
                            width: '100%',
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <FlatList
                            style={{
                                width: '90%',
                            }}
                            data={transportVehicles}
                            keyExtractor={(item) => {
                                return item.id
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <CardLine
                                        onPress={() => {
                                            handleClickItemTransportVehicle(item)
                                        }}
                                        opacity={0.7}
                                    >
                                        <ViewTituloCardLine titulo={item.nameProprietary} />
                                        <Linha></Linha>
                                        <CardLineContent>
                                            <CardLineContentLeft>
                                                <TextTituloCardLine conteudo={'Placa:'} />
                                                <TextTituloCardLine conteudo={'Cor:'} />
                                                <TextTituloCardLine conteudo={'Motorista:'} />
                                                <TextTituloCardLine conteudo={'Capacidade:'} />
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine conteudo={item.plate} />
                                                <TextConteudoCardLine conteudo={item.color} />
                                                <TextConteudoCardLine conteudo={item.motorist} />
                                                <TextConteudoCardLine conteudo={item.capacity + ' m³'} />
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                )
                            }}
                        />
                    </View>
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <ListaVazia />
            </Content>
        </Container>
    )
}
