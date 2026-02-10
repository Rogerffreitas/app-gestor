import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { MaterialDto } from '../../../domin/entity/material/MaterialDto'
import DepositDto from '../../../domin/entity/deposit/DepositDto'
import { MaterialServices } from '../../../domin/services/interfaces/MaterialServices'

type MaterialsListPros = {
    materialServices: MaterialServices
    deposit: DepositDto
    navigation: any
}

export default function useMaterialsList({
    materialServices,
    deposit,
    navigation,
}: MaterialsListPros) {
    const [materials, setMaterials] = useState<MaterialDto[]>([])
    const { user } = useAuth()
    const [load, setLoad] = useState(true)
    const [loadingList, setLoadingList] = useState(true)

    async function getAllMaterials() {
        setLoadingList(true)
        navigation.addListener('focus', () => setLoad(!load))
        const result =
            await materialServices.loadAllMaterialByEnterpriseIdAndDepositIdFromLocalDatabase(
                user.enterpriseId,
                deposit.id
            )
        setMaterials(result)
        setLoadingList(false)
    }

    useEffect(() => {
        getAllMaterials()
    }, [load])

    function handleClickEditButton(item: MaterialDto) {
        navigation.navigate('Edit Material', {
            material: item,
            materialServices: materialServices,
        })
    }

    function handleClickNewButton() {
        navigation.navigate('New Material', {
            deposit: deposit,
            materialServices: materialServices,
        })
    }

    return {
        materials,
        loadingList,
        handleClickEditButton,
        handleClickNewButton,
    }
}
