import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import { useNetwork } from '../../../contexts/NetworkContext'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import WorkDto from '../../../domin/entity/work/WorkDto'
import { useAuth } from '../../../contexts/AuthContext'
import { Alert } from 'react-native'
import { errorVibration } from '../../../services/VibrationService'
import WorkEquipmentDto from '../../../domin/entity/work-equipment/WorkEquipmentDto'
import TransportVehicleDto from '../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { InvoiceTypes, ScreenNames } from '../../../types'
import { useInjection } from '@/src/contexts/InjectionContext'

type MenuOptionsTypes = 'Equipamentos' | 'Caçambas'

type ScreenTypes = 'Gerar fatura' | 'Gerenciar faturas'

export default function useFinancial() {
    const workServices = useInjection('WorkServices')
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const transportVehicleServices = useInjection('TransportVehicleServices')

    const navigation = useNavigation()
    const { isConnected } = useNetwork()
    const { work, saveWork } = useApplicationContext()

    const { user } = useAuth()
    const animation = useRef(null)

    const [states, setStates] = useState({
        works: [] as WorkDto[],
        isLoadingList: true,
        dataList: [] as WorkEquipmentDto[] | TransportVehicleDto[],
        type: null as MenuOptionsTypes,
        screenType: null as ScreenTypes,
        isLoadingDataLista: true,
        screenImage: null,
        typeImage: null,
    })

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (work) {
                setStates((state) => ({ ...state, isLoadingList: false }))
                return
            }

            loadAll()
        })
        return unsubscribe
    }, [navigation, work])

    async function loadAll() {
        if (!isConnected) return

        navigation.setOptions({ title: 'Escolha uma obra' })

        try {
            const results = await workServices.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                user.enterpriseId,
                user.id,
                user.role
            )
            setStates((state) => ({ ...state, works: results, isLoadingList: false }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    async function handleSelectedType(type: MenuOptionsTypes, img: string) {
        if (states.screenType === 'Gerenciar faturas') {
            navigation.navigate(ScreenNames.MANAGE_INVOICE, {
                type: type === 'Equipamentos' ? InvoiceTypes.EQUIPMENT : InvoiceTypes.TRANSPORT_VEHICLE,
                workId: work.id,
            })
            return
        }
        setStates((state) => ({ ...state, type: type, typeImage: img, isLoadingDataLista: true }))
        try {
            if (type === 'Equipamentos') {
                navigation.setOptions({ title: 'Escolha um equipamento' })
                const results =
                    await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    )
                setStates((state) => ({ ...state, type: type, dataList: results, isLoadingDataLista: false }))
            }

            if (type === 'Caçambas') {
                navigation.setOptions({ title: 'Escolha uma caçamba' })
                const results =
                    await transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    )
                setStates((state) => ({ ...state, type: type, dataList: results, isLoadingDataLista: false }))
            }
        } catch (error) {
            console.error(error)
            errorVibration()
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            setStates((state) => ({ ...state, isLoadingDataLista: false }))
        }
    }

    function handleClickItemWorkEquipment(item: WorkEquipmentDto) {
        if (states.screenType === 'Gerar fatura') {
            navigation.navigate(ScreenNames.GENERATE_INVOICE, {
                transportVehicleOrWorkEquipment: item,
                type: InvoiceTypes.EQUIPMENT,
                workId: work.id,
            })
            return
        }
    }

    function handleClickItemTransportVehicle(item: TransportVehicleDto) {
        if (states.screenType === 'Gerar fatura') {
            navigation.navigate(ScreenNames.GENERATE_INVOICE, {
                transportVehicleOrWorkEquipment: item,
                type: InvoiceTypes.TRANSPORT_VEHICLE,
                workId: work.id,
            })
            return
        }
    }

    function handleSelectWork(item: WorkDto) {
        saveWork(item)
        navigation.setOptions({ title: 'Financeiro' })
    }

    return {
        states,
        isConnected,
        animation,
        work,
        actions: {
            handleSelectedType,
            resetType: () => setStates((states) => ({ ...states, type: null, typeImage: null })),
            setScreenType: (type: ScreenTypes, image: string) => {
                setStates((states) => ({
                    ...states,
                    screenType: type,
                    screenImage: image,
                }))
            },
            resetWork: () => saveWork(null),
            handleSelectWork,
            handleClickItemWorkEquipment,
            handleClickItemTransportVehicle,
        },
    }
}
