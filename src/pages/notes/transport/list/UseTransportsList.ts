import { useEffect, useState } from 'react'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import MaterialTransportDto from '../../../../domin/entity/material-transport/MaterialTransportDto'
import { MaterialTransportServices } from '../../../../domin/services/interfaces/MaterialTransportServices'
import { Alert } from 'react-native'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { useConfig } from '../../../../contexts/ConfigContext'
import { errorVibration } from '../../../../services/VibrationService'
import { ScreenNames } from '../../../../types'
import { MaterialServices } from '../../../../domin/services/interfaces/MaterialServices'
import { WorkRoutesServices } from '../../../../domin/services/interfaces/WorkRoutesServices'

type UseTransportListProps = {
    work: WorkDto
    transportVehicle: TransportVehicleDto
    materialTransportServices: MaterialTransportServices
    workRoutesServices: WorkRoutesServices
    materialServices: MaterialServices
    navigation: any
}

export default function useTransportsList({
    work,
    transportVehicle,
    materialTransportServices,
    workRoutesServices,
    materialServices,
    navigation,
}: UseTransportListProps) {
    const [isLoad, setIsLoad] = useState(true)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [materialTransports, setMaterialTransports] = useState<MaterialTransportDto[]>([])

    const { user } = useAuth()
    const { config } = useConfig()
    const [workRoutes, setWorkRoutes] = useState(config.workRoutes)

    async function loadAllTransportsNotes() {
        try {
            setIsLoadingList(true)
            navigation.addListener('focus', () => setIsLoad(!isLoad))

            if (!transportVehicle) {
                Alert.alert('Ocorreu um erro a selecionar a Caçamba, Tente novamente!')
                return
            }
            if (!work) {
                Alert.alert('Ocorreu um erro a selecionar a Obra, Tente novamento')
                return
            }
            const result =
                await materialTransportServices.loadAllMaterialTransportByEnterpriseIdAndWorkIdAndVehicleIdFromLocalDatabase(
                    user.enterpriseId,
                    work.id,
                    transportVehicle.id
                )
            setMaterialTransports(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar os Apontamentos', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        loadAllTransportsNotes()
    }, [isLoad])

    function handlerClickNewButton() {
        navigation.navigate(ScreenNames.NEW_TRANSPORT_NOTE, {
            work: work,
            transportVehicle: transportVehicle,
            materialTransportServices: materialTransportServices,
            workRoutesServices: workRoutesServices,
            materialServices: materialServices,
        })
    }

    const handlerclickItem = (item: MaterialTransportDto) => {
        navigation.navigate('Detalhes Transporte', {
            materialTransport: item,
        })
    }

    return {
        transportVehicle,
        materialTransports,
        isLoadingList,
        user,
        workRoutes,
        handlerClickNewButton,
    }
}
