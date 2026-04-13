import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import DiscountDto from '../../../../domin/entity/discount/DiscountDto'
import { DiscountServices } from '../../../../domin/services/interfaces/DiscountServices'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { InvoiceStatus, RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { useSync } from '@/src/infra/hooks/UseSync'

type EditDiscountProp = RouteProp<RootStackParamList, ScreenNames.EDIT_DISCOUNTS>

export default function useEditDiscount() {
    const discountServices = useInjection<DiscountServices>('DiscountServices')
    const route = useRoute<EditDiscountProp>()
    const { discountId } = route.params
    const navigation = useNavigation()
    const { performSync } = useSync()

    const { user } = useAuth()
    const [states, setStates] = useState({
        discount: null as DiscountDto,
        description: '',
        value: 0,
        isLoading: false,
        isLoadDto: false,
    })

    const [erros, setErros] = useState({
        description: null,
        value: null,
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    async function loadData() {
        try {
            const result = await discountServices.findDiscountByIdInLocalDatabase(discountId)
            setStates((states) => ({
                ...states,
                isLoadDto: false,
                discount: result,
                description: result.description,
                value: result.value,
            }))
        } catch (error) {
            console.error(error)
            errorVibration()
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            setStates((states) => ({ ...states, isLoadDto: false }))
        }
    }

    async function handleSubmitButton() {
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const discount = StrictBuilder<DiscountDto>()
                .id(states.discount.id)
                .description(states.description)
                .value(states.value)
                .transportVehicleOrWorkEquipmentId(states.discount.transportVehicleOrWorkEquipmentId)
                .discountType(states.discount.discountType)
                .workId(states.discount.workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const response = await discountServices.updateDiscountInLocalDatabase(discount, changeErrorFields)

            if (response.id) {
                successVibration()
                performSync()
                Alert.alert('Disconto Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)

            if (error.message == 'Entity validation failed') {
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

    async function deleteDiscount() {
        try {
            if (states.discount.invoiceId == 0 || states.discount.invoiceStatus == InvoiceStatus.PENDING) {
                await discountServices.deleteDiscountInLocalDatabase(states.discount.id, user.id)
                Alert.alert('Desconto Apagado')
                successVibration()
                navigation.goBack()
            } else {
                Alert.alert('Não é possível apagar o Desconto', 'Existe uma fatura em aberto')
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Erro ao tentar apagar o desconto', `Menssagem: ${error}`)
            errorVibration()
        }
    }

    function showConfirmDialog() {
        return Alert.alert('Deseja apagar o Desconto?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteDiscount()
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
            handleSubmitButton,
            showConfirmDialog,
        },
    }
}
