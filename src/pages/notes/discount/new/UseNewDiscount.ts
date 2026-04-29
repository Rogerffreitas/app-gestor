import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { DiscountTypes, RootStackParamList, ScreenNames } from '../../../../types'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import DiscountDto from '@gestor/domain/entity/discount/DiscountDto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewDiscountProp = RouteProp<RootStackParamList, ScreenNames.NEW_DISCOUNTS>

export default function useNewDiscount() {
    const discountServices = useInjection('DiscountServices')
    const route = useRoute<NewDiscountProp>()
    const { type, transportVehicleOrWorkEquipmentId, workId } = route.params
    const navigation = useNavigation()

    const [states, setStates] = useState({
        description: null,
        value: null,
        isLoading: false,
    })

    const [erros, setErros] = useState({
        description: null,
        value: null,
    })
    const { user } = useAuth()

    async function handleSubmitButton() {
        if (!Object.values(DiscountTypes).includes(type as DiscountTypes)) {
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

            const discount = StrictBuilder<DiscountDto>()
                .description(states.description)
                .value(states.value)
                .transportVehicleOrWorkEquipmentId(transportVehicleOrWorkEquipmentId)
                .discountType(type as DiscountTypes)
                .workId(workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const response = await discountServices.createDiscountInLocalDatabase(discount, changeErrorFields)

            if (response.id) {
                successVibration()
                //sincronizar()
                Alert.alert('Disconto Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            if (error?.message?.includes('Entity validation failed')) {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o desconto', `Menssagem: ${error}`)
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
        states,

        erros,
        actions: {
            onChange,
            handleSubmitButton,
        },
    }
}
