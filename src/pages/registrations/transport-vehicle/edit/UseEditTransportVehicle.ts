import { useState } from 'react'
import { TransportVehicleServices } from '../../../../domin/services/interfaces/TransportVehicleServices'
import { useAuth } from '../../../../contexts/AuthContext'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import { UserAction } from '../../../../types'

type UseEditTransportVehicleProps = {
    transportVehicle: TransportVehicleDto
    transportVehicleServices: TransportVehicleServices
    navigation
}

export default function useEditTransportVehicle({
    navigation,
    transportVehicleServices,
    transportVehicle,
}: UseEditTransportVehicleProps) {
    const [states, setStates] = useState({
        motorist: transportVehicle.motorist,
        plate: transportVehicle.plate,
        color: transportVehicle.color,
        capacity: transportVehicle.capacity,
        proprietaryName: transportVehicle.nameProprietary,
        cpfCnpj: transportVehicle.cpfCnpjProprietary,
        tel: transportVehicle.telProprietary,
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
                .workId(transportVehicle.workId)
                .serverId(transportVehicle.serverId)
                .id(transportVehicle.id)
                .userId(user.id)
                .userAction(UserAction.UPDATE)
                .enterpriseId(user.enterpriseId)
                .isValid(true)
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
        if (transportVehicle.id == null) {
            Alert.alert('Error')
            navigation.goBack()
        }
        try {
            await transportVehicleServices.deleteTransportVehicleInLocalDatabase(transportVehicle.id, user.id)
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

    const _showConfirmDialog = () => {
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
        _showConfirmDialog,
        handleClickEditButton,
        onChange,
    }
}
