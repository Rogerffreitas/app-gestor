import React, { createContext, useContext, useEffect, useState } from 'react'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import User from '../interfaces/User'
import * as SecureStore from 'expo-secure-store'
import Token from '../interfaces/Token'
import { HttpRequest } from '@domin/entity/http/dtos/HttpRequest'
import { jwtDecode } from 'jwt-decode'
import UserDto from '@domin/entity/user/UserDto'
import EnterpriseDto from '../interfaces/EnterpriseDto'
import { useInjection } from './InjectionContext'

type AuthContextProviderProps = {
    children?: React.ReactNode | undefined
}

type AuthContextType = {
    token: Token
    firstAccess: boolean
    signed: boolean
    user: User | undefined
    enterprise: EnterpriseDto
    loading: boolean
    setFirstAccess: (acesso: boolean) => void
    signIn: (username: string, senha: string) => void
    signOut: () => void
}

type jwtDecode = {
    user: UserDto
    enterprise: EnterpriseDto
}

const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const authServices = useInjection('AuthServices')

    const [firstAccess, setFirstAccess] = useState(true)
    const [user, setUser] = useState<User>()
    const [enterprise, setEnterprise] = useState<EnterpriseDto>()
    const [token, setToken] = useState<Token>()
    const [loading, setLoading] = useState(true)

    async function signIn(username: string, password: string) {
        try {
            const { accessToken } = await authServices.loginByUsernameAndPassword({
                baseURL: process.env.EXPO_PUBLIC_URL_API,
                url: '/auth/signin',
                body: { username, password },
            } as HttpRequest)
            const decoded = jwtDecode<jwtDecode>(accessToken.token)
            setEnterprise(decoded.enterprise)
            setUser(decoded.user)
            setToken(accessToken)

            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_KEY_SECURE_STORE_USER,
                JSON.stringify(decoded.user)
            )
            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_KEY_SECURE_STORE_TOKEN,
                JSON.stringify(accessToken)
            )
            await SecureStore.setItemAsync(
                process.env.EXPO_PUBLIC_KEY_SECURE_STORE_ENTERPRISE,
                JSON.stringify(decoded.enterprise)
            )
        } catch (error) {
            console.log(error)
            if (error) {
                Alert.alert('⚠️ Ocorreu um erro ao tentar fazer login!', `Messagem: ${error}`)
            }
        }
    }
    function signOut() {
        SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_USER).then(() => {
            setUser(null)
        })
        SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_TOKEN).then(() => {
            setToken(null)
        })

        SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_ENTERPRISE).then(() => {
            setEnterprise(null)
        })
    }

    async function getUserFromStore() {
        if (Number(Platform.Version) >= 33) {
            setFirstAccess(false)
        } else {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            setFirstAccess(!granted)
        }

        let resultUser = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_USER)
        let resultToken = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_KEY_SECURE_STORE_TOKEN)
        let resultEnterprise = await SecureStore.getItemAsync(
            process.env.EXPO_PUBLIC_KEY_SECURE_STORE_ENTERPRISE
        )

        setUser(await JSON.parse(resultUser))
        setToken(await JSON.parse(resultToken))
        setEnterprise(await JSON.parse(resultEnterprise))
        setLoading(false)
    }

    useEffect(() => {
        getUserFromStore()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                token,
                firstAccess,
                setFirstAccess,
                signed: !!user,
                user,
                enterprise,
                loading,
                signIn,
                signOut,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    return context
}
