import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components/native'
import Container from '../../components/Container'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { useConfig } from '../../contexts/ConfigContext'
import formatarData from '../../services/formatarData'

export default function Perfil({ navigation }) {
    const [load, setLoad] = useState(true)
    const [serverStatus, setServerStatus] = useState(false)
    const Config = useConfig()
    const Auth = useAuth()

    useEffect(() => {
        _getAll()
    }, [load])

    async function _getAll() {
        navigation.addListener('focus', () => setLoad(!load))

        await axios
            .get(Config.urlApi + 'status', {
                headers: {
                    Authorization: Auth.token ? `Bearer ${Auth.token.token}` : '',
                },
            })
            .then(() => setServerStatus(true))
            .catch((reason) => {
                setServerStatus(false)
                console.log(reason)
            })
    }
    return (
        <Container>
            <Card>
                <TextTitle>Status do Servidor:</TextTitle>
                <TextContent>{serverStatus ? 'Online' : 'Offline'}</TextContent>
                <TextTitle>Última sincronização com o servidor:</TextTitle>
                <TextContent>{formatarData(Config.lastConectionServer)}</TextContent>
                <TextTitle>Metros por estacas</TextTitle>
                <TextContent>{Config.espacoEstacaMetro} Metros</TextContent>
            </Card>
        </Container>
    )
}

const ViewFoto = styled.View`
    background-color: #fff;
    width: 10%;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
`
const Card = styled.View`
    margin-bottom: 40px;
    border-radius: 15px;
    height: 80%;
    padding: 20px;
    width: 90%;
    background-color: #fff;
    align-items: center;
`

const TextContent = styled.Text`
    padding: 5px;
    border-radius: 5px;
    margin-top: 4px;
    width: 90%;
    font-size: 15px;
    justify-content: flex-start;
    background-color: #c2c2c2;
`
const TextTitle = styled.Text`
    margin-top: 15px;
    width: 90%;
    font-size: 12px;
    font-weight: bold;
    justify-content: flex-start;
`
