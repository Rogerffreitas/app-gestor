import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

export default function useLogin() {
    const [username, setUsername] = useState('rogerffreitas')
    const [password, setPassword] = useState('senha1234')
    const [erroMsgUsername, setErroMsgUsername] = useState(null)
    const [erroMsgPassword, setErroMsgPassword] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { signIn } = useAuth()

    function handleSubmitButton() {
        if (validar()) {
            signIn(username.trim(), password.trim())

            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 2000)
        }
    }

    function validar() {
        let valido = true
        if (username == null || username.length == 0) {
            setErroMsgUsername('Preencha o campo obrigatório')
            valido = false
        }

        if (password == null || password.length == 0) {
            setErroMsgPassword('Preencha o campo obrigatório')
            valido = false
        }
        return valido
    }

    return {
        erroMsgUsername,
        erroMsgPassword,
        isLoading,
        username,
        password,
        handleSubmitButton,
        setErroMsgUsername,
        setErroMsgPassword,
        setUsername,
        setPassword
    }
}