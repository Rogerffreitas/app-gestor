import { useEffect, useState } from 'react'
import { useAuth } from '../../../../contexts/AuthContext'
import { useConfig } from '../../../../contexts/ConfigContext'
import { Alert, ToastAndroid } from 'react-native'
import { errorVibration, successVibration } from '../../../../services/VibrationService'
import WorkDto from '@gestor/domain/entity/work/WorkDto'
import { UserRoles } from '../../../../types'
import UserDto from '@gestor/domain/entity/user/UserDto'
import { StrictBuilder } from '../../../../services/StrictBuilder'
import { useNavigation } from '@react-navigation/native'
import { useSync } from '@/src/infra/hooks/UseSync'
import { useInjection } from '@/src/contexts/InjectionContext'

type UserSelectionList = {
    key: string
    value: string
}

export default function useNewWork() {
    const workServices = useInjection('WorkServices')
    const userServices = useInjection('UserServices')
    const navigation = useNavigation()
    const { performSync } = useSync()

    const [states, setStates] = useState({
        name: '',
        description: '',
        pickets: 0,
        usersList: '',
        isLoading: false,
        sync: false,
    })
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        pickets: '',
        usersList: '',
    })
    const [usersSelectList, setUsersSelectList] = useState<UserSelectionList[]>()
    const [bdUser, setBDUser] = useState<UserDto[]>([])
    const [selected, setSelected] = useState([])
    const { user, token } = useAuth()
    const { config } = useConfig()

    useEffect(() => {
        getUsers()
    }, [])

    async function getUsers() {
        let list: UserSelectionList[] = []

        try {
            const response = await userServices.getAllRecordsByHttpRequest(
                {
                    baseURL: config.urlApi,
                    url: '/auth/users',
                    params: { enterpriseId: user.enterpriseId },
                    token: token,
                },
                user.role
            )

            if (response.length == 0) {
                return
            }

            response.forEach((item) => {
                if (item.role != UserRoles.ADMIN) {
                    list.push({ key: item.id, value: item.name })
                }
            })
            setBDUser(response)
            setUsersSelectList(list)
            setErrors((state) => ({ ...state, usersList: null }))
        } catch (error) {
            setErrors((state) => ({ ...state, usersList: 'Erro a buscar usuários' }))
            ToastAndroid.show('Erro a buscar usuários', ToastAndroid.LONG)
        } finally {
        }
    }
    async function handlerSubmitButton() {
        if (user.id == null || user.enterpriseId == null) {
            Alert.alert('Error')
            navigation.goBack()
        }

        try {
            setStates((state) => ({ ...state, isLoading: true }))

            const work = StrictBuilder<WorkDto>()
                .name(states.name)
                .description(states.description)
                .pickets(states.pickets)
                .usersList(states.usersList)
                .enterpriseId(user.enterpriseId)
                .userId(user.id)
                .build()
            await workServices.createWorkInLocalDatabase(work, changeErrorFields)
            successVibration()
            Alert.alert('Obra Cadastrada')
            performSync()
            navigation.goBack()
        } catch (error) {
            if (error.message == 'Entity validation failed') {
                errorVibration()
                ToastAndroid.show('Preencha todos os campos obrigatórios', ToastAndroid.LONG)
                return
            }
            Alert.alert('Erro ao tentar salvar a obra', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setStates((state) => ({ ...state, isLoading: false }))
        }
    }

    function onChange(name: any) {
        return (value: any) => {
            setStates((state) => ({ ...state, [name]: value }))
            setErrors((state) => ({ ...state, [name]: null }))
        }
    }

    function changeErrorFields(name: string) {
        return (value: string) => {
            setErrors((state) => ({ ...state, [name]: value }))
        }
    }

    function onSelect() {
        let userId = '|'
        selected.forEach((item) => {
            bdUser.forEach((user) => {
                if (user.id == item) {
                    userId = userId + user.username + '-' + user.id + '|'
                }
            })
        })
        setStates((state) => ({ ...state, usersList: userId }))
    }

    return {
        states,
        errors,
        usersSelectList,
        actions: { setSelected, handlerSubmitButton, onSelect, onChange },
    }
}
