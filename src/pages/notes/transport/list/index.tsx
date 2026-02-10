import React from 'react'
import { TouchableOpacity, FlatList, StyleSheet, View, ActivityIndicator } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../../components/Container'
import theme from '../../../../global/styles/theme'
import {
    Card,
    CardContent,
    SubTextTitulo,
    TextDescricao,
    TextLabel,
    TextTitulo,
    ViewLeft,
    ViewRight,
    ViewTitle,
} from '../../../../components/List/FlatListItemApontamento'
import formatarData from '../../../../services/formatarData'
import Content from '../../../../components/Content'
import ListaVazia from '../../../../components/List/ListaVazia'
import SyncButton from '../../../../components/SyncButton'
import useTransportsList from './UseTransportsList'
import { UserRoles } from '../../../../types'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'

export default function ApontamentosLista({ navigation, route }) {
    const { work, transportVehicle, materialTransportServices, workRoutesServices, materialServices } =
        route.params
    const { workRoutes, user, isLoadingList, materialTransports, handlerClickNewButton } = useTransportsList({
        transportVehicle,
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

    if (transportVehicle && materialTransports.length == 0) {
        return (
            <Container>
                <Content>
                    <View style={{ justifyContent: 'flex-start', flex: 1, width: '95%' }}>
                        <ListaVazia />
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handlerClickNewButton}
                        style={styles.touchableOpacityStyle}
                    >
                        <FontAwesome name="plus" size={20} color={'#fff'} />
                    </TouchableOpacity>
                </Content>
            </Container>
        )
    }

    if (transportVehicle && materialTransports.length > 0) {
        return (
            <Container>
                <Content>
                    <FlatList
                        style={{ width: '100%' }}
                        data={materialTransports}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        renderItem={({ item }) => {
                            return (
                                <View style={{ flex: 1 }}>
                                    <Card onPress={() => console.log(item)}>
                                        <ViewTitle>
                                            <View style={{ width: '80%' }}>
                                                <TextTitulo>
                                                    PLACA: {item.transportVehicleDto.plate}
                                                </TextTitulo>
                                                <SubTextTitulo>ID: {item.id}</SubTextTitulo>
                                            </View>

                                            <View
                                                style={{
                                                    width: '28%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <SyncButton item={item} model={'transporte'} />
                                            </View>
                                        </ViewTitle>
                                        <CardContent>
                                            <ViewLeft>
                                                <TextLabel>Local de origem: </TextLabel>
                                                <TextDescricao>
                                                    {item.workRoutesDto.arrivalLocation}
                                                </TextDescricao>
                                                <TextLabel>Local de destino: </TextLabel>
                                                <TextDescricao>
                                                    {item.workRoutesDto.departureLocation}
                                                </TextDescricao>
                                                <TextLabel>Estaca: </TextLabel>
                                                <TextDescricao>{item.deliveryPicket}</TextDescricao>
                                                <TextLabel>Material: </TextLabel>
                                                <TextDescricao>{item.materialDto.name}</TextDescricao>
                                                <TextLabel>Quantidade: </TextLabel>
                                                <TextDescricao>
                                                    {item.isReferenceCapacity
                                                        ? item.quantity + ' m³'
                                                        : item.quantity / 100 + ' t'}
                                                </TextDescricao>
                                            </ViewLeft>
                                            <ViewRight>
                                                <TextLabel>Data: </TextLabel>
                                                <TextDescricao>{formatarData(item.createdAt)}</TextDescricao>
                                                <TextLabel>Placa: </TextLabel>
                                                <TextDescricao>
                                                    {item.transportVehicleDto.plate}
                                                </TextDescricao>
                                                {workRoutes.includes(item.workRoutesDto.arrivalLocation) ? (
                                                    <View></View>
                                                ) : (
                                                    <View>
                                                        <TextLabel>Distância percorrida: </TextLabel>
                                                        <TextDescricao>
                                                            {(
                                                                (item.workRoutesDto.km +
                                                                    item.distanceTraveledWithinTheWork) /
                                                                100
                                                            ).toLocaleString('pt-br', {
                                                                style: 'decimal',
                                                                maximumFractionDigits: 2,
                                                            })}{' '}
                                                            km
                                                        </TextDescricao>
                                                    </View>
                                                )}
                                                {user.role === UserRoles.ADMIN ? (
                                                    <View>
                                                        <TextLabel>Valor: </TextLabel>
                                                        <TextDescricao>
                                                            {(item.value / 100).toLocaleString('pt-BR', {
                                                                style: 'currency',
                                                                currency: 'BRL',
                                                            })}
                                                        </TextDescricao>
                                                    </View>
                                                ) : null}
                                            </ViewRight>
                                        </CardContent>
                                        {item.observation.length > 0 ? (
                                            <View style={styles.viewObs}>
                                                <TextLabel>Observação: </TextLabel>
                                                <TextDescricao>{item.observation}</TextDescricao>
                                            </View>
                                        ) : (
                                            <></>
                                        )}
                                    </Card>
                                </View>
                            )
                        }}
                    />
                </Content>
                <ButtonNewRegister onPressFunction={handlerClickNewButton} activeOpacity={0.7} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.btplus,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'absolute',
        right: 20,
        bottom: 20,
    },

    viewObs: {
        width: '100%',
        flexDirection: 'column',
    },
})
