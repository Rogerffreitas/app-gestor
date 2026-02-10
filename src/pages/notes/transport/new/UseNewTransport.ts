import { useEffect, useState } from 'react'
import { ToastAndroid, Alert } from 'react-native'
import { useAuth } from '../../../../contexts/AuthContext'
import { useConfig } from '../../../../contexts/ConfigContext'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { MaterialTransportServices } from '../../../../domin/services/interfaces/MaterialTransportServices'
import WorkRoutesDto from '../../../../domin/entity/work-routes/WorkRoutesDto'
import { WorkRoutesServices } from '../../../../domin/services/interfaces/WorkRoutesServices'
import { MaterialDto } from '../../../../domin/entity/material/MaterialDto'
import { MaterialServices } from '../../../../domin/services/interfaces/MaterialServices'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import MaterialTransportDto from '../../../../domin/entity/material-transport/MaterialTransportDto'
import { UserAction } from '../../../../types'

type UseTransportListProps = {
    work: WorkDto
    transportVehicle: TransportVehicleDto
    materialTransportServices: MaterialTransportServices
    workRoutesServices: WorkRoutesServices
    materialServices: MaterialServices
    navigation: any
}

export default function useNewTransport({
    work,
    transportVehicle,
    materialTransportServices,
    workRoutesServices,
    materialServices,
    navigation,
}: UseTransportListProps) {
    const { user } = useAuth()
    const [workRoute, setWorkRoute] = useState<WorkRoutesDto>(null)
    const [workRoutes, setWorkRoutes] = useState<WorkRoutesDto[]>()
    const [material, setMaterial] = useState<MaterialDto>(null)
    const [materials, setMaterials] = useState<MaterialDto[]>()
    const [quantity, setQuantity] = useState(null)
    const [picket, setPicket] = useState(null)

    const [erros, setErros] = useState({
        value: '',
        quantity: '',
        totalPickets: '',
        distanceTraveledWithinTheWork: '',
    })

    const [state, setState] = useState({
        isLoad: false,
        isLoadingList: false,
        isLoading: false,
        picketInputValue: 0,
        quantityInputValue: 0,
        picketDescription: '',
        quantity: false,
        picket: false,
        observation: '',
        erroMessagePicket: '',
    })

    const [dropButton, setDropButton] = useState({
        route: false,
        material: false,
        quantity: false,
        picket: false,
    })

    const [icon, setIcon] = useState({
        work: 'check',
        workRoute: 'caret-left',
        material: 'caret-left',
        transportVehicle: 'check',
        quantity: 'caret-left',
        picket: 'caret-left',
    })

    useEffect(() => {
        async function config() {
            if (!workRoute && work && user) {
                if (dropButton.route) {
                    const result =
                        await workRoutesServices.loadAllWorkRoutesByEnterpriseIdAndWorkIdFromLocalDatabase(
                            user.enterpriseId,
                            work.id
                        )
                    setWorkRoutes(result)
                    setIcon((state) => ({ ...state, workRoute: 'caret-down' }))
                } else {
                    setWorkRoutes(null)
                    setIcon((state) => ({ ...state, workRoute: 'caret-left' }))
                }
            }
            if (!material && user) {
                if (dropButton.material) {
                    const result =
                        await materialServices.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
                            user.enterpriseId,
                            workRoute.deposit.id
                        )
                    setMaterials(result)
                    setIcon((state) => ({ ...state, material: 'caret-down' }))
                } else {
                    setMaterials(null)
                    setIcon((state) => ({ ...state, material: 'caret-left' }))
                }
            }
            if (!quantity) {
                if (dropButton.quantity) {
                    setState((state) => ({ ...state, quantity: true }))
                    setIcon((state) => ({ ...state, quantity: 'caret-down' }))
                } else {
                    setState((state) => ({ ...state, quantity: false }))
                    setIcon((state) => ({ ...state, quantity: 'caret-left' }))
                }
            }
            if (!picket) {
                if (dropButton.picket) {
                    setState((state) => ({ ...state, picket: true }))
                    setIcon((state) => ({ ...state, picket: 'caret-down' }))
                } else {
                    setState((state) => ({ ...state, picket: false }))
                    setIcon((state) => ({ ...state, picket: 'caret-left' }))
                }
            }
        }
        config()
    }, [dropButton])

    function handleClickButtonWorkRoute() {
        setDropButton((state) => ({ ...state, route: !dropButton.route }))
    }

    function handleClickButtonMaterial() {
        setDropButton((state) => ({ ...state, material: !dropButton.material }))
    }

    function handlerClickButtonQuantity() {
        setDropButton((state) => ({ ...state, quantity: !dropButton.quantity }))
    }

    function handlerClickButtonPicket() {
        setDropButton((state) => ({ ...state, picket: !dropButton.picket }))
    }

    function handleSelectWorkRoute(item: WorkRoutesDto) {
        setWorkRoute(item)
        setIcon((state) => ({ ...state, workRoute: 'check' }))
        setWorkRoutes(null)
    }

    function handleSelectMaterial(item: MaterialDto) {
        setMaterial(item)
        setIcon((state) => ({ ...state, material: 'check' }))
        setMaterials(null)
        if (workRoute.isFixedValue) {
            setPicket(0)
            setState((state) => ({ ...state, picketDescription: '0' }))
            setIcon((state) => ({ ...state, picket: 'check' }))
            setState((state) => ({ ...state, picket: false }))
        }
    }

    function handleSelectQuantity() {
        setPicket(0)
        setQuantity(state.quantityInputValue)
        setIcon((state) => ({ ...state, quantity: 'check' }))
        setDropButton((state) => ({ ...state, quantity: !dropButton.quantity }))
        setState((state) => ({ ...state, quantity: null }))
    }

    function handlerSelectPicket() {
        let e = state.picketInputValue

        if (state.picketInputValue > work.pickets) {
            e = work.pickets
        }

        if (e > workRoute.initialPicket) {
            setPicket(e - workRoute.initialPicket)
            setState((state) => ({ ...state, picketDescription: workRoute.initialPicket + ' à ' + e }))
        }

        if (e < workRoute.initialPicket) {
            setPicket(workRoute.initialPicket - e)
            setState((state) => ({ ...state, picketDescription: workRoute.initialPicket + ' à ' + e }))
            setState((state) => ({ ...state, picket: false }))
        }

        if (e == workRoute.initialPicket) {
            setPicket(0)
            setState((state) => ({ ...state, picketDescription: 'Estaca ' + e }))
        }
        setIcon((state) => ({ ...state, picket: 'check' }))
        setDropButton((state) => ({ ...state, picket: !dropButton.quantity }))
        setState((state) => ({ ...state, picket: false }))
    }

    function handleResestItemsSelect() {
        setWorkRoute(null)
        setWorkRoutes(null)
        setMaterial(null)
        setMaterials(null)
        setState((state) => ({ ...state, quantityInputValue: null }))
        setQuantity(0)
        setState((state) => ({ ...state, quantity: false }))
        setPicket(null)
        setState((state) => ({ ...state, picketInputValue: null }))
        setState((state) => ({ ...state, picket: false }))
        setDropButton((state) => ({ ...state, route: false }))
        setDropButton((state) => ({ ...state, material: false }))
        setDropButton((state) => ({ ...state, picket: false }))
        setDropButton((state) => ({ ...state, quantity: false }))
    }

    async function handleSaveItemsSelect() {
        try {
            setState((state) => ({ ...state, isLoading: true }))
            const materialTransport = StrictBuilder<MaterialTransportDto>()
                .workId(work.id)
                .workRoutesDto(workRoute)
                .transportVehicleDto(transportVehicle)
                .materialDto(material)
                .quantity(quantity)
                .deliveryPicket(!picket ? 'DEPÓSITO' : state.picketInputValue.toString() + '+00')
                .totalPickets(picket)
                .observation(state.observation)
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
                Alert.alert('Equipamento Cadastrado')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o equipamento', error)
            errorVibration()
        } finally {
            setState((state) => ({ ...state, isLoading: false }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }

    return {
        workRoute,
        workRoutes,
        material,
        materials,
        quantity,
        picket,
        state,
        icon,
        setState,
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
    }
}
