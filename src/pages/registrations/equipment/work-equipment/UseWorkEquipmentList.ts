import { useEffect, useState } from 'react'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { WorkEquipmentServices } from '../../../../domin/services/interfaces/WorkEquipmentServices'
import { useAuth } from '../../../../contexts/AuthContext'
import WorkEquipmentDto from '../../../../domin/entity/work-equipment/WorkEquipmentDto'
import { EquipmentServices } from '../../../../domin/services/interfaces/EquipmentServices'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'

type WorkEquipmentListProps = {
    work: WorkDto
    workEquipmentServices: WorkEquipmentServices
    equipmentServices: EquipmentServices
    navigation: any
}

export default function useWorkEquipmentList({
    work,
    workEquipmentServices,
    equipmentServices,
    navigation,
}: WorkEquipmentListProps) {
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [workEquipments, setWorkEquipments] = useState<WorkEquipmentDto[]>([])
    const { user } = useAuth()
    const [load, setLoad] = useState(true)

    async function loadAllEquipments() {
        navigation.addListener('focus', () => setLoad(!load))
        try {
            const result = await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
                work.id,
                user.enterpriseId
            )
            setWorkEquipments(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        loadAllEquipments()
    }, [load])

    function handleNewWorkEquipment() {
        let equipmentsSelectedIds = []
        workEquipments.forEach((item) => {
            equipmentsSelectedIds.push(item.equipment.id)
        })

        navigation.navigate('Work Equipment', {
            work: work,
            equipmentsSelectedIds: equipmentsSelectedIds,
            workEquipmentServices: workEquipmentServices,
            equipmentServices: equipmentServices,
        })
    }

    async function deleteEquipment(item) {
        try {
            let index = workEquipments.findIndex((i) => i.id == item.id)

            let arr = [...workEquipments]

            if (index != -1) {
                arr.splice(index, 1)
            }

            setWorkEquipments(arr)

            await workEquipmentServices.deleteWorkEquipmentInLocalDatabase(item.id, user.id)
        } catch (error) {
            console.log(error.message)
            Alert.alert('Erro ao apagar o equipamento', 'Menssagem: ' + error)
            errorVibration()
        }
    }

    function showConfirmDialog(item: WorkEquipmentDto) {
        return Alert.alert('Deseja apagar o equipamento?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteEquipment(item)
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    return {
        workEquipments,
        isLoadingList,
        handleNewWorkEquipment,
        showConfirmDialog,
    }
}
