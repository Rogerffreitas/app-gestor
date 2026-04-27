import { useState } from 'react'
import EquipmentDto from '@domin/entity/equipment/EquipmentDto'
import { useAuth } from '../../../../contexts/AuthContext'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSync } from '@/src/infra/hooks/UseSync'
import { useInjection } from '@/src/contexts/InjectionContext'

type EditEquipmentProp = RouteProp<RootStackParamList, ScreenNames.EDIT_EQUIPMENT>

export default function UseEditEquipment() {
    const equipmentServices = useInjection('EquipmentServices')
    const navigation = useNavigation()
    const route = useRoute<EditEquipmentProp>()
    const { equipment } = route.params
    const { performSync } = useSync()

    const [states, setStates] = useState({
        equipment: equipment,
        proprietatyName: equipment.nameProprietary,
        cpfCnpj: equipment.cpfCnpjProprietary,
        tel: equipment.telProprietary,
        startRental: equipment.startRental,
        monthlyPayment: equipment.monthlyPayment,
        valuePerHourKm: equipment.valuePerHourKm,
        valuePerDay: equipment.valuePerDay,
        operatorMotorist: equipment.operatorMotorist,
        modelOrPlate: equipment.modelOrPlate,
        hourMeterOrOdometer: equipment.hourMeterOrOdometer,
        isLoading: false,
        sync: false,
        type: '',
    })

    const [erros, setErros] = useState({
        proprietatyName: '',
        cpfCnpj: '',
        tel: '',
        startRental: '',
        monthlyPayment: '',
        valuePerHourKm: '',
        valuePerDay: '',
        operatorMotorist: '',
        isEquipment: '',
        modelOrPlate: '',
        hourMeterOrOdometer: '',
    })
    const { user } = useAuth()

    async function handleEditButton() {
        if (equipment.id == null) {
            Alert.alert('Error')
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const equipament = StrictBuilder<EquipmentDto>()
                .nameProprietary(states.proprietatyName)
                .cpfCnpjProprietary(states.cpfCnpj)
                .telProprietary(states.tel)

                .startRental(states.startRental)
                .monthlyPayment(states.monthlyPayment)
                .valuePerDay(states.valuePerDay)
                .valuePerHourKm(states.valuePerHourKm)

                .hourMeterOrOdometer(states.hourMeterOrOdometer)
                .isEquipment(equipment.isEquipment)
                .modelOrPlate(states.modelOrPlate)
                .operatorMotorist(states.operatorMotorist)

                .id(equipment.id)
                .userId(user.id)
                .enterpriseId(equipment.enterpriseId)
                .build()

            await equipmentServices.updateEquipmentInLocalDatabase(equipament, changeErrorFields)
            Alert.alert('Equipamento editado')
            successVibration()
            performSync()
            navigation.goBack()
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            errorVibration()
            Alert.alert('Erro ao tentar editar o equipamento: ', `Menssagem: ${error}`)
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

    async function deleteEquipment() {
        if (equipment.id == null) {
            Alert.alert('Error')
            navigation.goBack()
        }

        try {
            await equipmentServices.deleteEquipmentInLocalDatabase(equipment.id, user.id)
            Alert.alert('Equipamento apagado')
            successVibration()
            performSync()
            navigation.goBack()
        } catch (error) {
            Alert.alert('Não é possível apagar o Equipamento', error.message)
            console.log(error.message)
        }
    }

    const showConfirmDialog = () => {
        return Alert.alert('Deseja apagar o equipamento?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteEquipment()
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
        actions: { onChange, showConfirmDialog, handleEditButton },
    }
}
