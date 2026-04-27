import { useState } from 'react'
import { useAuth } from '../../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../../services/StrictBuilder'
import { FuelSupplyDto } from '@domin/entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyTypes, RootStackParamList, ScreenNames } from '../../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type MaintenanceTruckRefuelTankProp = RouteProp<
    RootStackParamList,
    ScreenNames.NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY
>

export default function useNewMaintenanceTruckRefuelSupply() {
    const fuelSupplyServices = useInjection('FuelSupplyServices')
    const route = useRoute<MaintenanceTruckRefuelTankProp>()
    const { maintenanceTruck, workId } = route.params
    const navigation = useNavigation()

    const { user } = useAuth()
    const [erros, setErros] = useState({
        quantity: '',
        valuePerLiter: '',
        hourMeterOrKmMeter: '',
        description: '',
    })

    const [states, setStates] = useState({
        isLoading: false,
        quantity: null,
        valuePerLiter: null,
        description: null,
        observation: null,
        isGasStation: true,
        hourMeterOrKmMeter: null,
        isDiscount: true,
    })

    async function handleSubmitButton() {
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const fuelSupply = StrictBuilder<FuelSupplyDto>()
                .description(states.description)
                .hourMeterOrOdometer(states.hourMeterOrKmMeter)
                .isDiscount(states.isDiscount)
                .isGasStation(true)
                .quantity(states.quantity)
                .observation(states.observation)
                .transportVehicleOrWorkEquipmentId(maintenanceTruck.workEquipmentId)
                .maintenanceTrucksWorkEquipmentId(maintenanceTruck.id)
                .supplyType(FuelSupplyTypes.MAINTENANCE_TRUCK_TANK)
                .valuePerLiter(states.valuePerLiter)
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
            Alert.alert('Erro ao tentar salvar o Abastecimento', error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setStates((state) => ({ ...state, [name]: value }))
            setErros((state) => ({ ...state, [name]: null }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }
    return {
        erros,
        states,
        actions: {
            setStates,
            onChange,
            handleSubmitButton,
        },
    }
}
