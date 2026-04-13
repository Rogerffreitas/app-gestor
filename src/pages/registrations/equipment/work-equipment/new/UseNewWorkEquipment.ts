import { useEffect, useState } from 'react'
import EquipmentDto from '../../../../../domin/entity/equipment/EquipmentDto'
import WorkDto from '../../../../../domin/entity/work/WorkDto'
import { WorkEquipmentServices } from '../../../../../domin/services/interfaces/WorkEquipmentServices'
import { useAuth } from '../../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../../services/VibrationService'
import { Alert } from 'react-native'
import { EquipmentServices } from '../../../../../domin/services/interfaces/EquipmentServices'
import WorkEquipmentDto from '../../../../../domin/entity/work-equipment/WorkEquipmentDto'
import { Builder } from '../../../../../services/Builder'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../../../types'
import { useInjection } from '../../../../../infra/hooks/useInjection'
import { WorkServices } from '../../../../../domin/services/interfaces/WorkServices'
import { useSync } from '@/src/infra/hooks/UseSync'

type NewWorkEquipmentProp = RouteProp<RootStackParamList, ScreenNames.WORK_EQUIPMENTS>

export default function useNewWorkEquipment() {
    const workEquipmentServices = useInjection<WorkEquipmentServices>('WorkEquipmentServices')
    const equipmentServices = useInjection<EquipmentServices>('EquipmentServices')
    const workServices = useInjection<WorkServices>('WorkServices')
    const navigation = useNavigation()
    const route = useRoute<NewWorkEquipmentProp>()
    const { workId, equipmentsSelectedIds } = route.params
    const [states, setStates] = useState({
        selectedWorkEquipments: [] as WorkEquipmentDto[],
        equipments: [] as EquipmentDto[],
        work: null as WorkDto,
        isLoadingList: true,
        isLoading: false,
        sync: false,
    })

    const { user } = useAuth()
    const { performSync } = useSync()

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
            setStates((state) => ({ ...state, isLoading: false }))
            const createdEntities = states.selectedWorkEquipments.map((dto) => {
                return workEquipmentServices.createWorkEquipmentInLocalDatabase(dto, changeErrorFields)
            })
            await Promise.all(createdEntities)
            successVibration()
            Alert.alert('Equipamento(s) Cadastrado(s) na obra')
            performSync()
            navigation.goBack()
        } catch (error) {
            console.log(error)
            Alert.alert('Ocorreu um erro ao tentar salvar a lista', error.massage)
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    async function loadAll() {
        try {
            const workPromise = workServices.findWorkByIdInLocalDatabase(workId)
            const equipmentsPromise =
                equipmentServices.loadAllEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId
                )
            const [work, equipmentsResults] = await Promise.all([workPromise, equipmentsPromise])
            const equipmentList = equipmentsResults.filter((item) => !equipmentsSelectedIds.includes(item.id))
            setStates((state) => ({ ...state, equipments: equipmentList }))
            setStates((state) => ({ ...state, work: work }))
        } catch (error) {
            console.log(error)
            Alert.alert('Ocorreu um erro ao carregar lista', error.massage)
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

    function handleSelectEquipment(item: EquipmentDto) {
        let existingIndex = states.selectedWorkEquipments.findIndex((i) => i.equipment.id == item.id)

        let filteredEquipment: WorkEquipmentDto[]

        if (existingIndex != -1) {
            filteredEquipment = states.selectedWorkEquipments.filter((_, index) => index !== existingIndex)
        } else {
            const newWorkEquipment = Builder<WorkEquipmentDto>()
                .equipment(item)
                .startRental(item.startRental)
                .monthlyPayment(item.monthlyPayment)
                .valuePerDay(item.valuePerDay)
                .valuePerHourKm(item.valuePerHourKm)
                .operatorMotorist(item.operatorMotorist)
                .workId(workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()
            filteredEquipment = [...states.selectedWorkEquipments, newWorkEquipment]
        }
        setStates((state) => ({ ...state, selectedWorkEquipments: filteredEquipment }))
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

    function goBack() {
        navigation.goBack()
    }

    return {
        states,
        actions: {
            goBack,
            handlerSubmitButton,
            handleSelectEquipment,
        },
    }
}
