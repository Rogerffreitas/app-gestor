import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { FuelSupplyDto } from '@gestor/domain/entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyTypes, RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSync } from '@/src/infra/hooks/UseSync'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewFuelSupplyProp = RouteProp<RootStackParamList, ScreenNames.NEW_FUEL_SUPPLY>

export default function useNewFuelSupply() {
    const fuelSupplyServices = useInjection('FuelSupplyServices')
    const route = useRoute<NewFuelSupplyProp>()
    const { type, transportVehicleOrWorkEquipmentId, workId } = route.params
    const navigation = useNavigation()
    const { performSync } = useSync()

    const { user } = useAuth()
    const [erros, setErros] = useState({
        quantity: '',
        valuePerLiter: '',
        hourMeterOrOdometer: '',
        description: '',
    })

    const [states, setStates] = useState({
        isLoading: false,
        quantity: null,
        valuePerLiter: null,
        description: null,
        observation: null,
        isGasStation: true,
        hourMeterOrOdometer: null,
        isDiscount: true,
    })

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
            setStates((state) => ({ ...state, isLoading: true }))

            const fuelSupply = StrictBuilder<FuelSupplyDto>()
                .description(states.description)
                .hourMeterOrOdometer(states.hourMeterOrOdometer)
                .isDiscount(states.isDiscount)
                .isGasStation(true)
                .quantity(states.quantity)
                .observation(states.observation)
                .transportVehicleOrWorkEquipmentId(transportVehicleOrWorkEquipmentId)
                .supplyType(type as FuelSupplyTypes)
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
                performSync()
                Alert.alert('Equipamento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o equipamento', error)
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
        type,
        actions: {
            setStates,
            onChange,
            handleSubmitButton,
        },
    }
}
