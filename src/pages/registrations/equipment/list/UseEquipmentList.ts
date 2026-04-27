import { useEffect, useState } from 'react'
import EquipmentDto from '@domin/entity/equipment/EquipmentDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { ScreenNames } from '../../../../types'
import { useNavigation } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

export default function useEquipmentList() {
    const equipmentServices = useInjection('EquipmentServices')
    const navigation = useNavigation()

    const [states, setStates] = useState({
        isLoadingList: true,
        equipments: [] as EquipmentDto[],
    })
    const { user } = useAuth()

    async function loadAll() {
        try {
            const results = await equipmentServices.loadAllEquipmentByEnterpriseIdFromLocalDatabase(
                user.enterpriseId
            )
            setStates((state) => ({ ...state, equipments: results }))
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

    function handleEditEquipment(item: EquipmentDto) {
        navigation.navigate(ScreenNames.EDIT_EQUIPMENT, {
            equipment: item,
        })
    }

    function handleUpdateBankInfo(item: EquipmentDto): void {
        navigation.navigate(ScreenNames.BANK_INFO_EQUIPMENT, { equipment: item })
    }

    function handleNewEquipment() {
        navigation.navigate(ScreenNames.NEW_EQUIPMENT)
    }
    return {
        states,
        actions: {
            handleNewEquipment,
            handleEditEquipment,
            handleUpdateBankInfo,
        },
    }
}
