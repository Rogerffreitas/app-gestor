import { useState } from 'react'
import { EquipmentServices } from '../../../../domin/services/interfaces/EquipmentServices'
import { BankInformation } from '../../../../domin/entity/bank-information/BankInformation'
import { Alert } from 'react-native'
import { Builder } from '../../../../services/Builder'

type BankInfoProps = {
    equipmentId: string
    bankInfo: BankInformation
    equipmentServices: EquipmentServices
    navigation: any
}

export default function useBankInfo({ equipmentId, bankInfo, equipmentServices, navigation }: BankInfoProps) {
    const [bankInformation, setBankInformation] = useState({
        bank: bankInfo.bank,
        agency: bankInfo.agency,
        account: bankInfo.account,
        beneficiary: bankInfo.beneficiary,
        pix: bankInfo.pix,
    })
    const [isLoading, setIsLoading] = useState(false)

    async function handleClickEditButton() {
        if (equipmentId == undefined || null) {
            Alert.alert('Error  ')
            navigation.goBack()
        }
        try {
            setIsLoading(true)
            await equipmentServices.updateEquipmentBankInformation(
                equipmentId,
                Builder<BankInformation>()
                    .bank(bankInformation.bank)
                    .agency(bankInformation.agency)
                    .account(bankInformation.account)
                    .beneficiary(bankInformation.beneficiary)
                    .pix(bankInformation.pix)
                    .build()
            )
            Alert.alert('Informações de pagamento editadas')
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
