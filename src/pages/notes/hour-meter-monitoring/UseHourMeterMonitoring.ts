import { useEffect, useState } from 'react'
import WorkEquipmentDto from '@gestor/domain/entity/work-equipment/WorkEquipmentDto'
import { ScreenNames } from '../../../types'
import { useAuth } from '../../../contexts/AuthContext'
import { errorVibration } from '../../../services/VibrationService'
import { Alert } from 'react-native'
import HourMeterMonitoringDto from '@gestor/domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { useNavigation } from '@react-navigation/native'
import { useApplicationContext } from '../../../contexts/ApplicationContext'
import { useInjection } from '@/src/contexts/InjectionContext'

export default function useHourMeterMonitoring() {
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const hourMeterMonitoringServices = useInjection('HourMeterMonitoringServices')
    const navigation = useNavigation()
    const { user } = useAuth()
    const { work } = useApplicationContext()
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [workEquipments, setWorkEquipments] = useState<WorkEquipmentDto[]>([])
    const [noteToday, setNoteToday] = useState<string[]>([])
    const [dateNow, setDateNow] = useState(_getDateNow)
    const [hourMeterMonitoringList, setHourMeterMonitoringList] = useState<HourMeterMonitoringDto[]>([])

    async function loadData() {
        try {
            const [workEquipments, list] = await Promise.all([
                workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    work.id
                ),
                hourMeterMonitoringServices.loadAllHourMeterMonitoringByEnterpriseIdAndWorkIdAndDateFromLocalDatabase(
                    user.enterpriseId,
                    work.id,
                    dateNow
                ),
            ])
            setWorkEquipments(workEquipments)

            setNoteToday(
                list.map((item) => {
                    return item.workEquipment.id
                })
            )
            setHourMeterMonitoringList(list)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar a lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData()
        })
        return unsubscribe
    }, [navigation])

    function handleClickItemWorkEquipment(item: WorkEquipmentDto) {
        navigation.navigate(ScreenNames.HOUR_METER_MONITORINGS_LIST, {
            workId: work.id,
            workEquipment: item,
        })
    }

    function handlerClickNewButton(item: WorkEquipmentDto) {
        navigation.navigate(ScreenNames.NEW_HOUR_METER_MONITORING, {
            workEquipment: item,
        })
    }

    function _getDateNow() {
        const data = new Date()
        var dd = data.getDate()
        var mm = data.getMonth() + 1
        var dia = dd + ''
        var mes = mm + ''
        if (dd < 10) {
            dia = '0' + dd
        }
        if (mm < 10) {
            mes = '0' + mm
        }
        return dia + '/' + mes + '/' + data.getFullYear()
    }

    function goBack() {
        navigation.goBack()
    }

    return {
        isLoadingList,
        workEquipments,
        noteToday,
        hourMeterMonitoringList,
        work,
        actions: {
            goBack,
            handleClickItemWorkEquipment,
            handlerClickNewButton,
        },
    }
}
