import { useEffect, useState } from 'react'
import WorkDto from '../../../domin/entity/work/WorkDto'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { Alert } from 'react-native'
import { useAuth } from '../../../contexts/AuthContext'
import { TransportVehicleServices } from '../../../domin/services/interfaces/TransportVehicleServices'
import { ScreenNames } from '../../../types'
import { errorVibration } from '../../../services/VibrationService'
import { MaterialTransportServices } from '../../../domin/services/interfaces/MaterialTransportServices'
import { useConfig } from '../../../contexts/ConfigContext'
import { MaterialServices } from '../../../domin/services/interfaces/MaterialServices'
import { WorkRoutesServices } from '../../../domin/services/interfaces/WorkRoutesServices'

type UseTransportProps = {
    work: WorkDto
    transportVehicleServices: TransportVehicleServices
    materialTransportServices: MaterialTransportServices
    workRoutesServices: WorkRoutesServices
    materialServices: MaterialServices
    navigation
}

export default function useTransport({
    navigation,
    transportVehicleServices,
    materialTransportServices,
    workRoutesServices,
    materialServices,
    work,
}: UseTransportProps) {
    const [isLoad, setIsLoad] = useState(true)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [transportVehicles, setTransportVehicles] = useState<TransportVehicleDto[]>([])
    const { user } = useAuth()
    const { rotasPadroes } = useConfig()

    async function loadAllTransportVehicles() {
        try {
            setIsLoadingList(true)
            const allTransportVehicles =
                await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setTransportVehicles(allTransportVehicles)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar as Caçambas', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        loadAllTransportVehicles()
    }, [isLoad])

    function handleClickItemTransportVehicle(item: TransportVehicleDto) {
        navigation.navigate(ScreenNames.TRANSPORT_NOTE_LIST, {
            work: work,
            transportVehicle: item,
            materialTransportServices: materialTransportServices,
            workRoutesServices: workRoutesServices,
            materialServices: materialServices,
        })
    }
    return {
        user,
        rotasPadroes,
        work,
        transportVehicles,
        isLoadingList,
        isLoad,
        setIsLoad,

        handleClickItemTransportVehicle,
    }
}
