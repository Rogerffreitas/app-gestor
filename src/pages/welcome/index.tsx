import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Alert, PermissionsAndroid, Platform, StatusBar, View } from 'react-native'
import theme from '../../global/styles/theme'

function App({ navigation }) {
    const [isLoading, setIsLoading] = useState(false)
    const [load, setLoad] = useState(true)
    const { signIn, setFirstAccess } = useAuth()
    const [loadingList, setLoadingList] = useState(true)
    const [premission, setPermission] = useState(false)

    useEffect(() => {
        hasAndroidPermission()
    }, [load])

    async function hasAndroidPermission() {
        navigation.addListener('focus', () => setLoad(!load))
        if (Number(Platform.Version) >= 33) {
            setPermission(true)
            return
        }

        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE

        const hasPermission = await PermissionsAndroid.check(permission)
        if (hasPermission) {
            setPermission(true)
            return
        }

        const status = await PermissionsAndroid.request(permission)
        if (status === 'granted') {
            setPermission(true)
        } else {
            setPermission(false)
            Alert.alert('Para acessar o aplicativo você precisar aceitar as Permissões')
        }
    }

    return (
        <LinearGradient
            // Button Linear Gradient
            colors={['#009999', '#00999930', '#00999930', '#009999']}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container>
                <StatusBar backgroundColor={theme.colors.primary}></StatusBar>
                <ViewComponent>
                    <ImageIcon
                        source={require('../../../assets/image/icon.png')}
                        style={{ width: 150, height: 150 }}
                    />
                    <Text1>Bem vindo!</Text1>
                    <Text2>Aplicativo para acompanhamento de transporte de material para obra</Text2>
                    {premission ? (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <ButtonStyled
                                onPress={() => {
                                    setFirstAccess(false)
                                }}
                            >
                                <TextContent>INICIAR</TextContent>
                            </ButtonStyled>
                        </View>
                    ) : (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <Text3>Aplicativo precisa de algumas premissões</Text3>
                            <ButtonStyled onPress={hasAndroidPermission}>
                                <TextContent>Permissões</TextContent>
                            </ButtonStyled>
                        </View>
                    )}
                </ViewComponent>
            </Container>
        </LinearGradient>
    )
}

const ImageIcon = styled.Image`
    height: 100px;
    width: 100px;
    margin-bottom: 15px;
`

const Container = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
`

const Text1 = styled.Text`
    width: 100%;
    font-size: 25px;
    font-weight: bold;
    color: #000;

    text-align: center;
`
const Text2 = styled.Text`
    width: 100%;
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    color: #000;
    text-align: center;
`

const Text3 = styled.Text`
    width: 100%;
    margin-top: 50px;
    font-size: 20px;
    font-weight: bold;
    color: #000;
    text-align: center;
`

const ButtonStyled = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.menu};
    border-radius: 5px;
    margin-top: 10px;
    width: 90%;
    align-items: center;
    padding: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
`

const ViewComponent = styled.View`
    background-color: #fff;
    width: 90%;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
`

const TextContent = styled.Text`
    font-size: 20px;
    align-self: center;
    color: #fff;
    font-weight: bold;
`

export default App
