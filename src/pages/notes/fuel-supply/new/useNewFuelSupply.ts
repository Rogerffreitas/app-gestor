import { useState } from 'react'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'

type UseNEwFuelSupplyProps = {
    fuelSupplyServices: FuelSupplyServices
    workId: string
    transportVehicleOrWorkEquipmentId: string
    type: string
    navigation
}

export default function useNewFuelSupply({
    navigation,
    workId,
    transportVehicleOrWorkEquipmentId,
    fuelSupplyServices,
    type,
}: UseNEwFuelSupplyProps) {
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
                .hourMeterOrKmMeter(states.hourMeterOrKmMeter)
                .isDiscount(states.isDiscount)
                .isGasStation(true)
                .quantity(states.quantity)
                .observation(states.observation)
                .transportVehicleOrWorkEquipmentId(transportVehicleOrWorkEquipmentId)
                .type(type)
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
                Alert.alert('Equipamento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)

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
        setStates,
        onChange,
        handleSubmitButton,
    }
}
