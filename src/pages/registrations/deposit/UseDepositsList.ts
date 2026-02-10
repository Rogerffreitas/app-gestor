import { useEffect, useState } from 'react'
import { DepositServices } from '../../../domin/services/interfaces/DepositServices'
import DepositDto from '../../../domin/entity/deposit/DepositDto'
import { MaterialDto } from '../../../domin/entity/material/MaterialDto'
import { useAuth } from '../../../contexts/AuthContext'
import { MaterialServices } from '../../../domin/services/interfaces/MaterialServices'

type MaterialsListPros = {
    depositServices: DepositServices
    materialServices: MaterialServices
    navigation: any
}

export default function useDepositsList({
    depositServices,
    navigation,
    materialServices,
}: MaterialsListPros) {
    const [deposits, setDeposits] = useState<DepositDto[]>([])
    const [deposit, setDeposit] = useState<DepositDto>()
    const [materiais, setMateriais] = useState<MaterialDto[]>([])
    const { user } = useAuth()
    const [load, setLoad] = useState(true)
    const [loadingList, setLoadingList] = useState(true)

    useEffect(() => {
        getAllDeposit()
    }, [load])

    async function getAllDeposit() {
        navigation.addListener('focus', () => setLoad(!load))
        const result = await depositServices.loadAllDepositByEnterpriseIdFromLocalDatabase(
            user.enterpriseId
        )
        setDeposits(result)
        setLoadingList(false)
    }

    function handleClickItemList(item: DepositDto) {
        navigation.navigate('Materials', {
            deposit: item,
            materialServices: materialServices,
        })
    }

    /*async function getAllMaterials(id) {
        setLoadingList(true)
        const result = await getAllMateriais(user.enterpriseId, id)
        setMateriais(result)
        setLoadingList(false)
    }*/

    function handleClickNewButton() {
        navigation.navigate('New Deposit', { depositServices: depositServices })
    }

    function handleClickEditButton(item: DepositDto) {
        navigation.navigate('Edit Deposit', {
            deposit: item,
            depositServices: depositServices,
        })
    }

    return {
        deposits,
        loadingList,
        setDeposit,
        handleClickEditButton,
        handleClickNewButton,
        handleClickItemList,
    }
}
