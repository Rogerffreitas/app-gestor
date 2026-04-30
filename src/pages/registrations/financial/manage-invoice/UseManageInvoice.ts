import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { InvoiceStatus, RootStackParamList, ScreenNames } from '../../../../types'
import { useAuth } from '../../../../contexts/AuthContext'
import { useConfig } from '../../../../contexts/ConfigContext'
import { InvoiceDto } from '@gestor/domain/entity/invoice/InvoiceDto'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { useInjection } from '@/src/contexts/InjectionContext'

type ManageInvoiceProp = RouteProp<RootStackParamList, ScreenNames.MANAGE_INVOICE>

export default function useManageInvoice() {
    const route = useRoute<ManageInvoiceProp>()
    const navigation = useNavigation()
    const { workId, type } = route.params
    const invoiceServices = useInjection('InvoiceServices')
    const { user, token } = useAuth()
    const { config } = useConfig()

    const [states, setStates] = useState({
        isLoadingList: true,
        invoices: [] as InvoiceDto[],
        titleColor: '#fff',
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [type, workId])

    async function loadAll() {
        try {
            const result = await invoiceServices.loadAllInoviceEnterpriseIdAndWorkIdAndType(
                config.urlApi,
                '/invoices',
                user.enterpriseId,
                workId,
                type,
                token
            )

            setStates((state) => ({ ...state, invoices: result, isLoadingList: false }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    async function handleClickItemInvoice(item: InvoiceDto) {
        if (item.invoiceStatus === InvoiceStatus.CANCELED) {
            Alert.alert('Fatura cancelada')
        } else {
            navigation.navigate(ScreenNames.INVOICE_DETAILS, {
                workId: item.workId,
                invoiceId: item.id,
            })
        }
    }

    return {
        states,
        actions: {
            handleClickItemInvoice,
            goBack: () => navigation.goBack(),
        },
    }
}
