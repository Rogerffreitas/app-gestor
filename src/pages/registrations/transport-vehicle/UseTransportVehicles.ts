import { useEffect, useState } from 'react'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { useAuth } from '../../../contexts/AuthContext'
import { ScreenNames } from '../../../types'
import { WorkServices } from '../../../domin/services/interfaces/WorkServices'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { useInjection } from '@/src/contexts/InjectionContext'

export default function useTransportVehiclesList() {
    const workServices = useInjection('WorkServices')
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const navigation = useNavigation()
    const { work, saveWork } = useApplicationContext()
    const [states, setStates] = useState({
        works: [] as WorkDto[],
        isLoadingList: true,
        transportVehicles: [] as TransportVehicleDto[],
    })

    const { user } = useAuth()

    async function loadAll() {
        try {
            const results = await workServices.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                user.enterpriseId,
                user.id,
                user.role
            )
            setStates((state) => ({ ...state, works: results, isLoadingList: false }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (work) {
                navigation.setOptions({ title: 'Lista de Caçambas' })
                loadAllTranpostVehicles(work)
            } else {
                loadAll()
            }
        })
        return unsubscribe
    }, [navigation, work])

    async function loadAllTranpostVehicles(item: WorkDto) {
        try {
            const results =
                await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    item.id
                )

            setStates((state) => ({ ...state, transportVehicles: results, isLoadingList: false }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    function handleClickEditButton(item: TransportVehicleDto) {
        navigation.navigate(ScreenNames.EDIT_TRANSPORT_VEHICLE, {
            transportVehicleId: item.id,
        })
    }

    function handleClickEditBankInfo(item: TransportVehicleDto): void {
        navigation.navigate(ScreenNames.BANK_INFO_TRANSPORT_VEHICLE, {
            transportVehicleId: item.id,
        })
    }

    function handleClickNewButton() {
        navigation.navigate(ScreenNames.NEW_TRANSPORT_VEHICLE, {
            workId: work.id,
        })
    }

    function handleSelectWork(workSelected: WorkDto) {
        navigation.setOptions({ title: 'Lista de Caçambas' })
        setStates((state) => ({ ...state, isLoadingList: true }))
        saveWork(workSelected)
        loadAllTranpostVehicles(workSelected)
    }

    function handleClickSelectedWork() {
        saveWork(null)
        setStates((state) => ({ ...state, work: null }))
        navigation.setOptions({ title: 'Escolha uma obra!' })
    }

    return {
        states,
        work,
        actions: {
            loadAllTranpostVehicles,
            handleClickNewButton,
            handleClickEditBankInfo,
            handleClickEditButton,
            handleClickSelectedWork,
            handleSelectWork,
        },
    }
}
