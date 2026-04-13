import { Alert, ToastAndroid } from 'react-native'
import { MaterialServices } from '../../../../domin/services/interfaces/MaterialServices'
import { MaterialDto } from '../../../../domin/entity/material/MaterialDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { Reference, RootStackParamList, ScreenNames } from '../../../../types'
import { useState } from 'react'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { useSync } from '../../../../infra/hooks/UseSync'

type EditMaterialProp = RouteProp<RootStackParamList, ScreenNames.EDIT_MATERIAL>

export default function useEditMaterial() {
    const materialServices = useInjection<MaterialServices>('MaterialServices')
    const navigation = useNavigation()
    const route = useRoute<EditMaterialProp>()
    const { material } = route.params
    const { performSync } = useSync()

    const [states, setStates] = useState({
        material: material,
        name: material.name,
        density: material.density,
        value: material.value,
        isLoading: false,
        volume: material.referenceMaterialCalculation === Reference.VOLUME ? true : false,
        weight: material.referenceMaterialCalculation === Reference.WEIGHT ? true : false,
        reference: Reference.VOLUME,
    })
    const [erros, setErros] = useState({
        name: '',
        density: '',
        value: '',
    })

    const { user } = useAuth()

    async function handleClickEditButton() {
        if (material.id == null) {
            Alert.alert('Error')
            errorVibration()
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))
            await materialServices.updateMaterialInLocalDatabase(
                StrictBuilder<MaterialDto>()
                    .id(material.id)
                    .name(states.name)
                    .density(+states.density)
                    .value(states.value)
                    .referenceMaterialCalculation(states.reference)
                    .userId(user.id)
                    .depositId(material.depositId)
                    .enterpriseId(material.enterpriseId)
                    .build(),
                changeErrorFields
            )
            Alert.alert('Material Editado')
            successVibration()
            performSync()
            navigation.goBack()
        } catch (error) {
            console.log(error)
            setStates((state) => ({ ...state, isLoading: false }))
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar atualizar o Material', 'Menssagem: ' + error)
            errorVibration()
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

    async function handleClickDeleteButton() {
        setStates((state) => ({ ...state, isLoading: true }))
        try {
            if (material.id == null) {
                Alert.alert('Error')
                navigation.goBack()
            }
            await materialServices.deleteMaterialInLocalDatabase(material.id, user.id)

            Alert.alert('Material Apagado')
            navigation.goBack()
        } catch (error) {
            console.log(error)

            Alert.alert('Erro ao tentar apagar o material', error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    const showConfirmDialog = () => {
        return Alert.alert('Deseja apagar o Material?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    handleClickDeleteButton()
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
            handleClickEditButton,
            showConfirmDialog,
            onChange,
        },
    }
}
