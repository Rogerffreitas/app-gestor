import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../../../domin/entity/work-equipment/WorkEquipmentDto'
import { FuelSupplyTypes, RootStackParamList, ScreenNames } from '../../../types'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import { WorkEquipmentServices } from '../../../domin/services/interfaces/WorkEquipmentServices'
import { useInjection } from '../../../infra/hooks/useInjection'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TransportVehicleServices } from '../../../domin/services/interfaces/TransportVehicleServices'

type FuelSuppliesProp = RouteProp<RootStackParamList, ScreenNames.FUEL_SUPPLIES>

export default function useFuelSupplies() {
    const workEquipmentServices = useInjection<WorkEquipmentServices>('WorkEquipmentServices')
    const transportVehicleServices = useInjection<TransportVehicleServices>('TransportVehicleServices')
    const route = useRoute<FuelSuppliesProp>()
    const { type } = route.params
    const navigation = useNavigation()
    const { user } = useAuth()
    const { work } = useApplicationContext()
    const [dataList, setDataList] = useState<WorkEquipmentDto[] | TransportVehicleDto[]>([])
    const [isLoadingList, setIsLoadingList] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    function handleClickItemTransportVehicle(tratsportVehicle: TransportVehicleDto) {
        navigation.navigate(ScreenNames.FUEL_SUPPLY_LIST, {
            transportVehicleOrWorkEquipmentId: tratsportVehicle.id,
            workId: work.id,
            type: FuelSupplyTypes.TRANSPORT_VEHICLE,
        })
    }

    function handleClickItemWorkEquipment(workEquipment: WorkEquipmentDto) {
        navigation.navigate(ScreenNames.FUEL_SUPPLY_LIST, {
            transportVehicleOrWorkEquipmentId: workEquipment.id,
            workId: work.id,
            type: FuelSupplyTypes.EQUIPMENT,
        })
    }

    async function loadData() {
        try {
            if (type === FuelSupplyTypes.EQUIPMENT) {
                navigation.setOptions({ title: 'Escolha um equipamento' })
                setDataList(
                    await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    )
                )
            }

            if (type === FuelSupplyTypes.TRANSPORT_VEHICLE) {
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
            handleClickItemTransportVehicle,
            handleClickItemWorkEquipment,
        },
    }
}
