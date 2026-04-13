import React, { useState } from 'react'
import { View, Text, Alert, ActivityIndicator, Platform } from 'react-native'
import { useAuth } from '../../../../contexts/AuthContext'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../../components/Container'
import styled from 'styled-components/native'
import formatarData from '../../../../services/formatarData'
import { InvoiceStatus, RootStackParamList, ScreenNames, UserRoles } from '../../../../types'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { MaterialTransportServices } from '../../../../domin/services/interfaces/MaterialTransportServices'
type TransportDetailsProp = RouteProp<RootStackParamList, ScreenNames.TRANSPORT_DETAILS>

export default function TransportDetails() {
    const materialTransportServices = useInjection<MaterialTransportServices>('MaterialTransportServices')
    const route = useRoute<TransportDetailsProp>()
    const { materialTransport } = route.params
    const navigation = useNavigation()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const html = `
<!DOCTYPE html>
<head>
    <script src="../../../assets/qrcodejs/qrcode.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
    <style>
        @page {
            margin: 0px;
        }

        .title {
            font-size: 10px;
            font-family: Helvetica Neue;
            font-weight: bold;
            color: #fff;
        }

        .subtitle {
            font-size: 7px;
            font-family: Helvetica Neue;
            font-weight: bold;
            color: #fff;
        }

        .label {
            font-size: 10px;
            font-family: Helvetica Neue;
            font-weight: bold;
            color: #000;
            margin: 5px 2px 1px;
            padding: 1px;
        }

        .value {
            font-size: 10px;
            font-family: Helvetica Neue;
            font-weight: bold;
            color: #505153;
            margin: 2px;
            padding: 1px;
        }

        .row {
            display: flex;
        }

        .column {
            flex: 50%;
        }

    </style>
    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
</head>
<body style="width:175px;">
    </form>
    <div style="background-color: #000080;">
        <h1 class="title">
            PLACA: ${materialTransport.transportVehicle.plate}
        </h1>
        <h2 class="subtitle">
            ID: ${materialTransport.id}
            <h2 />
    </div>
    <div class="row">
        <div class="column">
            <p class="label">Decrição</p>
            <p class="value">${materialTransport.transportVehicle.nameProprietary}</p>
            <p class="label">Local de saída</p>
            <p class="value">${materialTransport.workRoutes.arrivalLocation}</p>
            <p class="label">Local de destino</p>
            <p class="value">${materialTransport.workRoutes.departureLocation}</p>
            <p class="label">Estaca</p>
            <p class="value">${materialTransport.deliveryPicket}</p>
            <p class="label">Material</p>
            <p class="value">${materialTransport.material.name}</p>
        </div>
        <div class="column">
            <p class="label">Data</p>
            <p class="value">${formatarData(materialTransport.createdAt)}</p>
            <p class="label">Placa</p>
            <p class="value">${materialTransport.transportVehicle.plate}</p>
            <p class="label">Distância percorrida</p>
            <p class="value">${
                materialTransport.workRoutes.km + materialTransport.distanceTraveledWithinTheWork
            } km</p>
        </div>
    </div>
    <div style="text-align: center; margin-top: 15px">
    <img id='barcode' 
            src="https://api.qrserver.com/v1/create-qr-code/?data=http://164.152.34.165:3333/api/v1/public/apontoamento/${
                materialTransport.id
            }&amp;size=100x100" 
            alt="" 
            title="HELLO" 
            width="100" 
            height="100" />
            </div>
</body>
</html>`

    const _showConfirmDialog = () => {
        return Alert.alert('Deseja apagar o registro?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    setIsLoading(true)
                    try {
                        if (
                            materialTransport.invoiceId == 0 ||
                            materialTransport.invoiceStatus == InvoiceStatus.PENDING
                        ) {
                            materialTransportServices.deleteMaterialTransportInLocalDatabase(
                                materialTransport.id,
                                user.id
                            )
                            Alert.alert('Apontamento apagado')

                            navigation.goBack()
                        } else {
                            Alert.alert('Não é possível apagar o Apontamento', 'Existe uma fatura em aberto')
                            setIsLoading(false)
                        }
                        /**/
                    } catch (err) {
                        console.log(err.message)
                        setIsLoading(false)
                    }
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    return (
        <Container>
            <Card activeOpacity={1}>
                <ViewTitle>
                    <TextTitulo>PLACA: {materialTransport.transportVehicle.plate}</TextTitulo>
                    <SubTextTitulo>ID: {materialTransport.id}</SubTextTitulo>
                </ViewTitle>
                <CardContent>
                    <ViewLeft>
                        <TextLabel>Descrição: </TextLabel>
                        <TextDescricao>{materialTransport.transportVehicle.nameProprietary}</TextDescricao>
                        <TextLabel>Local de saída: </TextLabel>
                        <TextDescricao>{materialTransport.workRoutes.arrivalLocation}</TextDescricao>
                        <TextLabel>Local de destino: </TextLabel>
                        <TextDescricao>{materialTransport.workRoutes.departureLocation}</TextDescricao>
                        <TextLabel>Estaca: </TextLabel>
                        <TextDescricao>{materialTransport.deliveryPicket}</TextDescricao>
                        <TextLabel>Material: </TextLabel>
                        <TextDescricao>{materialTransport.material.name}</TextDescricao>
                    </ViewLeft>
                    <ViewRight>
                        <TextLabel>Data: </TextLabel>
                        <TextDescricao>{formatarData(materialTransport.createdAt)}</TextDescricao>
                        <TextLabel>Placa: </TextLabel>
                        <TextDescricao>{materialTransport.transportVehicle.plate}</TextDescricao>
                        <TextLabel>Distância percorrida: </TextLabel>
                        <TextDescricao>
                            {materialTransport.workRoutes.km
                                ? (
                                      (materialTransport.workRoutes.km +
                                          materialTransport.distanceTraveledWithinTheWork) /
                                      100
                                  ).toLocaleString('pt-br', {
                                      style: 'decimal',
                                      maximumFractionDigits: 2,
                                  }) + ' KM'
                                : ''}
                        </TextDescricao>
                        {user.role === UserRoles.ADMIN ? (
                            <View>
                                <TextLabel>Valor: </TextLabel>
                                <TextDescricao>
                                    {materialTransport.value
                                        ? (materialTransport.value / 100).toLocaleString('pt-BR', {
                                              style: 'currency',
                                              currency: 'BRL',
                                          })
                                        : 0}
                                </TextDescricao>
                            </View>
                        ) : null}
                    </ViewRight>
                </CardContent>
                <ViewButton>
                    {!isLoading ? (
                        <ButtonEditar onPress={() => _showConfirmDialog()}>
                            <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                        </ButtonEditar>
                    ) : (
                        <ButtonEditar onPress={() => {}}>
                            <ActivityIndicator size={'small'} color="#fff" />
                        </ButtonEditar>
                    )}
                </ViewButton>
                <ViewButton style={{ backgroundColor: '#000080' }}>
                    <ButtonEditar onPress={() => {}}>
                        <Text style={{ fontWeight: 'bold', marginRight: 10, color: '#fff' }}>
                            IMPRIMIR COMPROVANTE
                        </Text>
                        <FontAwesome name={'print'} size={20} style={{ color: '#fff' }} />
                    </ButtonEditar>
                </ViewButton>
            </Card>
        </Container>
    )
}

export const Card = styled.TouchableOpacity`
    flex: 1;
    width: 90%;
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
    padding-bottom: 5px;
    flex-direction: column;
    align-items: center;
`
export const CardContent = styled.View`
    flex-direction: row;
`

export const ViewLeft = styled.View`
    flex: 1;
    flex-direction: column;
`
export const ViewRight = styled.View`
    flex: 1;
    flex-direction: column;
`

export const ViewTitle = styled.View`
    width: 100%;
    height: 60px;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.menu};
`
export const TextTitulo = styled.Text`
    width: 100%;
    margin-top: 5px;
    margin-left: 10px;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`

export const SubTextTitulo = styled.Text`
    width: 100%;
    margin-left: 10px;
    font-size: 15px;
    color: #fff;
    font-weight: bold;
`

export const TextDescricao = styled.Text`
    font-size: 15px;
    color: #696969;
    margin-top: 1px;
    margin-left: 10px;
`
export const TextLabel = styled.Text`
    margin-top: 3px;
    margin-left: 10px;
    font-size: 15px;
    font-weight: bold;
`
const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const ViewButton = styled.View`
    width: 80%;
    border-radius: 5px;
    background-color: red;
    flex-direction: row;
    padding: 7px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`
