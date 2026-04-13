import { useEffect, useState } from 'react'
import { ToastAndroid, Alert } from 'react-native'
import { useAuth } from '../../../../contexts/AuthContext'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { MaterialTransportServices } from '../../../../domin/services/interfaces/MaterialTransportServices'
import WorkRoutesDto from '../../../../domin/entity/work-routes/WorkRoutesDto'
import { WorkRoutesServices } from '../../../../domin/services/interfaces/WorkRoutesServices'
import { MaterialDto } from '../../../../domin/entity/material/MaterialDto'
import { MaterialServices } from '../../../../domin/services/interfaces/MaterialServices'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import MaterialTransportDto from '../../../../domin/entity/material-transport/MaterialTransportDto'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { useApplicationContext } from '../../../../contexts/ApplicationContext'

type NewTransportProp = RouteProp<RootStackParamList, ScreenNames.NEW_TRANSPORT_NOTE>

export default function useNewTransport() {
    const materialServices = useInjection<MaterialServices>('MaterialServices')
    const workRoutesServices = useInjection<WorkRoutesServices>('WorkRoutesServices')
    const materialTransportServices = useInjection<MaterialTransportServices>('MaterialTransportServices')
    const navigation = useNavigation()
    const route = useRoute<NewTransportProp>()
    const { transportVehicle } = route.params
    const { user } = useAuth()
    const { work } = useApplicationContext()

    const [erros, setErros] = useState({
        value: '',
        quantity: '',
        totalPickets: '',
        distanceTraveledWithinTheWork: '',
    })

    const [states, setStates] = useState({
        workRoute: null as WorkRoutesDto,
        workRoutes: [] as WorkRoutesDto[],
        material: null as MaterialDto,
        materials: [] as MaterialDto[],
        isLoad: false,
        isLoadingList: false,
        isLoading: false,
        picketInputValue: 0,
        quantityInputValue: 0,
        picketDescription: '',
        quantity: null,
        picket: null,
        quantityVisibility: false,
        picketVisibility: false,
        observation: '',
        erroMessagePicket: '',
    })

    const icon = {
        work: 'check',
        transportVehicle: 'check',
        workRoute: states.workRoute ? 'check' : states.workRoutes.length > 0 ? 'caret-down' : 'caret-left',
        material: states.material ? 'check' : states.materials.length > 0 ? 'caret-down' : 'caret-left',
        quantity: states.quantity > 0 ? 'check' : states.quantityVisibility ? 'caret-down' : 'caret-left',
        picket:
            states.picket > 0 || states.picketDescription
                ? 'check'
                : states.picketVisibility
                  ? 'caret-down'
                  : 'caret-left',
    }

    async function handleClickButtonWorkRoute() {
        if (states.workRoute) {
            return
        }

        try {
            const results =
                await workRoutesServices.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            setStates((states) => ({ ...states, workRoutes: results }))
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar rotas')
        }
    }

    async function handleClickButtonMaterial() {
        if (states.material) {
            return
        }

        try {
            const results =
                await materialServices.loadAllMaterialByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    states.workRoute.deposit.id
                )
            setStates((states) => ({ ...states, materials: results }))
        } catch (error) {
            Alert.alert('Erro', 'Falha ao carregar material')
        }
        //setDropButton((state) => ({ ...state, material: !dropButton.material }))
    }

    function handlerClickButtonQuantity() {
        if (states.quantity) {
            return
        }
        setStates((state) => ({ ...state, quantityVisibility: !states.quantityVisibility }))
    }

    function handlerClickButtonPicket() {
        if (states.picket) {
            return
        }
        setStates((state) => ({ ...state, picketVisibility: !states.picketVisibility }))
    }

    function handleSelectWorkRoute(item: WorkRoutesDto) {
        setStates((states) => ({
            ...states,
            workRoute: item,
            workRoutes: [],
        }))
    }

    function handleSelectMaterial(item: MaterialDto) {
        if (states.workRoute && states.workRoute.isFixedValue) {
            setStates((state) => ({
                ...state,
                material: item,
                materials: [],
                picket: 0,
                picketDescription: '0',
                picketVisibility: false,
            }))
            return
        }
        setStates((state) => ({
            ...state,
            material: item,
            materials: [],
        }))
    }

    function handleSelectQuantity() {
        setStates((state) => ({
            ...state,
            picket: 0,
            quantity: states.quantityInputValue,
            quantityVisibility: false,
        }))
    }

    function handlerSelectPicket() {
        const input = Math.min(states.picketInputValue, work.pickets)
        const initial = states.workRoute.initialPicket
        const diff = Math.abs(input - initial)

        setStates((state) => ({
            ...state,
            picket: diff,
            picketDescription: diff === 0 ? `Estaca ${input}` : `${initial} à ${input}`,
            picketVisibility: false,
        }))
    }

    function handleResestItemsSelect() {
        setStates((state) => ({
            ...state,
            workRoute: null,
            workRoutes: [],
            material: null,
            materials: [],
            quantityInputValue: null,
            quantity: null,
            quantityVisibility: false,
            picket: null,
            picketVisibility: false,
            picketInputValue: null,
            picketDescription: '',
        }))
    }

    async function handleSaveItemsSelect() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))
            const materialTransport = StrictBuilder<MaterialTransportDto>()
                .workId(work.id)
                .workRoutes(states.workRoute)
                .transportVehicle(transportVehicle)
                .material(states.material)
                .quantity(states.quantity)
                .deliveryPicket(!states.picket ? 'DEPÓSITO' : states.picketInputValue.toString() + '+00')
                .totalPickets(states.picket)
                .observation(states.observation)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()
            let response = await materialTransportServices.createMaterialTransportInLocalDatabase(
                materialTransport,
                changeErrorFields
            )

            if (response.id) {
                successVibration()
                //sincronizar()
                Alert.alert('Apontamento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o Apontamento', `Menssagem: ${error}`)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }

    return {
        transportVehicle,
        states,
        icon,
        work,
        actions: {
            setStates,
            handleClickButtonWorkRoute,
            handleClickButtonMaterial,
            handlerClickButtonQuantity,
            handlerClickButtonPicket,
            handleSelectWorkRoute,
            handleSelectMaterial,
            handleSelectQuantity,
            handlerSelectPicket,
            handleResestItemsSelect,
            handleSaveItemsSelect,
        },
    }
}
