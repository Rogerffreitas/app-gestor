import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { FuelSupplyServices } from '../../../../domin/services/interfaces/FuelSupplyServices'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import { ScreenNames } from '../../../../types'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'

type UseFuelSupplesListProps = {
    fuelSupplyServices: FuelSupplyServices
    transportVehicleOrWorkEquipmentId: string
    workId: string
    type: string
    navigation
}

export default function useFuelSupplesList({
    navigation,
    workId,
    transportVehicleOrWorkEquipmentId,
    fuelSupplyServices,
    type,
}: UseFuelSupplesListProps) {
    const { user } = useAuth()
    const [isLoad, setIsLoad] = useState(true)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [fuelSupples, setFuelSupples] = useState<FuelSupplyDto[]>([])

    useEffect(() => {
        loadAll()
    }, [isLoad])

    async function loadAll() {
        try {
            setIsLoadingList(true)
            navigation.addListener('focus', () => setIsLoad(!isLoad))
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
            fuelSupplyServices: fuelSupplyServices,
            workId: workId,
            transportVehicleOrWorkEquipmentId: transportVehicleOrWorkEquipmentId,
            type: type,
        })
    }
    function handleClickEditButton(fuelSupply: FuelSupplyDto) {
        navigation.navigate(ScreenNames.EDIT_FUEL_SUPPLY, {
            fuelSupplyServices: fuelSupplyServices,
            fuelSupply: fuelSupply,
        })
    }
    return {
        fuelSupples,
        isLoadingList,
        handlerClickNewButton,
        handleClickEditButton,
    }
}
