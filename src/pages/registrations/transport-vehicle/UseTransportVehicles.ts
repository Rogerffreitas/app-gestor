import { useEffect, useState } from 'react'
import { TransportVehicleServices } from '../../../domin/services/interfaces/TransportVehicleServices'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { useAuth } from '../../../contexts/AuthContext'
import { ScreenNames } from '../../../types'
import { WorkServices } from '../../../domin/services/interfaces/WorkServices'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'

type UseTransportVehiclesListProps = {
    workServices: WorkServices
    transportVehicleServices: TransportVehicleServices
    navigation
}

export default function useTransportVehiclesList({
    navigation,
    transportVehicleServices,
    workServices,
}: UseTransportVehiclesListProps) {
    const [works, setWorks] = useState<WorkDto[]>([])
    const [work, setWork] = useState<WorkDto>(null)
    const [transportVehicles, setTransportVehicles] = useState<TransportVehicleDto[]>([])
    const { user } = useAuth()
    const [isLoad, setIsLoad] = useState(true)
    const [isLoadingList, setIsLoadingList] = useState(true)

    async function loadAll() {
        try {
            navigation.addListener('focus', () => setIsLoad(!isLoad))
            const result = await workServices.loadWorkListFromDatabase(user.enterpriseId, user.id, user.role)
            setWorks(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        if (work) {
            loadAllTranpostVehicles(work)
            return
        }
        loadAll()
    }, [isLoad])

    async function loadAllTranpostVehicles(item: WorkDto) {
        try {
            navigation.addListener('focus', () => setIsLoad(!isLoad))
            const result =
                await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    item.id
                )
            setTransportVehicles(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickEditButton(item: TransportVehicleDto) {
        navigation.navigate(ScreenNames.EDIT_TRANSPORT_VEHICLE, {
            transportVehicle: item,
            transportVehicleServices: transportVehicleServices,
        })
    }

    function handleClickEditBankInfo(item: TransportVehicleDto): void {
        navigation.navigate(ScreenNames.BANK_INFO_TRANSPORT_VEHICLE, {
            transportVehicle: item,
            transportVehicleServices: transportVehicleServices,
        })
    }

    function handleClickNewButton() {
        navigation.navigate(ScreenNames.NEW_TRANSPORT_VEHICLE, {
            work: work,
            transportVehicleServices: transportVehicleServices,
        })
    }

    function handleSelectWork(workSelected: WorkDto) {
        navigation.setOptions({ title: 'Lista de Caçambas' })
        setIsLoadingList(true)
        setWork(workSelected)
        loadAllTranpostVehicles(workSelected)
    }

    function handleClickSelectedWork() {
        setWork(null)
        navigation.setOptions({ title: 'Escolha uma obra!' })
    }

    return {
        works,
        work,
        transportVehicles,
        isLoadingList,
        loadAllTranpostVehicles,
        handleClickNewButton,
        handleClickEditBankInfo,
        handleClickEditButton,
        setIsLoadingList,
        handleClickSelectedWork,
        handleSelectWork,
    }
}
