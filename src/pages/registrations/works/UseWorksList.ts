import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { WorkServices } from '../../../domin/services/interfaces/WorkServices'
import { ToastAndroid } from 'react-native'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '../../../types'
import { useInjection } from '../../../infra/hooks/useInjection'

export function useWorksList() {
    const workServices = useInjection<WorkServices>('WorkServices')
    const navigation = useNavigation()
    const { user } = useAuth()
    const [states, setStates] = useState({
        isLoadingList: true,
        works: [] as WorkDto[],
    })

    async function loadAll() {
        try {
            const results = await workServices.loadWorkListFromDatabase(
                user.enterpriseId,
                user.username + '-' + user.id,
                user.role
            )
            setStates((state) => ({ ...state, works: results }))
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Erro ao carregar obras', ToastAndroid.LONG)
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

    function handleClickItemList(item: WorkDto) {
        navigation.navigate(ScreenNames.WORK_ROUTES, {
            workId: item.id,
        })
    }

    function handleClickEditButton(item: WorkDto) {
        navigation.navigate(ScreenNames.EDIT_WORK, {
            work: item,
        })
    }

    function handleClintNewButton() {
        navigation.navigate(ScreenNames.NEW_WORK)
    }

    return {
        states,
        actions: { handleClickItemList, handleClickEditButton, handleClintNewButton },
    }
}
