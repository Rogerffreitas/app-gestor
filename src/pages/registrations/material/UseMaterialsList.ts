import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { MaterialDto } from '../../../domin/entity/material/MaterialDto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../types'
import { ToastAndroid } from 'react-native'
import { useInjection } from '@/src/contexts/InjectionContext'

type MaterialsListProp = RouteProp<RootStackParamList, ScreenNames.MATERIALS>

export default function useMaterialsList() {
    const materialServices = useInjection('MaterialServices')
    const navigation = useNavigation()
    const route = useRoute<MaterialsListProp>()
    const { depositId } = route.params
    const { user } = useAuth()
    const [states, setStates] = useState({
        isLoadingList: true,
        materials: [] as MaterialDto[],
    })

    async function loadAll() {
        try {
            const results = await materialServices.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
                user.enterpriseId,
                depositId
            )
            setStates((state) => ({ ...state, materials: results }))
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Erro ao carregar lista', ToastAndroid.LONG)
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [navigation])

    function handleClickEditButton(item: MaterialDto) {
        navigation.navigate(ScreenNames.EDIT_MATERIAL, { material: item })
    }

    function handleClickNewButton() {
        navigation.navigate(ScreenNames.NEW_MATERIAL, { depositId: depositId })
    }

    return {
        states,
        actions: {
            handleClickEditButton,
            handleClickNewButton,
        },
    }
}
