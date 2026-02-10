import { useEffect, useState } from 'react'
import { WorkRoutesServices } from '../../../domin/services/interfaces/WorkRoutesServices'
import { DepositServices } from '../../../domin/services/interfaces/DepositServices'
import WorkDto from '../../../domin/entity/work/WorkDto'
import WorkRoutesDto from '../../../domin/entity/work-routes/WorkRoutesDto'

type RoutesListProps = {
    workRoutesServices: WorkRoutesServices
    depositServices: DepositServices
    work: WorkDto
    navigation: any
}

export function useRoutesList({ navigation, workRoutesServices, work, depositServices }: RoutesListProps) {
    const [routes, setRoutes] = useState<WorkRoutesDto[]>([])
    const [load, setLoad] = useState(true)
    const [loadingList, setLoadingList] = useState(true)

    const getAll = async () => {
        const result = await workRoutesServices.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
            work.enterpriseId,
            work.id
        )
        setRoutes(result)
        setLoadingList(false)
    }

    useEffect(() => {
        navigation.addListener('focus', () => setLoad(!load))
        getAll()
    }, [load])

    function handleClickEditButton(item: WorkRoutesDto) {
        navigation.navigate('Edit Route', {
            work: work,
            workRoute: item,
            workRoutesServices: workRoutesServices,
        })
    }

    function handleClintNewButton() {
        navigation.navigate('New Route', { work, workRoutesServices, depositServices })
    }

    return {
        routes,
        loadingList,
        handleClickEditButton,
        handleClintNewButton,
    }
}
