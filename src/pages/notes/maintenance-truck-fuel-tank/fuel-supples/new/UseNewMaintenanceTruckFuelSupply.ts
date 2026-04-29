import { useEffect, useState } from 'react'
import { FuelSupplyTypes, RootStackParamList, ScreenNames } from '../../../../../types'
import TransportVehicleDto from '@gestor/domain/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '@gestor/domain/entity/work-equipment/WorkEquipmentDto'
import { useAuth } from '../../../../../contexts/AuthContext'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../../services/VibrationService'
import { FuelSupplyDto } from '@gestor/domain/entity/fuel-supply/FuelSupplyDto'
import { StrictBuilder } from '../../../../../services/StrictBuilder'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewMaintenanceTruckFuelSupplyProp = RouteProp<
    RootStackParamList,
    ScreenNames.NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY
>

export default function useNewMaintenanceTruckFuelSupply() {
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const fuelSupplyServices = useInjection('FuelSupplyServices')
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const route = useRoute<NewMaintenanceTruckFuelSupplyProp>()
    const { maintenanceTruck, type, workId } = route.params
    const navigation = useNavigation()

    const [isLoadingList, setIsLoadingList] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [transportVehicle, setTransportVehicle] = useState<TransportVehicleDto>()
    const [workEquipment, setWorkEquipment] = useState<WorkEquipmentDto>()
    const [dataList, setDataList] = useState<WorkEquipmentDto[] | TransportVehicleDto[]>()
    const { user } = useAuth()

    const [erros, setErros] = useState({
        quantity: '',
        valuePerLiter: '',
        hourMeterOrOdometer: '',
        description: '',
    })
    const [form, setForm] = useState({
        quantity: null,
        valuePerLiter: null,
        description: null,
        observation: null,
        isGasStation: true,
        hourMeterOrOdometer: null,
        isDiscount: true,
        isVisible: false,
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    async function loadData() {
        try {
            const lastSupplyPromise =
                fuelSupplyServices.loadLastSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    user.enterpriseId,
                    workId,
                    maintenanceTruck.id
                )

            if (type === FuelSupplyTypes.EQUIPMENT) {
                navigation.setOptions({ title: 'Escolha um equipamento' })
                const [lastSupply, equipments] = await Promise.all([
                    lastSupplyPromise,
                    workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        workId
                    ),
                ])
                setDataList(equipments)

                if (lastSupply) {
                    setForm((state) => ({
                        ...state,
                        valuePerLiter: lastSupply.valuePerLiter,
                        description: lastSupply.description,
                    }))
                }
            }

            if (type === FuelSupplyTypes.TRANSPORT_VEHICLE) {
                navigation.setOptions({ title: 'Escolha uma caçamba' })
                const [lastSupply, vehicles] = await Promise.all([
                    lastSupplyPromise,
                    transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        workId
                    ),
                ])
                setDataList(vehicles)
                if (lastSupply) {
                    setForm((state) => ({
                        ...state,
                        valuePerLiter: lastSupply.valuePerLiter,
                        description: lastSupply.description,
                    }))
                }
            }
        } catch (error) {
            console.error(error)
            errorVibration()
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickItemTransportVehicle(item: TransportVehicleDto) {
        setForm((state) => ({ ...state, isVisible: true }))
        navigation.setOptions({ title: 'Abastecimento (Caçamba)' })
        setTransportVehicle(item)
    }

    function handleClickItemWorkEquipment(item: WorkEquipmentDto) {
        setForm((state) => ({ ...state, isVisible: true }))
        navigation.setOptions({ title: 'Abastecimento (Equipamento)' })
        setWorkEquipment(item)
    }

    async function handleSubmitButton() {
        if (!Object.values(FuelSupplyTypes).includes(type as FuelSupplyTypes)) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            setIsLoading(true)

            const fuelSupply = StrictBuilder<FuelSupplyDto>()
                .description(form.description)
                .hourMeterOrOdometer(form.hourMeterOrOdometer)
                .isDiscount(false)
                .isGasStation(false)
                .quantity(form.quantity)
                .observation(form.observation)
                .transportVehicleOrWorkEquipmentId(
                    type === FuelSupplyTypes.EQUIPMENT ? workEquipment.id : transportVehicle.id
                )
                .supplyType(type as FuelSupplyTypes)
                .maintenanceTrucksWorkEquipmentId(maintenanceTruck.id)
                .valuePerLiter(form.valuePerLiter)
                .workId(workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const response = await fuelSupplyServices.createFuelSupplyInLocalDatabase(
                fuelSupply,
                changeErrorFields
            )

            if (response.id) {
                successVibration()
                //sincronizar()

                Alert.alert('Abastecimento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o abastecimento', `${error}`)
            errorVibration()
        } finally {
            setIsLoading(false)
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setForm((state) => ({ ...state, [name]: value }))
            setErros((state) => ({ ...state, [name]: null }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }

    return {
        isLoadingList,
        isLoading,
        form,
        erros,
        dataList,
        navigation,
        type,
        actions: {
            onChange,
            handleSubmitButton,
            handleClickItemTransportVehicle,
            handleClickItemWorkEquipment,
        },
    }
}
