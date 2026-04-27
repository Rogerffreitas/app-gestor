import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../../../../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { InvoiceDto } from '@domin/entity/invoice/InvoiceDto'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../../services/VibrationService'
import { RootStackParamList, ScreenNames } from '../../../../../types'
import { useConfig } from '../../../../../contexts/ConfigContext'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewInvoiceProp = RouteProp<RootStackParamList, ScreenNames.NEW_INVOICE>
type ViewType = 'transport' | 'hourMeter' | 'discount' | 'fuelSupply'

export default function useNewInvoice() {
    const invoiceServices = useInjection('InvoiceServices')
    const navigation = useNavigation()
    const route = useRoute<NewInvoiceProp>()
    const { workId, type, transportVehicleOrWorkEquipment, startDate, endDate } = route.params
    const [states, setStates] = useState({
        isLoadingList: true,
        invoice: {} as InvoiceDto,
        screenType: null as ViewType,
        isLoading: false,
    })

    const { user, token } = useAuth()
    const { config } = useConfig()

    async function generateInvoice() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))
            console.log(states.invoice.userId)
            const result = await invoiceServices.generateInvoice(
                config.urlApi,
                '/invoices',
                { ...states.invoice, userId: user.id, enterpriseId: user.enterpriseId } as InvoiceDto,
                token
            )
            setStates((state) => ({ ...state, isLoading: false }))
            if (result.serverId) {
                Alert.alert(`Fatura ${result.serverId} gerada com sucesso!`)
            }
            navigation.goBack()
        } catch (error) {
            Alert.alert('Erro ao tentar gerar a fatura', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoading: false }))
            navigation.goBack()
        }
    }

    async function loadAll() {
        try {
            const result = await invoiceServices.loadAllInoviceItensByWorkIdAndStartDateAndEndDateAndType(
                transportVehicleOrWorkEquipment.id,
                config.urlApi,
                '/invoices/search',
                user.enterpriseId,
                workId,
                startDate,
                endDate,
                type,
                token
            )
            setStates((state) => ({ ...state, invoice: result, isLoadingList: false }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [navigation])

    const showConfirmDialog = () => {
        return Alert.alert('Deseja gerar uma Fatura?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    generateInvoice()
                },
            },
            {
                text: 'NÃO',
            },
        ])
    }

    return {
        states,
        type,
        actions: {
            viewType: (t: ViewType) => setStates((state) => ({ ...state, screenType: t })),
            goBack: () => navigation.goBack(),
            showConfirmDialog,
        },
        transportVehicleOrWorkEquipment,
    }
}
