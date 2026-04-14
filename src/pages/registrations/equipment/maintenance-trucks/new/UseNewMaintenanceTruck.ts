import React, { useEffect, useState } from 'react'
import WorkEquipmentDto from '../../../../../domin/entity/work-equipment/WorkEquipmentDto'
import { useAuth } from '../../../../../contexts/AuthContext'
import UserDto from '../../../../../domin/entity/user/UserDto'
import { RootStackParamList, ScreenNames, UserRoles } from '../../../../../types'
import { errorVibration, successVibration } from '../../../../../services/VibrationService'
import { Alert, ToastAndroid } from 'react-native'
import { StrictBuilder } from '../../../../../services/StrictBuilder'
import { MaintenanceTruckDto } from '../../../../../domin/entity/maintenance-truck/MaintenanceTruckDto'
import { useConfig } from '../../../../../contexts/ConfigContext'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { useSync } from '@/src/infra/hooks/UseSync'
import { useInjection } from '@/src/contexts/InjectionContext'

type UserSelectionList = {
    key: string
    value: string
}

type NewMaintenanceTrucksProp = RouteProp<RootStackParamList, ScreenNames.NEW_MAINTENANCE_TRUCKS>

export default function useNewMaintenanceTrucks() {
    const userServices = useInjection('UserServices')
    const workEquipmentServices = useInjection('WorkEquipmentServices')
    const maintenanceTruckServices = useInjection('MaintenanceTruckServices')
    const navigation = useNavigation()
    const route = useRoute<NewMaintenanceTrucksProp>()
    const { workId, workEquipmentIds } = route.params
    const { performSync } = useSync()
    const [states, setStates] = useState({
        capacity: 0,
        usersList: null,
        sync: false,
        isLoading: false,
        isLoadingList: true,
        workEquipments: [] as WorkEquipmentDto[],
        workEquipment: null as WorkEquipmentDto,
        selectedWorkEquipment: null as WorkEquipmentDto,
        bdUsers: [] as UserDto[],
        usersSelectList: [] as UserSelectionList[],
    })
    const [selected, setSelected] = useState([])
    const [errors, setErrors] = useState({
        usersList: '',
        capacity: '',
    })
    const { user, token } = useAuth()
    const { config } = useConfig()
    async function loadAll() {
        try {
            const usersPromise = userServices.getAllRecordsByHttpRequest(
                {
                    baseURL: config.urlApi,
                    url: '/auth/users',
                    params: { enterpriseId: user.enterpriseId },
                    token: token,
                },
                user.role
            )

            const equipmenstsPromise =
                workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
                    user.enterpriseId,
                    workId
                )
            const [usersResults, equipmentsResults] = await Promise.all([usersPromise, equipmenstsPromise])

            let usersSelect = [] as UserSelectionList[]
            if (usersResults && usersResults.length > 0) {
                usersResults.forEach((item) => {
                    if (item.role !== UserRoles.ADMIN) {
                        usersSelect.push({ key: item.id, value: item.name })
                    }
                })
            }

            let equip = [] as typeof equipmentsResults
            if (equipmentsResults && equipmentsResults.length > 0) {
                equip = equipmentsResults.reduce(
                    (acc, item) => {
                        const isNotSelected = !workEquipmentIds.includes(item.id)
                        if (isNotSelected && !item.equipment.isEquipment) {
                            acc.push(item)
                        }
                        return acc
                    },
                    [] as typeof equipmentsResults
                )
            }

            setStates((state) => ({
                ...state,
                workEquipments: equip,
                bdUsers: usersResults,
                usersSelectList: usersSelect,
            }))
        } catch (error) {
            console.info(error)
            Alert.alert(`Erro ao tentar carregar lista: ${error}`)
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
    }, [navigation, workId])

    async function handleSubmitButton() {
        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const maintenanceTruckDto = StrictBuilder<MaintenanceTruckDto>()
                .capacity(states.capacity)
                .nameProprietary(states.workEquipment.equipment.nameProprietary)
                .operatorMotorist(states.workEquipment.operatorMotorist)
                .modelOrPlate(states.workEquipment.equipment.modelOrPlate)
                .usersList(states.usersList)
                .workEquipmentId(states.workEquipment.id)
                .workId(workId)
                .userId(user.id)
                .enterpriseId(user.enterpriseId)
                .build()
            const createdEntity = await maintenanceTruckServices.createMaintenanceTruckInLocalDatabase(
                maintenanceTruckDto,
                changeErrorFields
            )
            if (createdEntity) {
                successVibration()
                Alert.alert('Equipamento(s) Cadastrado(s) na obra')
                performSync()
                navigation.goBack()
            }
        } catch (error) {
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show(`Preencha todos os campos obrigatórios`, ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar criar cadastro', `Messagem ${error}`)
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
    function handleSelectionConfirmation() {
        setStates((state) => ({ ...state, workEquipment: states.selectedWorkEquipment }))
    }

    function selectWorkEquipment(item: WorkEquipmentDto) {
        setStates((state) => ({ ...state, selectedWorkEquipment: item }))
    }

    function clearValues() {
        setStates((state) => ({
            ...state,
            isLoading: false,
            workEquipment: null,
            selectedWorkEquipment: null,
            usersList: null,
            capacity: null,
        }))
    }

    function onSelect() {
        let userId = '|'
        selected.forEach((item) => {
            states.bdUsers.forEach((user) => {
                if (user.id === item) {
                    userId = userId + user.username + '-' + user.id + '|'
                }
            })
        })
        setStates((state) => ({ ...state, usersList: userId }))
        setErrors((prev) => ({ ...prev, userList: null }))
    }

    return {
        states,
        errors,
        actions: {
            onSelect,
            setStates,
            handleSubmitButton,
            onChange,
            handleSelectionConfirmation,
            selectWorkEquipment,
            clearValues,
            setSelected,
        },
    }
}
