import { useState } from 'react'
import { BankInformation } from '../../../../domin/entity/bank-information/BankInformation'
import { Alert } from 'react-native'
import { Builder } from '../../../../services/Builder'
import { TransportVehicleServices } from '../../../../domin/services/interfaces/TransportVehicleServices'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'

type BankInfoProps = {
    transportVehicle: TransportVehicleDto
    transportVehicleServices: TransportVehicleServices
    navigation: any
}

export default function useBankInfo({
    transportVehicle,
    transportVehicleServices,
    navigation,
}: BankInfoProps) {
    const [bankInformation, setBankInformation] = useState({
        bank: transportVehicle.bank,
        agency: transportVehicle.agency,
        account: transportVehicle.account,
        beneficiary: transportVehicle.beneficiary,
        pix: transportVehicle.pix,
    })
    const [isLoading, setIsLoading] = useState(false)

    async function handleClickEditButton() {
        if (transportVehicle.id == undefined || null) {
            Alert.alert('Error  ')
            navigation.goBack()
        }
        try {
            setIsLoading(true)
            await transportVehicleServices.updateTransportVehicleBankInformation(
                transportVehicle.id,
                Builder<BankInformation>()
                    .bank(bankInformation.bank)
                    .agency(bankInformation.agency)
                    .account(bankInformation.account)
                    .beneficiary(bankInformation.beneficiary)
                    .pix(bankInformation.pix)
                    .build()
            )
            Alert.alert('Informações de pagamento cadastradas!')
            navigation.goBack()
        } catch (error) {
            console.error(error)
            Alert.alert(
                'Ocorreu um erro ao tentar atualizar as informações de pagamento',
                'Menssagem: ' + error
            )
        } finally {
            setIsLoading(false)
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setBankInformation((state) => ({ ...state, [name]: value }))
        }
    }

    return {
        bankInformation,
        isLoading,
        handleClickEditButton,
        onChange,
    }
}
