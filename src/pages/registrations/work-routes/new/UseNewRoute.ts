import { useEffect, useState } from 'react'
import { WorkRoutesServices } from '../../../../domin/services/interfaces/WorkRoutesServices'
import { DepositServices } from '../../../../domin/services/interfaces/DepositServices'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import DepositDto from '../../../../domin/entity/deposit/DepositDto'
import WorkRoutesDto from '../../../../domin/entity/work-routes/WorkRoutesDto'
import { RootStackParamList, ScreenNames, UserAction } from '../../../../types'
import { useAuth } from '../../../../contexts/AuthContext'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { WorkServices } from '../../../../domin/services/interfaces/WorkServices'
import { useInjection } from '../../../../infra/hooks/useInjection'

type NewWorkRouteProp = RouteProp<RootStackParamList, ScreenNames.NEW_WORK_ROUTE>

export default function useNewRoute() {
    const workRoutesServices = useInjection<WorkRoutesServices>('WorkRoutesServices')
    const depositServices = useInjection<DepositServices>('DepositServices')
    const workServices = useInjection<WorkServices>('WorkServices')
    const route = useRoute<NewWorkRouteProp>()
    const { workId } = route.params
    const navigation = useNavigation()
    const [states, setStates] = useState({
        arrivalLocation: '',
        departureLocation: '',
        km: 0,
        initialPicket: 0,
        value: 0,
        isFixedValue: false,
        isLoading: false,
        sync: false,
        depositsSelectedList: [],
        isLoadingList: true,
        deposits: [] as DepositDto[],
        deposit: {} as DepositDto,
        work: {} as WorkDto,
        selected: '',
    })
    const [erros, setErros] = useState({
        arrivalLocation: '',
        departureLocation: '',
        km: '',
        initialPicket: '',
        value: '',
        isFixedValue: '',
    })
    const { user } = useAuth()

    async function loadAll() {
        try {
            const worksPromise = workServices.findWorkByIdInLocalDatabase(workId)
            const depositsPromise = await depositServices.loadAllDepositByEnterpriseIdFromLocalDatabase(
                user.enterpriseId
            )

            const [workResult, depositsResult] = await Promise.all([worksPromise, depositsPromise])

            const deposits = depositsResult.map((item: DepositDto) => {
                return { key: item.id, value: item.name }
            })

            setStates((state) => ({ ...state, depositsSelectedList: deposits }))
            setStates((state) => ({ ...state, deposits: depositsResult }))
            setStates((state) => ({ ...state, work: workResult }))
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

    async function handleButtonSubmit() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const workRoute = StrictBuilder<WorkRoutesDto>()
                .arrivalLocation(states.arrivalLocation)
                .departureLocation(states.departureLocation)
                .km(states.km)
                .initialPicket(states.initialPicket)
                .value(states.value)
                .isFixedValue(states.isFixedValue)
                .work(states.work)
                .deposit(states.deposit)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const result = await workRoutesServices.createWorkRoutesInLocalDatabase(
                workRoute,
                changeErrorFields
            )

            if (result.id) {
                Alert.alert('Rota Cadastrada')
                //sincronizar()
                successVibration()
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            setStates((state) => ({ ...state, isLoading: false }))
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar a rota', 'Menssagem: ' + error)
            errorVibration()
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setStates((state) => ({ ...state, [name]: value }))
            setErros((state) => ({ ...state, [name]: null }))
        }
    }

    function setSelected(key: string) {
        setStates((state) => ({ ...state, selected: key }))
    }

    function onSelect() {
        setStates((state) => ({
            ...state,
            deposit: states.deposits.find((item) => {
                if (item.id === states.selected) {
                    setStates((state) => ({ ...state, arrivalLocation: item.name }))
                    return item
                }
            }),
        }))
    }

    /*async function sincronizar() {
        setSyncState(true)
        ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
        setTimeout(function () {
            sync(token, Config.urlApi, signOut)
                .then(() => {
                    setSyncState(false)

                    Config.lastConectionServer = Date.now()
                })
                .catch((err) => {
                    console.log('sync:' + err)
                    setSyncState(false)
                })
        }, 3000)
    }*/

    return {
        states,
        erros,
        actions: {
            handleButtonSubmit,
            onSelect,
            onChange,
            setSelected,
        },
    }
}
