import React from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import Container from '../../../../../components/Container'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import theme from '../../../../../global/styles/theme'
import formatarData from '../../../../../services/formatarData'
import styled from 'styled-components/native'
import useInvoiceDetails from './UseInvoiceDetails'
import ButtonListItemInvoice from '../../../../../components/button/ButtonListItemInvoice'
import { InvoiceStatus, InvoiceTypes } from '../../../../../types'
import FuelSupply from '../../components/FuelSupply'
import Discount from '../../components/Discount'
import HourMeterMonitoring from '../../components/HourMeterMonitoring'
import HourMeterMonitoringDto from '../../../../../domin/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import WorkEquipmentDto from '../../../../../domin/entity/work-equipment/WorkEquipmentDto'
import Transports from '../../components/Transports'
import TransportVehicleDto from '../../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import MaterialTransportDto from '../../../../../domin/entity/material-transport/MaterialTransportDto'

export default function InvoiceDetails() {
    const { states, actions } = useInvoiceDetails()

    if (states.isLoadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
            </Container>
        )
    }

    const HourMeterMonitoringInvoice = (props) => {
        const { workEquipment } = props

        return (
            <View style={{ width: '95%' }}>
                <TextConteudoDetalhes>
                    {`Valor do aluguel: ${(workEquipment?.monthlyPayment / 100 ?? 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}`}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {workEquipment.equipment.isEquipment ? 'Valor por hora: ' : 'Valor por km: '}
                    {(workEquipment?.equipment?.valuePerHourKm / 100 ?? 0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </TextConteudoDetalhes>

                <TextConteudoDetalhes>
                    {workEquipment.equipment.isEquipment
                        ? `Total de horas: ${states.totalHoursWorked}`
                        : `Total de kms: ${states.totalHoursWorked}`}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {workEquipment.equipment.isEquipment
                        ? `Consumo por hora: ${states.fuelConsumption.toLocaleString('pt-br', {
                              style: 'decimal',
                              maximumFractionDigits: 2,
                          })} L/H`
                        : `Km por litro: 
                          ${states.fuelConsumption.toLocaleString('pt-br', {
                              style: 'decimal',
                              maximumFractionDigits: 2,
                          })} Km/H`}
                </TextConteudoDetalhes>

                <TextConteudoDetalhes>
                    {workEquipment.equipment.isEquipment ? 'Valor Total (Horas) ' : 'Valor Total (Kms) '}
                    {states.totalInvoice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {'Valor total de Descontos: '}
                    {states.totalDiscounts.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {`Valor da Fatura: ${states.totalPayable.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}`}
                </TextConteudoDetalhes>
            </View>
        )
    }

    const Transport = () => {
        return (
            <View style={{ width: '95%' }}>
                <TextConteudoDetalhes>
                    {`Total: ${states.totalInvoice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}`}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {`Valor total de Descontos: ${states.totalDiscounts.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}`}
                </TextConteudoDetalhes>
                <TextConteudoDetalhes>
                    {`Valor da Fatura: ${states.totalPayable.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}`}
                </TextConteudoDetalhes>
            </View>
        )
    }

    if (states.screenType === 'transport') {
        return (
            <Container>
                <View style={{ width: '95%' }}>
                    <Transports
                        transportVehicle={
                            states.invoice.transportVehicleOrWorkEquipment as TransportVehicleDto
                        }
                        materialTransport={states.invoice.dataList as MaterialTransportDto[]}
                        type={states.invoice.invoiceType as InvoiceTypes}
                        goBack={() => actions.viewType(null)}
                    />
                </View>
            </Container>
        )
    }

    if (states.screenType === 'hourMeter') {
        return (
            <Container>
                <View style={{ width: '95%' }}>
                    <HourMeterMonitoring
                        workEquipment={states.invoice.transportVehicleOrWorkEquipment as WorkEquipmentDto}
                        hourMeterMonitoring={states.invoice.dataList as HourMeterMonitoringDto[]}
                        type={states.invoice.invoiceType as InvoiceTypes}
                        goBack={() => actions.viewType(null)}
                    />
                </View>
            </Container>
        )
    }

    if (states.screenType === 'discount') {
        return (
            <Container>
                <View style={{ width: '95%' }}>
                    <Discount
                        item={states.invoice.transportVehicleOrWorkEquipment}
                        discounts={states.invoice.discountsList}
                        type={states.invoice.invoiceType as InvoiceTypes}
                        goBack={() => actions.viewType(null)}
                    />
                </View>
            </Container>
        )
    }

    if (states.screenType === 'fuelSupply') {
        return (
            <Container>
                <View style={{ width: '95%' }}>
                    <FuelSupply
                        item={states.invoice.transportVehicleOrWorkEquipment}
                        fuelSupplies={states.invoice.fuelSupliesList}
                        type={states.invoice.invoiceType as InvoiceTypes}
                        goBack={() => actions.viewType(null)}
                    />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <CardDetalhes activeOpacity={1}>
                    <TituloDetalhes>
                        <TituloConteudo>{states.invoice.description}</TituloConteudo>
                    </TituloDetalhes>

                    <TextConteudoDetalhes>Número da Fatura: {states.invoice.serverId}</TextConteudoDetalhes>
                    <TextConteudoDetalhes>Placa: {states.invoice.modelOrPlate}</TextConteudoDetalhes>
                    <TextConteudoDetalhes>
                        Data: {formatarData(states.invoice.createdAt)}
                    </TextConteudoDetalhes>
                    {states.invoice.invoiceType === InvoiceTypes.EQUIPMENT ? (
                        <HourMeterMonitoringInvoice
                            workEquipment={states.invoice.transportVehicleOrWorkEquipment}
                        />
                    ) : (
                        <Transport />
                    )}

                    <View style={{ marginTop: 10 }}></View>
                </CardDetalhes>
            </View>

            <ButtonListItemInvoice
                onPress={() => {
                    states.invoice.invoiceType === InvoiceTypes.EQUIPMENT
                        ? actions.viewType('hourMeter')
                        : actions.viewType('transport')
                }}
                titulo={`Total de Apontamentos de ${states.invoice.invoiceType === InvoiceTypes.EQUIPMENT ? 'Horimetro' : 'Transporte'} ${states.invoice?.dataList?.length ?? 0}`}
                corIcon={theme.colors.menu}
                nomeIcon={'caret-right'}
                tamanho={30}
            />
            <ButtonListItemInvoice
                onPress={() => actions.viewType('fuelSupply')}
                titulo={`Total de Abastecimentos: ${states.invoice?.fuelSupliesList?.length ?? 0}`}
                corIcon={theme.colors.menu}
                nomeIcon={'caret-right'}
                tamanho={30}
            />
            <ButtonListItemInvoice
                onPress={() => actions.viewType('discount')}
                titulo={`Total de Descontos: ${states.invoice?.discountsList?.length ?? 0}`}
                corIcon={theme.colors.menu}
                nomeIcon={'caret-right'}
                tamanho={30}
            />
            {!states.isLoading ? (
                <CardButton>
                    {states.invoice.invoiceStatus === InvoiceStatus.PAID ? (
                        <></>
                    ) : (
                        <>
                            <ViewButton style={{ backgroundColor: 'red', width: '35%' }}>
                                <ButtonEditar onPress={() => actions.showConfirmDialogCancel()}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 10, color: '#fff' }}>
                                        CANCELAR
                                    </Text>
                                    <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                                </ButtonEditar>
                            </ViewButton>
                            <ViewButton style={{ backgroundColor: 'green', width: '35%' }}>
                                <ButtonEditar onPress={() => actions.showConfirmDialogPaid()}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 10, color: '#fff' }}>
                                        FINALIZAR
                                    </Text>
                                    <FontAwesome name={'check'} size={20} style={{ color: '#fff' }} />
                                </ButtonEditar>
                            </ViewButton>
                        </>
                    )}

                    <ViewButton style={{ backgroundColor: '#000080', width: '20%' }}>
                        <ButtonEditar onPress={() => actions.showConfirmDialogPrint()}>
                            <FontAwesome name={'print'} size={20} style={{ color: '#fff' }} />
                        </ButtonEditar>
                    </ViewButton>
                </CardButton>
            ) : (
                <CardButton>
                    <ViewButton style={{ backgroundColor: 'red', width: '35%', opacity: 0.7 }}>
                        <ActivityIndicator style={{}} size={'small'} color="#fff" />
                    </ViewButton>
                    <ViewButton style={{ backgroundColor: 'green', width: '35%', opacity: 0.7 }}>
                        <ActivityIndicator style={{}} size={'small'} color="#fff" />
                    </ViewButton>
                    <ViewButton style={{ backgroundColor: '#000080', width: '20%', opacity: 0.7 }}>
                        <ActivityIndicator style={{}} size={'small'} color="#fff" />
                    </ViewButton>
                </CardButton>
            )}
        </Container>
    )
}

const CardDetalhes = styled.TouchableOpacity`
    width: 95%;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    margin-top: 5px;
    height: auto;
`

const TextConteudoDetalhes = styled.Text`
    font-size: 15px;
    color: #000;
    font-weight: bold;
    width: 95%;
    text-align: left;
`

const TituloDetalhes = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
`

const TituloConteudo = styled.Text`
    width: 98%;
    padding: 2px;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`

const CardButton = styled.View`
    flex-direction: row;
    width: 95%;
    justify-content: center;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const ViewButton = styled.View`
    width: 45%;
    border-radius: 5px;
    flex-direction: row;
    padding: 7px;
    justify-content: center;
    align-items: center;
    margin: 5px;
`
