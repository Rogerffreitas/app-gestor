import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { MaintenanceTruckDto } from '../../../../domin/entity/maintenance-truck/MaintenanceTruckDto'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { useInjection } from '@/src/contexts/InjectionContext'

type MaintenanceTrucksProp = RouteProp<RootStackParamList, ScreenNames.MAINTENANCE_TRUCKS>

export default function useMaintenanceTrucks() {
    const maintenanceTruckServices = useInjection('MaintenanceTruckServices')
    const workServices = useInjection('WorkServices')
    const route = useRoute<MaintenanceTrucksProp>()
    const navigation = useNavigation()
    const { workId } = route.params

    const [states, setStates] = useState({
        maintenanceTrucks: [] as MaintenanceTruckDto[],
        isLoadingList: true,
        work: {} as WorkDto,
    })

    const { user } = useAuth()

    async function loadAll() {
        try {
            const workPromise = workServices.findWorkByIdInLocalDatabase(workId)
            const maintenanceTrucksPromise =
                maintenanceTruckServices.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    workId
                )
            const [work, maintenanceTrucks] = await Promise.all([workPromise, maintenanceTrucksPromise])

            setStates((state) => ({ ...state, maintenanceTrucks: maintenanceTrucks }))
            setStates((state) => ({ ...state, work: work }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [navigation])

    function handleClickNewButton() {
        const workEquipmentIds = states.maintenanceTrucks.map((item) => item.workEquipmentId)
        navigation.navigate(ScreenNames.NEW_MAINTENANCE_TRUCKS, {
            workId: workId,
            workEquipmentIds: workEquipmentIds,
        })
    }

    async function handleDelete(item: MaintenanceTruckDto) {
        try {
            maintenanceTruckServices.deleteMaintenanceTruckInLocalDatabase(
                item.id,
                item.workEquipmentId,
                item.workEquipmentId
            )
            let index = states.maintenanceTrucks.findIndex((i) => i.id == item.id)

            let arr = [...states.maintenanceTrucks]

            if (index != -1) {
                arr.splice(index, 1)
            }

            setStates((state) => ({ ...state, maintenanceTrucks: arr }))
        } catch (error) {
            console.log('[MaintenanceTrucks]: ' + error.message)
            Alert.alert(error.message, 'Já existe registros de abastecimentos')
        }
    }

    const showConfirmDialog = (item: MaintenanceTruckDto) => {
        return Alert.alert('Deseja apagar o melosa?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    handleDelete(item)
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    function goBack() {
        navigation.goBack()
    }

    return {
        states,
        actions: {
            handleClickNewButton,
            showConfirmDialog,
            goBack,
        },
    }
}
