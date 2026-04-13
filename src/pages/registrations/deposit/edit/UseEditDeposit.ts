import { useState } from 'react'
import { DepositServices } from '../../../../domin/services/interfaces/DepositServices'
import DepositDto from '../../../../domin/entity/deposit/DepositDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { SyncServices } from '../../../../domin/services/interfaces/SyncService'

type EditDepositProp = RouteProp<RootStackParamList, ScreenNames.EDIT_DEPOSIT>

export default function useEditDeposit() {
    const depositServices = useInjection<DepositServices>('DepositServices')
    const syncServices = useInjection<SyncServices>('SyncServices')
    const navigation = useNavigation()
    const route = useRoute<EditDepositProp>()
    const { deposit } = route.params

    const [states, setStates] = useState({
        name: deposit.name,
        description: deposit.description,
        isLoading: false,
        isSynchronizing: false,
    })
    const [erros, setErros] = useState({
        name: '',
        description: '',
    })

    const { user } = useAuth()

    async function handleSubmitButton() {
        if (deposit.id == null) {
            Alert.alert('Error')
            errorVibration()
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))
            await depositServices.updateDepositInLocalDatabase(
                StrictBuilder<DepositDto>()
                    .id(deposit.id)
                    .name(states.name)
                    .description(states.description)
                    .userId(user.id)
                    .enterpriseId(deposit.enterpriseId)
                    .build(),
                changeErrorFields
            )

            Alert.alert('Jazida editada')
            //sincronizar()
            successVibration()
            navigation.goBack()
        } catch (error) {
            console.log(error.mesage)
            setStates((state) => ({ ...state, isLoading: false }))
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar a Jazida', 'Menssagem: ' + error)
            errorVibration()
        }
    }

    async function hadleClickDeleteButton() {
        if (deposit.id == null) {
            Alert.alert('Error')
            navigation.goBack()
        }
        await depositServices.deleteDepositInLocalDatabase(deposit.id, user.id)
        Alert.alert('Jazida apagada!')
        navigation.goBack()
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

    const showConfirmDialog = () => {
        return Alert.alert('Deseja apagar a Jazida?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    hadleClickDeleteButton()
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
            handleSubmitButton,
            showConfirmDialog,
            onChange,
        },
    }
}
