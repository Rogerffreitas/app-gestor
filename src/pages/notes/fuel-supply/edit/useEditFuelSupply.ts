import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { InvoiceStatus } from '../../../../types'

type UseEditFuelSupplyProps = {
    fuelSupplyServices: FuelSupplyServices
    fuelSupply: FuelSupplyDto
    navigation
}

export default function useEditFuelSupply({
    navigation,
    fuelSupply,
    fuelSupplyServices,
}: UseEditFuelSupplyProps) {
    const { user } = useAuth()

    const [erros, setErros] = useState({
        quantity: '',
        valuePerLiter: '',
        value: '',
        hourMeterOrKmMeter: '',
        description: '',
    })

    const [states, setStates] = useState({
        isLoading: false,
        quantity: fuelSupply.quantity,
        valuePerLiter: fuelSupply.valuePerLiter,
        description: fuelSupply.description,
        observation: fuelSupply.observation,
        isGasStation: fuelSupply.isGasStation,
        hourMeterOrKmMeter: fuelSupply.hourMeterOrKmMeter,
        isDiscount: fuelSupply.isDiscount,
        type: fuelSupply.type,
    })

    async function handleEditButton() {
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const response = await fuelSupplyServices.updateFuelSupplyInLocalDatabase(
                StrictBuilder<FuelSupplyDto>()
                    .description(states.description)
                    .hourMeterOrKmMeter(states.hourMeterOrKmMeter)
                    .isDiscount(states.isDiscount)
                    .isGasStation(true)
                    .quantity(states.quantity)
                    .observation(states.observation)
                    .transportVehicleOrWorkEquipmentId(fuelSupply.transportVehicleOrWorkEquipmentId)
                    .type(fuelSupply.type)
                    .valuePerLiter(states.valuePerLiter)
                    .workId(fuelSupply.workId)
                    .userId(user.id)
                    .enterpriseId(user.enterpriseId)
                    .build(),
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

    async function deleteFuelSupply() {
        if (fuelSupply.invoiceId == 0 || fuelSupply.invoiceStatus == InvoiceStatus.PENDING) {
            await fuelSupplyServices.deleteFuelSupplyInLocalDatabase(fuelSupply.id, user.id)
            Alert.alert('Abastecimento apagado')
            navigation.goBack()
        } else {
            Alert.alert('Não é possível apagar o Abastecimento', 'Existe uma fatura em aberto')
        }
    }

    function showConfirmDialog() {
        return Alert.alert('Deseja apagar o Desconto?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteFuelSupply()
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }
    return {
        states,
        erros,
        onChange,
        handleEditButton,
        showConfirmDialog,
        setStates,
    }
}
