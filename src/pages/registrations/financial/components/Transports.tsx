import { FlatList, View } from 'react-native'
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
import { useConfig } from '../../../../contexts/ConfigContext'
import MaterialTransportDto from '@domin/entity/material-transport/MaterialTransportDto'
import TransportVehicleDto from '@domin/entity/transport-vehicle/TransportVehicleDto'
import TitleInvoice from './TitleInvoice'
import { InvoiceTypes } from '../../../../types'

type props = {
    transportVehicle: TransportVehicleDto
    materialTransport: MaterialTransportDto[]
    type: InvoiceTypes
    goBack: () => void
}

export default function Transports({ materialTransport, transportVehicle, type, goBack }: props) {
    const { config } = useConfig()
    return (
        <View>
            <TitleInvoice goBack={goBack} item={transportVehicle} type={type} />

            <FlatList
                style={{ width: '100%', marginTop: 5 }}
                data={materialTransport}
                keyExtractor={(item) => {
                    return item.id
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Card onPress={() => goBack}>
                                <ViewTitle>
                                    <View style={{ width: '80%' }}>
                                        <TextTitulo>PLACA: {item.transportVehicle.plate}</TextTitulo>
                                        <SubTextTitulo>ID: {item.id}</SubTextTitulo>
                                    </View>

                                    <View
                                        style={{
                                            width: '28%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    ></View>
                                </ViewTitle>
                                <CardContent>
                                    <ViewLeft>
                                        <TextLabel>Local de origem: </TextLabel>
                                        <TextDescricao>{item.workRoutes.arrivalLocation}</TextDescricao>
                                        <TextLabel>Local de destino: </TextLabel>
                                        <TextDescricao>{item.workRoutes.departureLocation}</TextDescricao>
                                        <TextLabel>Estaca: </TextLabel>
                                        <TextDescricao>{item.deliveryPicket}</TextDescricao>
                                        <TextLabel>Material: </TextLabel>
                                        <TextDescricao>{item.material.name}</TextDescricao>
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
                                        <TextDescricao>{item.transportVehicle.plate}</TextDescricao>
                                        {config.workRoutes.includes(item.workRoutes.arrivalLocation) ? (
                                            <View></View>
                                        ) : (
                                            <View>
                                                <TextLabel>Distância percorrida: </TextLabel>
                                                <TextDescricao>
                                                    {(
                                                        (item.workRoutes.km +
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

                                        <View>
                                            <TextLabel>Valor: </TextLabel>
                                            <TextDescricao>
                                                {(item.value / 100).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            </TextDescricao>
                                        </View>
                                    </ViewRight>
                                </CardContent>
                                {item.observation.length > 0 ? (
                                    <View style={{ width: '100%', flexDirection: 'column' }}>
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
        </View>
    )
}
