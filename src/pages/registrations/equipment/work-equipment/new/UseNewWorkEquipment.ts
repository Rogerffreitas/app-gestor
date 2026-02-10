import { useEffect, useState } from 'react'
import EquipmentDto from '../../../../../domin/entity/equipment/EquipmentDto'
import WorkDto from '../../../../../domin/entity/work/WorkDto'
import { WorkEquipmentServices } from '../../../../../domin/services/interfaces/WorkEquipmentServices'
import { useAuth } from '../../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../../services/VibrationService'
import { Alert } from 'react-native'
import { EquipmentServices } from '../../../../../domin/services/interfaces/EquipmentServices'
import WorkEquipmentDto from '../../../../../domin/entity/work-equipment/WorkEquipmentDto'
import { StrictBuilder } from '../../../../../services/StrictBuilder'
import { UserAction } from '../../../../../types'

type NewWorkEquipmentProps = {
    work: WorkDto
    navigation: any
    equipmentServices: EquipmentServices
    workEquipmentServices: WorkEquipmentServices
    equipmentsSelectedIds: string[]
}

export default function useNewWorkEquipment({
    work,
    workEquipmentServices,
    equipmentsSelectedIds,
    equipmentServices,
    navigation,
}: NewWorkEquipmentProps) {
    const [selectedWorkEquipments, setSelectedWorkEquipments] = useState<WorkEquipmentDto[]>([])
    const [equipments, setEquipments] = useState<EquipmentDto[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const { user } = useAuth()
    const [syncState, setSyncState] = useState<boolean>(false)
    const [load, setLoad] = useState(true)
    const [errors, setErrors] = useState({
        proprietatyName: '',
        cpfCnpj: '',
        tel: '',
        startRental: '',
        monthlyPayment: '',
        valuePerHourKm: '',
        valuePerDay: '',
        operatorMotorist: '',
        isEquipment: '',
        modelOrPlate: '',
        hourMeterOrOdometer: '',
    })

    async function handlerSubmitButton() {
        try {
            setIsLoading(true)
            const createdEntities = selectedWorkEquipments.map((dto) => {
                return workEquipmentServices.createWorkEquipmentInLocalDatabase(dto, changeErrorFields)
            })
            await Promise.all(createdEntities)
            successVibration()
            Alert.alert('Equipamento(s) Cadastrado(s) na obra')
            navigation.goBack()
        } catch (error) {
            console.log(error)
            Alert.alert('Ocorreu um erro ao tentar salvar a lista', error.massage)
        } finally {
            setIsLoading(false)
        }
    }

    async function loadAllEquipmet() {
        navigation.addListener('focus', () => setLoad(!load))
        try {
            /*await equipmentServices.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                user.enterpriseId
            )*/

            //usar somente para teste

            const allEquipments = await equipmentServices.loadAllEquipmentByEnterpriseIdFromLocalDatabase(
                user.enterpriseId
            )

            const equipmentList = allEquipments.filter((item) => !equipmentsSelectedIds.includes(item.id))

            setEquipments(equipmentList)
        } catch (error) {
            console.log(error)
            Alert.alert('Ocorreu um erro ao carregar lista', error.massage)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        loadAllEquipmet()
    }, [load])

    function handleSelectEquipment(item: EquipmentDto) {
        let existingIndex = selectedWorkEquipments.findIndex((i) => i.equipment.id == item.id)

        let filteredEquipment: WorkEquipmentDto[]

        if (existingIndex != -1) {
            filteredEquipment = selectedWorkEquipments.filter((_, index) => index !== existingIndex)
        } else {
            const newWorkEquipment = StrictBuilder<WorkEquipmentDto>()
                .equipment(item)
                .hourMeterOrOdometer(item.hourMeterOrOdometer)
                .startRental(item.startRental)
                .monthlyPayment(item.monthlyPayment)
                .valuePerDay(item.valuePerDay)
                .valuePerHourKm(item.valuePerHourKm)
                .operatorMotorist(item.operatorMotorist)
                .workId(work.id)
                .serverId(0)
                .userId(user.id)
                .userAction(UserAction.CREATE)
                .enterpriseId(user.enterpriseId)
                .isValid(true)
                .build()
            filteredEquipment = [...selectedWorkEquipments, newWorkEquipment]
        }
        setSelectedWorkEquipments(filteredEquipment)
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErrors((state) => ({ ...state, [name]: value }))
        }
    }

    /* async function sincronizar() {
            setSyncState(true)
            ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
            setTimeout(function () {
                sync(token, Config.urlApi, signOut)
                    .then(() => {
                        setSyncState(false)
    
                        Config.lastConectionServer = Date.now()
                    })
                    .catch((err) => {
                        console.log('sync:' + err)
                        setSyncState(false)
                    })
            }, 3000)
        }*/

    return {
        equipments,
        selectedWorkEquipments,
        isLoading,
        isLoadingList,
        handlerSubmitButton,
        handleSelectEquipment,
    }
}
