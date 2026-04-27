import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { MenuEquipmentType, ScreenNames } from '../../../types'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'
import WorkDto from '@domin/entity/work/WorkDto'

export default function useEquipmentMenuOptions() {
    const workServices = useInjection('WorkServices')
    const navigation = useNavigation()
    const { user } = useAuth()
    const animation = useRef(null)
    const [states, setStates] = useState({
        works: [] as WorkDto[],
        work: null as WorkDto,
        isLoadingList: true,
        type: null as MenuEquipmentType,
    })

    async function loadAll() {
        navigation.setOptions({ title: 'Equipamentos' })
        try {
            const result = await workServices.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                user.enterpriseId,
                '' + user.id,
                user.role
            )
            setStates((state) => ({ ...state, works: result }))
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

    function handleClickItemWorkList(item: WorkDto) {
        if (states.type == MenuEquipmentType.WORKS) {
            navigation.navigate(ScreenNames.WORK_EQUIPMENTS_LIST, {
                workId: item.id,
            })
            setStates((state) => ({ ...state, type: null }))
        }
        if (states.type == MenuEquipmentType.MAINTENANCE_TRUCKS) {
            navigation.navigate(ScreenNames.MAINTENANCE_TRUCKS, {
                workId: item.id,
            })
            setStates((state) => ({ ...state, type: null }))
        }
    }

    function handleClickTypeList(type: MenuEquipmentType) {
        if (type == MenuEquipmentType.WORKS) {
            setStates((state) => ({ ...state, type: type }))
            navigation.setOptions({ title: 'Escolha uma obra' })
        }
        if (type == MenuEquipmentType.EQUIPMENTS) {
            navigation.navigate(ScreenNames.EQUIPMENTS)
        }

        if (type == MenuEquipmentType.MAINTENANCE_TRUCKS) {
            setStates((state) => ({ ...state, type: type }))
            navigation.setOptions({ title: 'Escolha uma obra' })
        }
    }

    return {
        states,
        animation,
        actions: {
            handleClickTypeList,
            handleClickItemWorkList,
        },
    }
}
