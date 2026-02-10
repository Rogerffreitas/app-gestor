import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { WorkServices } from '../../../domin/services/interfaces/WorkServices'
import { ToastAndroid } from 'react-native'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { UserServices } from '../../../domin/services/interfaces/UserServices'
import { DepositServices } from '../../../domin/services/interfaces/DepositServices'
import { WorkRoutesServices } from '../../../domin/services/interfaces/WorkRoutesServices'

type WorksListProps = {
    workServices: WorkServices
    userServices: UserServices
    depositServices: DepositServices
    workRoutesServices: WorkRoutesServices
    navigation: any
}

export function useWorksList({
    navigation,
    workServices,
    userServices,
    workRoutesServices,
    depositServices,
}: WorksListProps) {
    const [works, setWorks] = useState<WorkDto[]>([])
    const [loadingList, setLoadingList] = useState(true)
    const { user } = useAuth()
    const [load, setLoad] = useState(true)

    async function getAllWorks() {
        try {
            navigation.addListener('focus', () => setLoad(!load))
            const results = await workServices.loadWorkListFromDatabase(
                user.enterpriseId,
                user.username + '-' + user.id,
                user.role
            )
            setWorks(results)
            setLoadingList(false)
        } catch (error) {
            console.log(error)
            ToastAndroid.show('Erro ao carregar obras', ToastAndroid.LONG)
        } finally {
            setLoadingList(false)
        }
    }

    useEffect(() => {
        getAllWorks()
    }, [load])

    function handleClickItemList(item: WorkDto) {
        navigation.navigate('Work Routes', {
            work: item,
            workRoutesServices: workRoutesServices,
            depositServices: depositServices,
        })
    }

    function handleClickEditButton(item: WorkDto) {
        navigation.navigate('Edit Work', {
            work: item,
            workServices: workServices,
        })
    }

    function handleClintNewButton() {
        navigation.navigate('New Work', {
            workServices: workServices,
            userServices: userServices,
        })
    }

    return { works, loadingList, handleClickItemList, handleClickEditButton, handleClintNewButton }
}
