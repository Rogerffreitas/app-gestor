import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '../../../../infra/hooks/useInjection'

type FuelSupplesListProp = RouteProp<RootStackParamList, ScreenNames.FUEL_SUPPLY_LIST>

export default function useFuelSupplesList() {
    const fuelSupplyServices = useInjection<FuelSupplyServices>('FuelSupplyServices')
    const route = useRoute<FuelSupplesListProp>()
    const { type, transportVehicleOrWorkEquipmentId, workId } = route.params
    const navigation = useNavigation()

    const { user } = useAuth()
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [fuelSupples, setFuelSupples] = useState<FuelSupplyDto[]>([])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    async function loadData() {
        try {
            if (!workId) {
                Alert.alert('Ocorreu um erro a selecionar a Obra, Tente novamento')
                return
            }
            const result =
                await fuelSupplyServices.loadAllFuelSupplyByEnterpriseIdAndWorkIdAndVehicleIdAndTypeFromLocalDatabase(
                    user.enterpriseId,
                    workId,
                    transportVehicleOrWorkEquipmentId,
                    type
                )
            setFuelSupples(result)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar os Abastecimentos', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    function handlerClickNewButton() {
        navigation.navigate(ScreenNames.NEW_FUEL_SUPPLY, {
            workId: workId,
            transportVehicleOrWorkEquipmentId: transportVehicleOrWorkEquipmentId,
            type: type,
        })
    }
    function handleClickEditButton(fuelSupply: FuelSupplyDto) {
        navigation.navigate(ScreenNames.EDIT_FUEL_SUPPLY, {
            fuelSupply: fuelSupply,
        })
    }
    return {
        fuelSupples,
        isLoadingList,
        actions: {
            handlerClickNewButton,
            handleClickEditButton,
        },
    }
}
