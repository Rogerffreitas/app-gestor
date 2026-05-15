import { useEffect, useState } from 'react'
import { BankInformation } from '@gestor/domain/entity/bank-information/BankInformation'
import { Alert } from 'react-native'
import { Builder } from '../../../../services/Builder'
import TransportVehicleDto from '@gestor/domain/entity/transport-vehicle/TransportVehicleDto'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { errorVibration } from '../../../../services/VibrationService'
import { useInjection } from '@/src/contexts/InjectionContext'

type BankInfoProp = RouteProp<RootStackParamList, ScreenNames.BANK_INFO_TRANSPORT_VEHICLE>

export default function useBankInfo() {
    const transportVehicleServices = useInjection('TransportVehicleServices')
    const navigation = useNavigation()
    const route = useRoute<BankInfoProp>()
    const { transportVehicleId } = route.params

    const [bankInformation, setBankInformation] = useState({
        bank: null,
        agency: null,
        account: null,
        beneficiary: null,
        pix: null,
    })

    const [states, setStates] = useState({
        transportVehicle: null as TransportVehicleDto,
        isLoadingList: true,
        isLoading: false,
        isSync: false,
    })

    async function loadBankInfo() {
        try {
            const result =
                await transportVehicleServices.findTransportVehicleByIdInLocalDatabase(transportVehicleId)

            setStates((state) => ({ ...state, transportVehicle: result }))
            setBankInformation((state) => ({ ...state, bank: result.bank }))
            setBankInformation((state) => ({ ...state, agency: result.agency }))
            setBankInformation((state) => ({ ...state, account: result.account }))
            setBankInformation((state) => ({ ...state, beneficiary: result.beneficiary }))
            setBankInformation((state) => ({ ...state, pix: result.pix }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadBankInfo()
        })
        return unsubscribe
    }, [navigation])

    async function handleClickEditButton() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))
            const result = await transportVehicleServices.updateTransportVehicleBankInformation(
                states.transportVehicle.id,
                Builder<BankInformation>()
                    .bank(bankInformation.bank)
                    .agency(bankInformation.agency)
                    .account(bankInformation.account)
                    .beneficiary(bankInformation.beneficiary)
                    .pix(bankInformation.pix)
                    .build()
            )
            //console.log(result)
            Alert.alert('Informações de pagamento cadastradas!')
            navigation.goBack()
        } catch (error) {
            console.error(error)
            Alert.alert(
                'Ocorreu um erro ao tentar atualizar as informações de pagamento',
                'Menssagem: ' + error
            )
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setBankInformation((state) => ({ ...state, [name]: value }))
        }
    }

    return {
        bankInformation,
        states,
        actions: {
            handleClickEditButton,
            onChange,
        },
    }
}
