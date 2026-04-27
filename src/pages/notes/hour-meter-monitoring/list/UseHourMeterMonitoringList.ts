import { useEffect, useState } from 'react'
import HourMeterMonitoringDto from '@domin/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type HourMeterMonitoringListProp = RouteProp<RootStackParamList, ScreenNames.HOUR_METER_MONITORINGS_LIST>

export default function useHourMeterMonitoringList() {
    const hourMeterMonitoringServices = useInjection('HourMeterMonitoringServices')
    const route = useRoute<HourMeterMonitoringListProp>()
    const { workEquipment, workId } = route.params
    const navigation = useNavigation()

    const [hourMeterMonitoringList, setHourMeterMonitoringList] = useState<HourMeterMonitoringDto[]>([])
    const { user } = useAuth()
    const [isLoadingList, setIsLoadingList] = useState(true)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])
    async function loadData() {
        setIsLoadingList(true)
        try {
            const result =
                await hourMeterMonitoringServices.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndWorkEquipmentIdFromLocalDatabase(
                    user.enterpriseId,
                    workId,
                    workEquipment.id
                )
            setHourMeterMonitoringList(result)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados.')
            errorVibration()
            console.error(error)
        } finally {
            setIsLoadingList(false)
        }
    }

    function handleClickEditButton(hourMeterMonitoring: HourMeterMonitoringDto) {
        navigation.navigate(ScreenNames.EDIT_HOUR_METER_MONITORING, {
            hourMeterMonitoring: hourMeterMonitoring,
        })
    }

    return {
        workEquipment,
        hourMeterMonitoringList,
        isLoadingList,
        handleClickEditButton,
    }
}
