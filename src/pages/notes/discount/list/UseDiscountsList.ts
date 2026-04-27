import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import DiscountDto from '@domin/entity/discount/DiscountDto'
import { errorVibration } from '../../../../services/VibrationService'
import { Alert } from 'react-native'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { useInjection } from '@/src/contexts/InjectionContext'

type DiscountsListProp = RouteProp<RootStackParamList, ScreenNames.DISCOUNTS_LIST>

export default function useDiscountsList() {
    const discountServices = useInjection('DiscountServices')
    const route = useRoute<DiscountsListProp>()
    const { type, transportVehicleOrWorkEquipmentId, workId } = route.params
    const navigation = useNavigation()
    const { user } = useAuth()
    const [states, setStates] = useState({
        isLoadingList: true,
        discounts: [] as DiscountDto[],
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    async function loadData() {
        try {
            const result = await discountServices.loadAllDiscountByEnterpriseIdAndWorkIdFromLocalDatabase(
                user.enterpriseId,
                workId,
                type,
                transportVehicleOrWorkEquipmentId
            )
            setStates((state) => ({ ...state, isLoadingList: false, discounts: result }))
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            errorVibration()
            console.error(error)
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    function handlerClickNewButton() {
        navigation.navigate(ScreenNames.NEW_DISCOUNTS, {
            workId: workId,
            transportVehicleOrWorkEquipmentId: transportVehicleOrWorkEquipmentId,
            type: type,
        })
    }
    function handleClickEditButton(discountDto: DiscountDto) {
        navigation.navigate(ScreenNames.EDIT_DISCOUNTS, {
            discountId: discountDto.id,
        })
    }
    return {
        states,
        actions: {
            handlerClickNewButton,
            handleClickEditButton,
        },
    }
}
