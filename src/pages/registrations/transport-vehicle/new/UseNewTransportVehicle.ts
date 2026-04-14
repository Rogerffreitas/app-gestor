import { useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { RootStackParamList, ScreenNames } from '../../../../types'

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type NewTransportVehicleProp = RouteProp<RootStackParamList, ScreenNames.NEW_TRANSPORT_VEHICLE>

export default function useNewTransportVehicle() {
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const navigation = useNavigation()
    const route = useRoute<NewTransportVehicleProp>()
    const { workId } = route.params

    const [states, setStates] = useState({
        motorist: '',
        plate: '',
        color: '',
        capacity: null,
        proprietaryName: '',
        cpfCnpj: '',
        tel: '',
        isLoading: false,
        isSync: false,
    })
    const [errors, setErrors] = useState({
        motorist: '',
        plate: '',
        color: '',
        capacity: '',
        proprietaryName: '',
        cpfCnpj: '',
        tel: '',
    })

    const { user } = useAuth()

    async function handleClickSubmitButton() {
        if (user.id == null || user.enterpriseId == null) {
            errorVibration()
            Alert.alert('Error')
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const dto = StrictBuilder<TransportVehicleDto>()
                .motorist(states.motorist)
                .plate(states.plate)
                .color(states.color)
                .capacity(states.capacity)
                .nameProprietary(states.proprietaryName)
                .cpfCnpjProprietary(states.cpfCnpj)
                .telProprietary(states.tel)
                .workId(workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const createdEntity = await transportVehicleServices.createTransportVehicleInLocalDatabase(
                dto,
                changeErrorFields
            )

            if (createdEntity.id) {
                successVibration()
                //sincronizar()
                Alert.alert('Caçamba cadastrada')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error.cause)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar o Veículo', error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErrors((state) => ({ ...state, [name]: value }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setStates((state) => ({ ...state, [name]: value }))
            setErrors((state) => ({ ...state, [name]: null }))
        }
    }
    /* 
    
    async function sincronizar() {
        setSyncState(true)
        ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
        setTimeout(function () {
            sync(token, Config.urlApi, signOut)
                .then(() => {
                    setSyncState(false)

                    Config.lastConectionServer = Date.now()
                })
                .catch((err) => {
                    console.log('sync:' + err)
                    setSyncState(false)
                })
        }, 3000)
    }
    
    */

    return {
        states,
        errors,
        actions: {
            handleClickSubmitButton,
            onChange,
        },
    }
}
