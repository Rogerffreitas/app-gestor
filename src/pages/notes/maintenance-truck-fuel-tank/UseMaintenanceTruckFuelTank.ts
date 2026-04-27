import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { MaintenanceTruckDto } from '@domin/entity/maintenance-truck/MaintenanceTruckDto'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { Alert } from 'react-native'
import { errorVibration } from '../../../services/VibrationService'
import { useNavigation } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

export default function useMaintenanceTruckFuelTank() {
    const maintenanceTruckServices = useInjection('MaintenanceTruckServices')
    const fuelSupplyServices = useInjection('FuelSupplyServices')
    const navigation = useNavigation()
    const { work } = useApplicationContext()
    const { user } = useAuth()
    const [maintenanceTrucks, setMaintenanceTrucks] = useState<MaintenanceTruckDto[]>([])
    const [balance, setBalance] = useState(0)
    const [maintenanceTruck, setMaintenanceTruck] = useState<MaintenanceTruckDto>(null)
    const [isLoadingList, setIsLoadingList] = useState(true)
    const { saveWork } = useApplicationContext()

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation, maintenanceTruck])

    async function loadData() {
        try {
            if (maintenanceTruck) {
                await loadFuelBalance(maintenanceTruck)
                return
            }
            setMaintenanceTrucks(
                await maintenanceTruckServices.loadAllMaintenanceTruckByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                )
            )
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickItemMaintenanceTruckList(item: MaintenanceTruckDto) {
        setMaintenanceTruck(item)
        loadFuelBalance(item)
        navigation.setOptions({ title: 'Melosa' })
    }

    async function loadFuelBalance(item: MaintenanceTruckDto) {
        setIsLoadingList(true)
        try {
            const balance =
                await fuelSupplyServices.loadCurrentBalanceTankByEnterpriseIdAndWorkIdAndMaintenanceTruckIdFromLocalDatabase(
                    user.enterpriseId,
                    work.id,
                    item.id
                )
            setBalance(balance)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    return {
        isLoadingList,
        maintenanceTruck,
        maintenanceTrucks,
        balance,
        navigation,
        work,
        actions: {
            setMaintenanceTruck,
            saveWork,
            handleClickItemMaintenanceTruckList,
        },
    }
}
