import { ActivityIndicator, TouchableOpacity, View, StyleSheet } from 'react-native'
import Container from '../../../../../components/Container'
import useNewInvoice from './UseNewInvoice'
import ButtonListItemInvoice from '../../../../../components/button/ButtonListItemInvoice'
import theme from '../../../../../global/styles/theme'
import { InvoiceTypes } from '../../../../../types'
import React from 'react'
import HourMeterMonitoring from '../../components/HourMeterMonitoring'
import Transports from '../../components/Transports'
import TitleInvoice from '../../components/TitleInvoice'
import Discount from '../../components/Discount'
import FuelSupply from '../../components/FuelSupply'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import HourMeterMonitoringDto from '@gestor/domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import MaterialTransportDto from '@gestor/domain/entity/material-transport/MaterialTransportDto'
import TransportVehicleDto from '@gestor/domain/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '@gestor/domain/entity/work-equipment/WorkEquipmentDto'

export default function NewInvoice() {
    const { states, type, actions, transportVehicleOrWorkEquipment } = useNewInvoice()

    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (states.screenType === 'transport') {
        return (
            <Container>
                <View style={{ width: '95%' }}>
                    <Transports
                        transportVehicle={transportVehicleOrWorkEquipment as TransportVehicleDto}
                        materialTransport={states.invoice.dataList as MaterialTransportDto[]}
                        type={type}
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
                        workEquipment={transportVehicleOrWorkEquipment as WorkEquipmentDto}
                        hourMeterMonitoring={states.invoice.dataList as HourMeterMonitoringDto[]}
                        type={type}
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
                        item={transportVehicleOrWorkEquipment}
                        discounts={states.invoice.discountsList}
                        type={type}
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
                        item={transportVehicleOrWorkEquipment}
                        fuelSupplies={states.invoice.fuelSupliesList}
                        type={type}
                        goBack={() => actions.viewType(null)}
                    />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            <View style={{ width: '95%' }}>
                <TitleInvoice goBack={actions.goBack} item={transportVehicleOrWorkEquipment} type={type} />
            </View>

            <ButtonListItemInvoice
                onPress={() => {
                    type === InvoiceTypes.EQUIPMENT
                        ? actions.viewType('hourMeter')
                        : actions.viewType('transport')
                }}
                titulo={`Total de Apontamentos de ${type === InvoiceTypes.EQUIPMENT ? 'Horimetro' : 'Transporte'} ${states.invoice?.dataList?.length ?? 0}`}
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
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.touchableOpacityStyle}
                    onPress={actions.showConfirmDialog}
                >
                    <FontAwesome name="file" size={20} color={'#fff'} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity activeOpacity={0.7} style={styles.touchableOpacityStyle} onPress={() => {}}>
                    <ActivityIndicator size={'small'} color="#fff" />
                </TouchableOpacity>
            )}
            {!states.isLoading ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.touchableOpacityPrintStyle}
                    onPress={actions.showPrintDialog}
                >
                    <FontAwesome name="print" size={20} color={'#fff'} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.touchableOpacityPrintStyle}
                    onPress={() => {}}
                >
                    <ActivityIndicator size={'small'} color="#fff" />
                </TouchableOpacity>
            )}
        </Container>
    )
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
    touchableOpacityPrintStyle: {
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
        backgroundColor: theme.colors.menu,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        position: 'absolute',
        right: 20,
        bottom: 90,
    },
})
