import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'

type EditTransportVehicleProp = RouteProp<RootStackParamList, ScreenNames.EDIT_TRANSPORT_VEHICLE>

export default function useEditTransportVehicle() {
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const navigation = useNavigation()
    const route = useRoute<EditTransportVehicleProp>()
    const { transportVehicleId } = route.params

    const [states, setStates] = useState({
        transportVehicle: null as TransportVehicleDto,
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

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadTranpostVehicle()
        })
        return unsubscribe
    }, [navigation])

    async function loadTranpostVehicle() {
        try {
            const result =
                await transportVehicleServices.findTransportVehicleByIdInLocalDatabase(transportVehicleId)

            setStates((state) => ({ ...state, transportVehicle: result }))
            setStates((state) => ({ ...state, motorist: result.motorist }))
            setStates((state) => ({ ...state, plate: result.plate }))
            setStates((state) => ({ ...state, color: result.color }))
            setStates((state) => ({ ...state, capacity: result.capacity }))
            setStates((state) => ({ ...state, proprietaryName: result.nameProprietary }))
            setStates((state) => ({ ...state, cpfCnpj: result.cpfCnpjProprietary }))
            setStates((state) => ({ ...state, tel: result.telProprietary }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    async function handleClickEditButton() {
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
                .workId(states.transportVehicle.workId)
                .id(states.transportVehicle.id)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()

            const updatedEntity = await transportVehicleServices.updateTransportVehicleInLocalDatabase(
                dto,
                changeErrorFields
            )

            if (updatedEntity.id) {
                successVibration()
                //sincronizar()
                Alert.alert('Caçamba atualizada!')
                navigation.goBack()
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar atualizar o Veículo', error)
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

    async function handleClickDeleteButton() {
        if (states.transportVehicle.id == null) {
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            await transportVehicleServices.deleteTransportVehicleInLocalDatabase(
                states.transportVehicle.id,
                user.id
            )
            Alert.alert('Caçamba apagada!')
            successVibration()
            navigation.goBack()
        } catch (err) {
            if (err.message == 'Não é possível apagar o Veiculo') {
                Alert.alert(err.message, 'Já existe(m) apontamento(s) para esse Veiculo')
            }
            console.log(err.message)
        }
    }

    const showConfirmDialog = () => {
        return Alert.alert('Deseja apagar a Obra?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    handleClickDeleteButton()
                },
            },

            {
                text: 'NÃO',
            },
        ])
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
            showConfirmDialog,
            handleClickEditButton,
            onChange,
        },
    }
}
