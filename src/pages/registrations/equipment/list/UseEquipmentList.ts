import { useEffect, useState } from 'react'
import { EquipmentServices } from '../../../../domin/services/interfaces/EquipmentServices'
import EquipmentDto from '../../../../domin/entity/equipment/EquipmentDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'

type EquipmentListProps = {
    equipmentServices: EquipmentServices
    navigation: any
}

export default function useEquipmentList({ equipmentServices, navigation }: EquipmentListProps) {
    const [equipments, setEquipments] = useState<EquipmentDto[]>([])
    const [isLoadingList, setIsLoadingList] = useState(true)
    const { user } = useAuth()
    const [load, setLoad] = useState(true)

    async function getAll() {
        navigation.addListener('focus', () => setLoad(!load))
        try {
            const result = await equipmentServices.loadAllEquipmentByEnterpriseIdFromLocalDatabase(
                user.enterpriseId
            )
            setEquipments(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        getAll()
    }, [load])

    function handleEditEquipment(item: EquipmentDto) {
        navigation.navigate('Edit Equipment', {
            equipment: item,
            equipmentServices: equipmentServices,
        })
    }

    function handleUpdateBankInfo(item: EquipmentDto): void {
        navigation.navigate('Bank info Equipment', {
            equipmentServices: equipmentServices,
            bankInfo: {
                bank: item.bank,
                agency: item.agency,
                account: item.account,
                beneficiary: item.beneficiary,
                pix: item.pix,
            },
            equipmentId: item.id,
        })
    }

    function handleNewEquipment() {
        navigation.navigate('New Equipment', {
            equipmentServices: equipmentServices,
        })
    }
    return {
        equipments,
        isLoadingList,
        handleNewEquipment,
        handleEditEquipment,
        handleUpdateBankInfo,
    }
}
