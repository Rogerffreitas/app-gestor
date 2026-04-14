import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import HourMeterMonitoringDto from '../../../../domin/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { InvoiceStatus, RootStackParamList, ScreenNames } from '../../../../types'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useApplicationContext } from '../../../../contexts/ApplicationContext'
import { useInjection } from '@/src/contexts/InjectionContext'

type EditHourMeterMonitoringPros = RouteProp<RootStackParamList, ScreenNames.EDIT_HOUR_METER_MONITORING>

export default function useEditHourMeterMonitoring() {
    const hourMeterMonitoringServices = useInjection('HourMeterMonitoringServices')
    const equipmentServices = useInjection('EquipmentServices')
    const route = useRoute<EditHourMeterMonitoringPros>()
    const { hourMeterMonitoring } = route.params
    const navigation = useNavigation()
    const { work } = useApplicationContext()

    const [states, setStates] = useState({
        isEquipment: hourMeterMonitoring.workEquipment.equipment.isEquipment,
        modelOrPlate: hourMeterMonitoring.workEquipment.equipment.modelOrPlate,
        start: hourMeterMonitoring.initialHourMeterValue,
        final: hourMeterMonitoring.currentHourMeterValue,
        date: hourMeterMonitoring.date,
        observation: hourMeterMonitoring.observation,
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
                .id(hourMeterMonitoring.id)
                .date(states.date)
                .initialHourMeterValue(states.start)
                .currentHourMeterValue(states.final)
                .workEquipment(hourMeterMonitoring.workEquipment)
                .workId(hourMeterMonitoring.workId)
                .observation(states.observation)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const result = await hourMeterMonitoringServices.updateHourMeterMonitoringInLocalDatabase(
                hourMeter,
                changeErrorFields
            )

            if (result.id) {
                const equipment = hourMeterMonitoring.workEquipment.equipment
                equipment.hourMeterOrOdometer = result.currentHourMeterValue
                await equipmentServices.updateHourMeterOrOdometerInLocalDatabase(equipment, changeErrorFields)
                successVibration()
                //sincronizar()
                Alert.alert('Editado com sucesso!')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)

            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o apontamento', `Menssagem: ${error}`)
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

    async function deleteHourMeterMonitoring() {
        setStates((state) => ({ ...state, isLoading: false }))
        try {
            if (
                hourMeterMonitoring.invoiceId == 0 ||
                hourMeterMonitoring.invoiceStatus == InvoiceStatus.PENDING
            ) {
                await hourMeterMonitoringServices.deleteHourMeterMonitoringInLocalDatabase(
                    hourMeterMonitoring.id,
                    user.id
                )
                const equipment = hourMeterMonitoring.workEquipment.equipment
                equipment.hourMeterOrOdometer = hourMeterMonitoring.initialHourMeterValue
                await equipmentServices.updateHourMeterOrOdometerInLocalDatabase(equipment, changeErrorFields)
                Alert.alert('Horimetro apagado')
                navigation.goBack()
            } else {
                Alert.alert('Não é possível apagar o Horimetro', 'Existe uma fatura em aberto')
            }
        } catch (error) {
            console.log(error.cause)
            Alert.alert('Erro ao tentar apagar o apontamento', `Menssagem: ${error}, Causa: ${error?.cause}`)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function showConfirmDialog() {
        return Alert.alert('Deseja apagar o Horimetro?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteHourMeterMonitoring()
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    return {
        states,
        erros,
        work,
        actions: {
            handleSubmitButton,
            onChange,
            showConfirmDialog,
        },
    }
}
