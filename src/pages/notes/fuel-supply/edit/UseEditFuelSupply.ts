import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { InvoiceStatus, RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSync } from '@/src/infra/hooks/UseSync'
import { useInjection } from '@/src/contexts/InjectionContext'

type EditFuelSupplyProp = RouteProp<RootStackParamList, ScreenNames.EDIT_FUEL_SUPPLY>

export default function useEditFuelSupply() {
    const fuelSupplyServices = useInjection('FuelSupplyServices')
    const route = useRoute<EditFuelSupplyProp>()
    const { fuelSupply } = route.params
    const navigation = useNavigation()
    const { performSync } = useSync()
    const { user } = useAuth()

    const [erros, setErros] = useState({
        quantity: '',
        valuePerLiter: '',
        value: '',
        hourMeterOrOdometer: '',
        description: '',
    })

    const [states, setStates] = useState({
        isLoading: false,
        quantity: fuelSupply.quantity,
        valuePerLiter: fuelSupply.valuePerLiter,
        description: fuelSupply.description,
        observation: fuelSupply.observation,
        isGasStation: fuelSupply.isGasStation,
        hourMeterOrOdometer: fuelSupply.hourMeterOrOdometer,
        isDiscount: fuelSupply.isDiscount,
        supplyType: fuelSupply.supplyType,
        type: fuelSupply.supplyType,
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
                    .id(fuelSupply.id)
                    .description(states.description)
                    .hourMeterOrOdometer(states.hourMeterOrOdometer)
                    .isDiscount(states.isDiscount)
                    .isGasStation(fuelSupply.isGasStation)
                    .quantity(states.quantity)
                    .observation(states.observation)
                    .transportVehicleOrWorkEquipmentId(fuelSupply.transportVehicleOrWorkEquipmentId)
                    .supplyType(fuelSupply.supplyType)
                    .valuePerLiter(states.valuePerLiter)
                    .workId(fuelSupply.workId)
                    .userId(user.id)
                    .enterpriseId(user.enterpriseId)
                    .build(),
                changeErrorFields
            )

            if (response.id) {
                successVibration()
                performSync()
                Alert.alert('Equipamento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            if (error.message.includes('Entity validation failed')) {
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
        return Alert.alert('Deseja apagar o Abastecimento?', 'Para confirmar pressione sim?', [
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
        actions: {
            onChange,
            handleEditButton,
            showConfirmDialog,
            setStates,
        },
    }
}
