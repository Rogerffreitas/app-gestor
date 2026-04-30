import React, { useRef } from 'react'
import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'
import Container from '../../components/Container'
import { useAuth } from '../../contexts/AuthContext'

export default function Perfil() {
    const { user, enterprise } = useAuth()
    const animation = useRef(null)
    return (
        <Container>
            <Card>
                <ViewFoto>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{ width: 140, height: 140 }}
                        source={require('../../assets/profile.json')}
                    />
                </ViewFoto>
                <TextTitle>Nome:</TextTitle>
                <TextContent>{user.name}</TextContent>
                <TextTitle>Email:</TextTitle>
                <TextContent>{user.email}</TextContent>
                <TextTitle>Nível de premisão:</TextTitle>
                <TextContent>{user.role}</TextContent>
                <TextTitle>Empresa:</TextTitle>
                <TextContent>{enterprise.name}</TextContent>
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
