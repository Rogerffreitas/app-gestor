import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { DiscountTypes, RootStackParamList, ScreenNames } from '../../../types'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../../../domin/entity/work-equipment/WorkEquipmentDto'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type DiscountsProp = RouteProp<RootStackParamList, ScreenNames.DISCOUNTS>

export default function useDiscounts() {
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const route = useRoute<DiscountsProp>()
    const { type } = route.params
    const navigation = useNavigation()
    const { user } = useAuth()
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [dataList, setDataList] = useState<WorkEquipmentDto[] | TransportVehicleDto[]>([])
    const { saveWork, work } = useApplicationContext()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    async function loadData() {
        try {
            if (type === DiscountTypes.EQUIPMENT) {
                navigation.setOptions({ title: 'Escolha um equipamento' })
                setDataList(
                    await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    )
                )
            }

            if (type === DiscountTypes.TRANSPORT_VEHICLE) {
                navigation.setOptions({ title: 'Escolha uma caçamba' })
                setDataList(
                    await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    )
                )
            }
        } catch (error) {
            console.error(error)
            errorVibration()
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickItemTransportVehicle(tratsportVehicle: TransportVehicleDto) {
        navigation.navigate(ScreenNames.DISCOUNTS_LIST, {
            type: DiscountTypes.TRANSPORT_VEHICLE,
            transportVehicleOrWorkEquipmentId: tratsportVehicle.id,
            workId: work.id,
        })
    }

    function handleClickItemWorkEquipment(workEquipment: WorkEquipmentDto) {
        navigation.navigate(ScreenNames.DISCOUNTS_LIST, {
            type: DiscountTypes.EQUIPMENT,
            transportVehicleOrWorkEquipmentId: workEquipment.id,
            workId: work.id,
        })
    }

    function goBack() {
        navigation.goBack()
    }

    return {
        isLoadingList,
        dataList,
        type,
        work,
        actions: {
            goBack,
            saveWork,
            handleClickItemTransportVehicle,
            handleClickItemWorkEquipment,
        },
    }
}
