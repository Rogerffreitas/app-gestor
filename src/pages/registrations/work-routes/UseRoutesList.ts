import { useEffect, useState } from 'react'
import WorkRoutesDto from '../../../domin/entity/work-routes/WorkRoutesDto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../types'
import { useAuth } from '../../../contexts/AuthContext'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { Alert } from 'react-native'
import { errorVibration } from '../../../services/VibrationService'
import { useInjection } from '@/src/contexts/InjectionContext'

type WorkRoutesProp = RouteProp<RootStackParamList, ScreenNames.WORK_ROUTES>

export function useRoutesList() {
    const workRoutesServices = useInjection('WorkRoutesServices')
    const workServices = useInjection('WorkServices')
    const route = useRoute<WorkRoutesProp>()
    const navigation = useNavigation()
    const { workId } = route.params
    const [routes, setRoutes] = useState<WorkRoutesDto[]>([])
    const [work, setWork] = useState<WorkDto>()
    const [loadingList, setLoadingList] = useState(true)
    const { user } = useAuth()

    const getAll = async () => {
        try {
            const workPromise = workServices.findWorkByIdInLocalDatabase(workId)
            const routesPromise =
                workRoutesServices.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    workId
                )

            const [workResult, routesResult] = await Promise.all([workPromise, routesPromise])

            setWork(workResult)
            setRoutes(routesResult)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setLoadingList(false)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAll()
        })
        return unsubscribe
    }, [navigation])

    function handleClickEditButton(item: WorkRoutesDto) {
        navigation.navigate(ScreenNames.EDIT_WORK_ROUTE, {
            workRoute: item,
        })
    }

    function handleClintNewButton() {
        navigation.navigate(ScreenNames.NEW_WORK_ROUTE, { workId })
    }

    function goBack() {
        navigation.goBack()
    }

    return {
        states: {
            routes,
            work,
            loadingList,
        },
        actions: {
            goBack,
            handleClickEditButton,
            handleClintNewButton,
        },
    }
}
