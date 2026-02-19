import { useEffect, useState } from 'react'
import { FuelSupplyServices } from '../../../domin/services/interfaces/FuelSupplyServices'
import { useAuth } from '../../../contexts/AuthContext'
import WorkDto from '../../../domin/entity/work/WorkDto'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '../../../domin/entity/work-equipment/WorkEquipmentDto'
import { FuelSupplyTypes, ScreenNames } from '../../../types'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import { TransportVehicleServices } from '../../../domin/services/interfaces/TransportVehicleServices'
import { WorkEquipmentServices } from '../../../domin/services/interfaces/WorkEquipmentServices'
import { useApplicationContext } from '../../../contexts/ApplicationContext'

type UseFuelSupplesProps = {
    work: WorkDto
    fuelSupplyServices: FuelSupplyServices
    transportVehicleServices: TransportVehicleServices
    workEquipmentServices: WorkEquipmentServices
    type: string
    navigation
}

export default function useFuelSupples({
    navigation,
    work,
    transportVehicleServices,
    fuelSupplyServices,
    workEquipmentServices,
    type,
}: UseFuelSupplesProps) {
    const { user } = useAuth()
    const [isLoad, setIsLoad] = useState(true)
    const [transportVehicles, setTransportVehicles] = useState<TransportVehicleDto[]>([])
    const [workEquipments, setWorkEquipments] = useState<WorkEquipmentDto[]>([])
    const [isLoadingList, setIsLoadingList] = useState(true)
    const { saveWork } = useApplicationContext()

    useEffect(() => {
        if (type && type === FuelSupplyTypes.EQUIPMENT) {
            loadAllWorkEquipments()
            navigation.setOptions({ title: 'Escolha um equipamento' })
        }
        if (type && type === FuelSupplyTypes.TRANSPORT_VEHICLE) {
            loadAllTransportVehicle()
            navigation.setOptions({ title: 'Escolha uma caçamba' })
        }
    }, [isLoad])

    function handleClickItemTransportVehicle(tratsportVehicle: TransportVehicleDto) {
        navigation.navigate(ScreenNames.FUEL_SUPPLY_LIST, {
            fuelSupplyServices: fuelSupplyServices,
            transportVehicleOrWorkEquipmentId: tratsportVehicle.id,
            workId: work.id,
            type: FuelSupplyTypes.TRANSPORT_VEHICLE,
        })
    }

    function handleClickItemWorkEquipment(workEquipment: WorkEquipmentDto) {
        navigation.navigate(ScreenNames.FUEL_SUPPLY_LIST, {
            fuelSupplyServices: fuelSupplyServices,
            transportVehicleOrWorkEquipmentId: workEquipment.id,
            workId: work.id,
            type: FuelSupplyTypes.EQUIPMENT,
        })
    }

    async function loadAllTransportVehicle() {
        navigation.addListener('focus', () => setIsLoad(!isLoad))
        setIsLoadingList(true)
        try {
            const result =
                await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setTransportVehicles(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    async function loadAllWorkEquipments() {
        navigation.addListener('focus', () => setIsLoad(!isLoad))
        setIsLoadingList(true)
        try {
            const result =
                await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setWorkEquipments(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    return {
        isLoadingList,
        transportVehicles,
        workEquipments,
        handleClickItemTransportVehicle,
        handleClickItemWorkEquipment,
        saveWork,
    }
}
