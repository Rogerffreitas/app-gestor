import { useCallback, useEffect, useState } from 'react'
import { MaintenanceTruckDto } from '../../../../domin/entity/maintenance-truck/MaintenanceTruckDto'
import WorkDto from '../../../../domin/entity/work/WorkDto'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { useAuth } from '../../../../contexts/AuthContext'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { FuelSupplyTypes, RootStackParamList, ScreenNames } from '../../../../types'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { useInjection } from '../../../../infra/hooks/useInjection'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'

type MaintenanceTruckRefuelTankProp = RouteProp<RootStackParamList, ScreenNames.MAINTENANCE_TRUCK_REFUEL_TANK>

export default function useMaintenanceTruckRefuelTank() {
    const fuelSupplyServices = useInjection<FuelSupplyServices>('FuelSupplyServices')

    const route = useRoute<MaintenanceTruckRefuelTankProp>()
    const { maintenanceTruck, workId } = route.params
    const navigation = useNavigation()

    const { user } = useAuth()
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [fuelSupples, setFuelSupples] = useState<FuelSupplyDto[]>([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [navigation, maintenanceTruck, workId])

    async function loadAll() {
        try {
            setFuelSupples(
                await fuelSupplyServices.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndMaintenanceTruckIdAndTypeFromLocalDatabase(
                    user.enterpriseId,
                    workId,
                    maintenanceTruck.id,
                    FuelSupplyTypes.MAINTENANCE_TRUCK_TANK
                )
            )
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickButtonNew() {
        navigation.navigate(ScreenNames.NEW_MAINTENANCE_TRUCK_REFUEL_SUPPLY, {
            workId: workId,
            maintenanceTruck: maintenanceTruck,
        })
    }

    function handleClickButtonEdit(item: FuelSupplyDto) {
        navigation.navigate(ScreenNames.EDIT_FUEL_SUPPLY, {
            fuelSupply: item,
        })
    }
    return {
        isLoadingList,
        fuelSupples,
        actions: {
            handleClickButtonNew,
            handleClickButtonEdit,
        },
    }
}
