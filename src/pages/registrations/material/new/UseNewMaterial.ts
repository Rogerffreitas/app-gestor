import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { MaterialDto } from '@domin/entity/material/MaterialDto'
import { Reference, RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'
import { useSync } from '@/src/infra/hooks/UseSync'

type NewMaterialProp = RouteProp<RootStackParamList, ScreenNames.NEW_MATERIAL>

export default function useNewMaterial() {
    const materialServices = useInjection('MaterialServices')
    const navigation = useNavigation()
    const route = useRoute<NewMaterialProp>()
    const { performSync } = useSync()
    const { depositId } = route.params
    const [states, setStates] = useState({
        name: '',
        density: 0,
        value: 0,
        isLoading: false,
        syncState: false,
        volume: true,
        weight: false,
        reference: Reference.VOLUME,
    })
    const [erros, setErros] = useState({
        name: '',
        density: '',
        inflation: '',
        value: '',
    })

    const { user } = useAuth()

    async function handleSubmitButton() {
        if (user.id == null || user.enterpriseId == null || depositId == null) {
            Alert.alert('Error')
            errorVibration()
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))
            const response = await materialServices.createMaterialInLocalDatabase(
                StrictBuilder<MaterialDto>()
                    .name(states.name)
                    .density(+states.density)
                    .depositId(depositId)
                    .referenceMaterialCalculation(states.reference)
                    .value(+states.value)
                    .enterpriseId(user.enterpriseId)
                    .userId(user.id)
                    .build(),
                changeErrorFields
            )
            if (response.id) {
                Alert.alert('Material Cadastrado')
                performSync()
                successVibration()
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o Material', 'Menssagem: ' + error)
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

    return { states, erros, actions: { handleSubmitButton, onChange } }
}
