import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import HourMeterMonitoringDto from '@gestor/domain/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useApplicationContext } from '../../../../contexts/ApplicationContext'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewHourMeterMonitoringProp = RouteProp<RootStackParamList, ScreenNames.NEW_HOUR_METER_MONITORING>

export default function useNewHourMeterMonitoring() {
    const hourMeterMonitoringServices = useInjection('HourMeterMonitoringServices')
    const equipmentServices = useInjection('EquipmentServices')
    const route = useRoute<NewHourMeterMonitoringProp>()
    const { workEquipment } = route.params
    const { work } = useApplicationContext()
    const navigation = useNavigation()

    const [states, setStates] = useState({
        isEquipment: workEquipment.equipment.isEquipment,
        start: workEquipment.currentHourMeterOrOdometer,
        final: null,
        date: getDateNow(),
        observation: null,
        isLoading: false,
        iconWork: 'check',
    })

    const [erros, setErros] = useState({
        start: null,
        final: null,
        date: null,
        observation: null,
    })

    const { user } = useAuth()

    async function handleSubmitButton() {
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const hourMeter = StrictBuilder<HourMeterMonitoringDto>()
                .date(states.date)
                .initialHourMeterValue(states.start)
                .currentHourMeterValue(states.final)
                .workEquipment(workEquipment)
                .observation(states.observation)
                .workId(work.id)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const result = await hourMeterMonitoringServices.createHourMeterMonitoringInLocalDatabase(
                hourMeter,
                changeErrorFields
            )

            if (result.id && result.currentHourMeterValue > workEquipment.equipment.hourMeterOrOdometer) {
                const equipment = workEquipment.equipment
                equipment.hourMeterOrOdometer = result.currentHourMeterValue
                await equipmentServices.updateHourMeterOrOdometerInLocalDatabase(equipment, changeErrorFields)
            }
            successVibration()
            //sincronizar()
            Alert.alert('Apontamento Cadastrado!')
            navigation.goBack()
        } catch (error) {
            console.log(error)

            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o registro', `Menssagem: ${error}`)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setStates((state) => ({ ...state, [name]: value }))
            setErros((state) => ({ ...state, [name]: null }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErros((state) => ({ ...state, [name]: value }))
        }
    }

    function getDateNow() {
        const date = new Date()
        var dd = date.getDate()
        var mm = date.getMonth() + 1

        var dia = dd + ''
        var mes = mm + ''

        if (dd < 10) {
            dia = '0' + dd
        }
        if (mm < 10) {
            mes = '0' + mm
        }
        return dia + '/' + mes + '/' + date.getFullYear()
    }
    return {
        states,
        erros,
        work,
        workEquipment,
        actions: {
            onChange,
            handleSubmitButton,
        },
    }
}
