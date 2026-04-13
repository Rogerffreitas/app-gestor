import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import {
    FuelSupplyTypes,
    MaintenanceTruckFuelSupplyListType,
    RootStackParamList,
    ScreenNames,
} from '../../../../types'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { TransportVehicleServices } from '../../../../domin/services/interfaces/TransportVehicleServices'
import { WorkEquipmentServices } from '../../../../domin/services/interfaces/WorkEquipmentServices'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { useApplicationContext } from '../../../../contexts/ApplicationContext'

type MaintenanceTruckFuelSuppliesProp = RouteProp<
    RootStackParamList,
    ScreenNames.MAINTENANCE_TRUCK_FUEL_SUPPLIES
>

export default function useMaintenanceTruckFuelSupplies() {
    const workEquipmentServices = useInjection<WorkEquipmentServices>('WorkEquipmentServices')
    const fuelSupplyServices = useInjection<FuelSupplyServices>('FuelSupplyServices')
    const transportVehicleServices = useInjection<TransportVehicleServices>('TransportVehicleServices')
    const route = useRoute<MaintenanceTruckFuelSuppliesProp>()
    const { maintenanceTruck } = route.params
    const navigation = useNavigation()
    const { user } = useAuth()
    const { work } = useApplicationContext()
    const [states, setStates] = useState({
        isLoadingList: false,
        fuelType: null as FuelSupplyTypes,
        typeImage: null,
        maintenanceTruckFuelSupplyList: [] as MaintenanceTruckFuelSupplyListType[],
    })

    const animation = useRef(null)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData(states.fuelType, states.fuelType === FuelSupplyTypes.EQUIPMENT ? 'maquina' : 'truck')
        })

        return unsubscribe
    }, [navigation, states.fuelType])

    async function loadData(type: FuelSupplyTypes, image: string) {
        setStates((state) => ({ ...state, isLoadingList: true, fuelType: type, typeImage: image }))

        try {
            const fuelSuppliesPromise =
                fuelSupplyServices.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    user.enterpriseId,
                    work.id,
                    maintenanceTruck.id,
                    type
                )

            if (type === FuelSupplyTypes.EQUIPMENT) {
                navigation.setOptions({ title: 'Abastecimentos (Equipamentos)' })
                const [fuelSupplies, equipments] = await Promise.all([
                    fuelSuppliesPromise,
                    workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    ),
                ])
                setStates((state) => ({
                    ...state,
                    isLoadingList: false,
                    maintenanceTruckFuelSupplyList: mapToFuelSupplyList(fuelSupplies, equipments, type),
                }))
                return
            }

            if (type === FuelSupplyTypes.TRANSPORT_VEHICLE) {
                navigation.setOptions({ title: 'Abastecimentos (Caçambas)' })
                const [fuelSupplies, vehicles] = await Promise.all([
                    fuelSuppliesPromise,
                    transportVehicleServices.loadAllTransportVehicleByEnterpriseIdAndServerIdValidFromLocalDatabase(
                        user.enterpriseId,
                        work.id
                    ),
                ])

                setStates((state) => ({
                    ...state,
                    isLoadingList: false,
                    maintenanceTruckFuelSupplyList: mapToFuelSupplyList(fuelSupplies, vehicles, type),
                }))
                return
            }
            setStates((state) => ({
                ...state,
                isLoadingList: false,
            }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    function mapToFuelSupplyList(
        fuelSupplies: FuelSupplyDto[],
        details: any[],
        type: FuelSupplyTypes
    ): MaintenanceTruckFuelSupplyListType[] {
        return fuelSupplies.map((fuel) => {
            const detail = details.find((d) => d.id === fuel.transportVehicleOrWorkEquipmentId)

            return {
                fuelSupply: fuel,
                serverId: fuel.serverId,
                id: fuel.id,
                workId: fuel.workId,
                transportVehicleOrWorkEquipmentId: fuel.transportVehicleOrWorkEquipmentId,
                observation: fuel.observation,
                quantity: fuel.quantity ? fuel.quantity / 100 : 0,
                isDiscount: fuel.isDiscount,
                status: fuel.status,
                modelOrPlate:
                    type === FuelSupplyTypes.EQUIPMENT
                        ? detail?.equipment?.modelOrPlate
                        : `${detail?.nameProprietary} - ${detail?.plate}`,
                nameProprietary:
                    type === FuelSupplyTypes.EQUIPMENT
                        ? detail?.equipment?.nameProprietary
                        : detail?.nameProprietary,
                operatorMotorist:
                    type === FuelSupplyTypes.EQUIPMENT
                        ? detail?.equipment?.operatorMotorist
                        : detail?.motorist,
            }
        })
    }

    function handleClickButtonNew() {
        navigation.navigate(ScreenNames.NEW_MAINTENANCE_TRUCK_FUEL_SUPPLY, {
            maintenanceTruck: maintenanceTruck,
            type: states.fuelType,
            workId: work.id,
        })
    }

    function handleClickButtonEdit(item: MaintenanceTruckFuelSupplyListType) {
        navigation.navigate(ScreenNames.EDIT_FUEL_SUPPLY, {
            fuelSupply: item.fuelSupply,
        })
    }

    return {
        animation,
        states,

        actions: {
            resetType: () => setStates((states) => ({ ...states, fuelType: null, typeImage: null })),
            handleClickButtonEdit,
            handleClickButtonNew,
            setStates,
            loadData,
        },
    }
}
