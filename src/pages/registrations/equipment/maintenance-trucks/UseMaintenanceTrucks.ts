import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { MaintenanceTruckServices } from '../../../../domin/services/interfaces/MaintenanceTruckServices'
import { MaintenanceTruckDto } from '../../../../domin/entity/maintenance-truck/MaintenanceTruckDto'
import { Alert } from 'react-native'
import { WorkEquipmentServices } from '../../../../domin/services/interfaces/WorkEquipmentServices'
import { UserServices } from '../../../../domin/services/interfaces/UserServices'
import { errorVibration } from '../../../../services/VibrationService'

type MaintenanceTruckProps = {
    maintenanceTruckServices: MaintenanceTruckServices
    workEquipmentServices: WorkEquipmentServices
    userServices: UserServices
    work: WorkDto
    navigation
}
export default function useMaintenanceTrucks({
    navigation,
    work,
    maintenanceTruckServices,
    workEquipmentServices,
    userServices,
}: MaintenanceTruckProps) {
    const [maintenanceTruck, setMaintenanceTruck] = useState<MaintenanceTruckDto[]>([])
    const { user } = useAuth()
    const [load, setLoad] = useState(true)
    const [isLoadingList, setIsLoadingList] = useState(true)

    async function loadAll() {
        try {
            navigation.addListener('focus', () => setLoad(!load))
            const result =
                await maintenanceTruckServices.loadAllMaintenanceTruckByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setMaintenanceTruck(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        loadAll()
    }, [load])

    function handleClickNewButton() {
        const workEquipmentIds = maintenanceTruck.map((item) => item.workEquipmentId)
        navigation.navigate('New Maintenance Trucks', {
            work: work,
            ids: workEquipmentIds,
            maintenanceTruckServices: maintenanceTruckServices,
            workEquipmentServices: workEquipmentServices,
            userServices: userServices,
        })
    }

    function handleDelete(item: MaintenanceTruckDto) {
        try {
            maintenanceTruckServices.deleteMaintenanceTruckInLocalDatabase(
                item.id,
                item.workEquipmentId,
                item.workEquipmentId
            )
            let index = maintenanceTruck.findIndex((i) => i.id == item.id)

            let arr = [...maintenanceTruck]

            if (index != -1) {
                arr.splice(index, 1)
            }

            setMaintenanceTruck(arr)
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
    return {
        maintenanceTruck,
        isLoadingList,
        handleClickNewButton,
        showConfirmDialog,
    }
}
