import { useEffect, useState } from 'react'
import { DepositServices } from '../../../domin/services/interfaces/DepositServices'
import DepositDto from '../../../domin/entity/deposit/DepositDto'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '../../../types'
import { useInjection } from '../../../infra/hooks/useInjection'
import { ToastAndroid } from 'react-native'

export default function useDepositsList() {
    const depositServices = useInjection<DepositServices>('DepositServices')
    const navigation = useNavigation()
    const { user } = useAuth()
    const [states, setStates] = useState({
        isLoadingList: true,
        deposits: [] as DepositDto[],
    })

    async function loadAll() {
        try {
            const results = await depositServices.loadAllDepositByEnterpriseIdFromLocalDatabase(
                user.enterpriseId
            )
            setStates((state) => ({ ...state, deposits: results }))
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Erro ao carregar as Jazidas', ToastAndroid.LONG)
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

    function handleClickItemList(item: DepositDto) {
        navigation.navigate(ScreenNames.MATERIALS, {
            depositId: item.id,
        })
    }

    function handleClickNewButton() {
        navigation.navigate(ScreenNames.NEW_DEPOSIT)
    }

    function handleClickEditButton(item: DepositDto) {
        navigation.navigate(ScreenNames.EDIT_DEPOSIT, { deposit: item })
    }

    return {
        states,
        actions: {
            handleClickEditButton,
            handleClickNewButton,
            handleClickItemList,
        },
    }
}
