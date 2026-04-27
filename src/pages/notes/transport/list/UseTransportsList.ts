import { useEffect, useState } from 'react'
import MaterialTransportDto from '@domin/entity/material-transport/MaterialTransportDto'
import { Alert } from 'react-native'
import { useAuth } from '../../../../contexts/AuthContext'
import { useConfig } from '../../../../contexts/ConfigContext'
import { errorVibration } from '../../../../services/VibrationService'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type TransportsListProp = RouteProp<RootStackParamList, ScreenNames.TRANSPORT_NOTE_LIST>

export default function useTransportsList() {
    const materialTransportServices = useInjection('MaterialTransportServices')
    const route = useRoute<TransportsListProp>()
    const { workId, transportVehicle } = route.params
    const navigation = useNavigation()

    const [states, setStates] = useState({
        materialTransports: [] as MaterialTransportDto[],
        isLoadingList: true,
    })

    const { user } = useAuth()
    const { config } = useConfig()
    const [workRoutes, setWorkRoutes] = useState(config.workRoutes)

    async function loadAllTransportsNotes() {
        try {
            if (!transportVehicle) {
                Alert.alert('Ocorreu um erro a selecionar a Caçamba, Tente novamente!')
                return
            }
            if (!workId) {
                Alert.alert('Ocorreu um erro a selecionar a Obra, Tente novamento')
                return
            }
            const result =
                await materialTransportServices.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
                    user.enterpriseId,
                    workId,
                    transportVehicle.id
                )
            setStates((state) => ({ ...state, materialTransports: result }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar os Apontamentos', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAllTransportsNotes()
        })
        return unsubscribe
    }, [transportVehicle, workId])

    function handlerClickNewButton() {
        navigation.navigate(ScreenNames.NEW_TRANSPORT_NOTE, {
            transportVehicle: transportVehicle,
        })
    }

    const handlerclickItem = (item: MaterialTransportDto) => {
        navigation.navigate(ScreenNames.TRANSPORT_DETAILS, { materialTransport: item })
    }

    return {
        states,
        user,
        workRoutes,
        actions: {
            handlerClickNewButton,
            handlerclickItem,
        },
    }
}
