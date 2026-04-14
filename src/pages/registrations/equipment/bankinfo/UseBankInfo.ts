import { useState } from 'react'
import { BankInformation } from '../../../../domin/entity/bank-information/BankInformation'
import { Alert } from 'react-native'
import { Builder } from '../../../../services/Builder'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { useInjection } from '@/src/contexts/InjectionContext'

type BankInfoProp = RouteProp<RootStackParamList, ScreenNames.EDIT_EQUIPMENT>

export default function useBankInfo() {
    const equipmentServices = useInjection('EquipmentServices')
    const navigation = useNavigation()
    const route = useRoute<BankInfoProp>()
    const { equipment } = route.params

    const [bankInformation, setBankInformation] = useState({
        bank: equipment.bank,
        agency: equipment.agency,
        account: equipment.account,
        beneficiary: equipment.beneficiary,
        pix: equipment.pix,
    })
    const [isLoading, setIsLoading] = useState(false)

    async function handleClickEditButton() {
        if (equipment.id == undefined || null) {
            Alert.alert('Error  ')
            navigation.goBack()
        }
        try {
            setIsLoading(true)
            await equipmentServices.updateEquipmentBankInformation(
                equipment.id,
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
        actions: {
            handleClickEditButton,
            onChange,
        },
    }
}
