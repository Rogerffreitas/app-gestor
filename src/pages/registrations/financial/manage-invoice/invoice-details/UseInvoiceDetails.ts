import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { InvoiceStatus, InvoiceTypes, RootStackParamList, ScreenNames } from '../../../../../types'
import { InvoiceDto } from '@gestor/domain/entity/invoice/InvoiceDto'
import { useEffect, useState } from 'react'
import { useConfig } from '../../../../../contexts/ConfigContext'
import { useAuth } from '../../../../../contexts/AuthContext'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../../services/VibrationService'
import MaterialTransportDto from '@gestor/domain/entity/material-transport/MaterialTransportDto'
import HourMeterMonitoringDto from '@gestor/domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import * as Print from 'expo-print'
import { useInjection } from '@/src/contexts/InjectionContext'

type InvoiceDetailsProp = RouteProp<RootStackParamList, ScreenNames.INVOICE_DETAILS>
type ViewType = 'transport' | 'hourMeter' | 'discount' | 'fuelSupply'

export default function useInvoiceDetails() {
    const route = useRoute<InvoiceDetailsProp>()
    const navigation = useNavigation()
    const { workId, invoiceId } = route.params
    const invoiceServices = useInjection('InvoiceServices')
    const { user, token } = useAuth()
    const { config } = useConfig()

    const [states, setStates] = useState({
        isLoadingList: true,
        isLoading: false,
        screenType: null as ViewType,
        invoice: {} as InvoiceDto,
        calculatedInitialValue: 0,
        totalHoursWorked: 1,
        totalInvoice: 0,
        totalDiscounts: 0,
        totalFuelSupplies: 0,
        fuelConsumption: 0,
        totalPayable: 0,
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [invoiceId, workId])

    async function loadAll() {
        try {
            const result = await invoiceServices.loadAInoviceById(
                config.urlApi,
                '/invoices',
                invoiceId,
                user.enterpriseId,
                workId,
                token
            )
            const tInvoice =
                result.invoiceType === InvoiceTypes.EQUIPMENT
                    ? (result.dataList as HourMeterMonitoringDto[]).reduce(
                          (acc, curr) => acc + (curr.value || 0),
                          0
                      )
                    : (result.dataList as MaterialTransportDto[]).reduce(
                          (acc, curr) => acc + (curr.value || 0),
                          0
                      )

            const tDiscountsBase = result.discountsList.reduce((acc, curr) => acc + (curr.value || 0), 0)

            const tFuelSupplies = result.fuelSupliesList.reduce((acc, curr) => {
                return curr.isDiscount ? acc + (curr.value || 0) : acc
            }, 0)

            const totalDiscountsSum = tDiscountsBase + tFuelSupplies
            const tPayable = tInvoice - totalDiscountsSum

            //console.info(tInvoice)

            setStates((state) => ({
                ...state,
                invoice: result,
                isLoadingList: false,
                totalInvoice: tInvoice / 100,
                totalFuelSupplies: tFuelSupplies / 100,
                totalDiscounts: totalDiscountsSum / 100,
                totalPayable: tPayable / 100,
            }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    /* async function _imprimirFatura() {
        
    }*/

    async function updateInvoice(invoiceStatus: string, serverId: number) {
        try {
            setStates((state) => ({
                ...state,
                isLoading: true,
            }))
            const i = { ...states.invoice, invoiceStatus: invoiceStatus, serverId: serverId } as InvoiceDto
            const result = await invoiceServices.updateInvoice(config.urlApi, '/invoices', i, token)
            setStates((state) => ({ ...state, isLoading: false }))
            navigation.goBack()
        } catch (error) {
            Alert.alert('Erro ao tentar atualizar a fatura', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoading: false }))
            navigation.goBack()
        }
    }

    function handleCancelInvoice() {
        updateInvoice(InvoiceStatus.CANCELED, 0)
    }

    function handlePaidInvoice() {
        updateInvoice(InvoiceStatus.PAID, states.invoice.serverId)
    }

    async function handlePrintInvoice() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))
            const pdf = await invoiceServices.generateInvoiceAnalyticPdfFormat(
                config.urlApi,
                `/reports/invoice-analytic-pdf`,
                token,
                states.invoice.id,
                user.enterpriseId,
                workId
            )

            await Print.printAsync({ uri: pdf })
            setStates((state) => ({ ...state, isLoading: false }))
        } catch (error) {
            console.info(error.mesage)
            Alert.alert(`Erro ao tentar imprimir: ${error}`)
            errorVibration()
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    const showConfirmDialog = (title, onConfirm) => {
        return Alert.alert(title, 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: onConfirm,
            },
            {
                text: 'NÃO',
                onPress: () => setStates((state) => ({ ...state, isLoading: false })),
                style: 'cancel',
            },
        ])
    }

    const showConfirmDialogCancel = () => showConfirmDialog('Deseja cancelar a fatura?', handleCancelInvoice)

    const showConfirmDialogPaid = () => showConfirmDialog('Deseja finalizar a fatura?', handlePaidInvoice)

    const showConfirmDialogPrint = () => showConfirmDialog('Deseja imprimir a fatura?', handlePrintInvoice)

    return {
        states,
        actions: {
            viewType: (t: ViewType) => setStates((state) => ({ ...state, screenType: t })),
            goBack: () => navigation.goBack(),
            showConfirmDialogCancel,
            showConfirmDialogPaid,
            showConfirmDialogPrint,
        },
    }
}
