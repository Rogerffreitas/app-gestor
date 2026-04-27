import { useEffect, useState } from 'react'
import TransportVehicleDto from '@domin/entity/transport-vehicle/TransportVehicleDto'
import { Alert } from 'react-native'
import { useAuth } from '../../../contexts/AuthContext'
import { ScreenNames } from '../../../types'
import { errorVibration } from '../../../services/VibrationService'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { useNavigation } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

export default function useTransport() {
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const navigation = useNavigation()
    const { user } = useAuth()

    const [states, setStates] = useState({
        isLoadingList: true,
        transportVehicles: [] as TransportVehicleDto[],
    })

    const { saveWork, work } = useApplicationContext()

    async function loadAllTransportVehicles() {
        try {
            const allTransportVehicles =
                await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setStates((state) => ({ ...state, transportVehicles: allTransportVehicles }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar as Caçambas', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (!work) {
                navigation.goBack()
                return
            }
            loadAllTransportVehicles()
        })
        return unsubscribe
    }, [work])

    function handleClickItemTransportVehicle(item: TransportVehicleDto) {
        navigation.navigate(ScreenNames.TRANSPORT_NOTE_LIST, {
            workId: work.id,
            transportVehicle: item,
        })
    }
    function goBack() {
        navigation.goBack()
    }
    return {
        states,
        work,
        actions: {
            goBack,
            handleClickItemTransportVehicle,
            saveWork,
        },
    }
}
