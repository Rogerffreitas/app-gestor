import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import WorkEquipmentDto from '@domin/entity/work-equipment/WorkEquipmentDto'
import { Alert } from 'react-native'
import { errorVibration } from '../../../../services/VibrationService'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import WorkDto from '@domin/entity/work/WorkDto'
import { useInjection } from '@/src/contexts/InjectionContext'

type WorkEquipmentListProp = RouteProp<RootStackParamList, ScreenNames.WORK_EQUIPMENTS_LIST>

export default function useWorkEquipmentList() {
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const workServices = useInjection('WorkServices')
    const navigation = useNavigation()
    const route = useRoute<WorkEquipmentListProp>()
    const { workId } = route.params

    const [states, setStates] = useState({
        workEquipments: [] as WorkEquipmentDto[],
        work: null as WorkDto,
        isLoadingList: true,
    })

    const { user } = useAuth()

    async function loadAll() {
        try {
            const workPromise = workServices.findWorkByIdInLocalDatabase(workId)
            const workEquipmentsPromise =
                workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdFromLocalDatabase(
                    user.enterpriseId,
                    workId
                )
            const [work, workEquipments] = await Promise.all([workPromise, workEquipmentsPromise])
            setStates((state) => ({ ...state, workEquipments: workEquipments }))
            setStates((state) => ({ ...state, work: work }))
        } catch (error) {
            Alert.alert('Erro ao tentar buscar lista', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoadingList: false }))
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadAll()
        })
        return unsubscribe
    }, [navigation])

    function handleNewWorkEquipment() {
        navigation.navigate(ScreenNames.WORK_EQUIPMENTS, {
            workId: workId,
            equipmentsSelectedIds: states.workEquipments.map((item) => {
                return item.equipment.id
            }),
        })
    }

    async function deleteEquipment(item) {
        try {
            let index = states.workEquipments.findIndex((i) => i.id == item.id)

            let arr = [...states.workEquipments]

            if (index != -1) {
                arr.splice(index, 1)
            }
            setStates((state) => ({ ...state, workEquipments: arr }))

            await workEquipmentServices.deleteWorkEquipmentInLocalDatabase(item.id, user.id)
        } catch (error) {
            console.log(error.message)
            Alert.alert('Erro ao apagar o equipamento', 'Menssagem: ' + error)
            errorVibration()
        }
    }

    function showConfirmDialog(item: WorkEquipmentDto) {
        return Alert.alert('Deseja apagar o equipamento?', 'Para confirmar pressione sim?', [
            {
                text: 'SIM',
                onPress: () => {
                    deleteEquipment(item)
                },
            },

            {
                text: 'NÃO',
            },
        ])
    }

    function goBack() {
        navigation.goBack()
    }

    return {
        states,
        actions: {
            handleNewWorkEquipment,
            showConfirmDialog,
            goBack,
        },
    }
}
