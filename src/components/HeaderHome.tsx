import React, { useRef } from 'react'
import styled from 'styled-components/native'
import { useAuth } from '../contexts/AuthContext'
import LottieView from 'lottie-react-native'
import SyncIndicator from './HomeIndicator'

export default function HeaderHome() {
    const { user, enterprise } = useAuth()
    const animation = useRef(null)
    return (
        <ConteinerHeader>
            <ViewFoto>
                <LottieView
                    autoPlay
                    ref={animation}
                    style={{ width: 40, height: 40 }}
                    source={require('../assets/profile.json')}
                />
            </ViewFoto>
            <ViewUser>
                <Text>{user.name}</Text>
                <TextEmpresa>{enterprise.name}</TextEmpresa>
            </ViewUser>
            <ViewInfo>
                <SyncIndicator />
            </ViewInfo>
        </ConteinerHeader>
    )
}

const ConteinerHeader = styled.View`
    height: 60px;
    flex-direction: row;
    padding: 10px;
    margin-top: 30px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.menu};
`

const ViewFoto = styled.View`
    background-color: #fff;
    width: 10%;
    border-radius: 30px;
    justify-content: center;
    align-items: center;
`
const ViewUser = styled.View`
    width: 50%;
    padding: 5px;
    justify-content: center;
`
const ViewInfo = styled.View`
    width: 35%;
`

const Text = styled.Text`
    font-size: 20px;
    color: #fff;
    font-weight: bold;
`

const TextEmpresa = styled.Text`
    font-size: 15px;
    color: #fff;
`
