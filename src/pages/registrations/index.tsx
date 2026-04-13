import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, View } from 'react-native'
import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'
import Container from '../../components/Container'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { ScreenNames } from '../../types'
import { useNavigation } from '@react-navigation/native'
import { useNetwork } from '../../contexts/NetworkContext'

export default function Cadastros() {
    const navigation = useNavigation()
    const animation = useRef(null)
    const { isConnected } = useNetwork()

    if (!isConnected) {
        Alert.alert(
            'Você está sem internet',
            'Para ultilizar essas funções é nescessário que você esteja conectado'
        )
    }

    return (
        <Container>
            <View style={{ width: '100%', height: '100%' }}>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate(ScreenNames.WORKS)
                    }}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 80, height: 80 }}
                            source={require('../../assets/obra.json')}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE OBRAS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => navigation.navigate(ScreenNames.DEPOSITS)}
                >
                    <ImageStyled>
                        <Image
                            source={require('../../assets/material.png')}
                            style={{ height: 43, width: 90 }}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE MATERIAIS</TextContent>
                </ButtonStyled>

                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate(ScreenNames.TRANSPORT_VEHICLES)
                    }}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 90, height: 90 }}
                            source={require('../../assets/truck2.json')}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE CAÇAMBAS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate(ScreenNames.EQUIPMENT)
                    }}
                >
                    <ImageStyled>
                        <Image
                            source={require('../../assets/maquina.png')}
                            style={{ height: 35, width: 92 }}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE EQUIPAMENTOS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => navigation.navigate(ScreenNames.FINANCIAL)}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 60, height: 60 }}
                            source={require('../../assets/finaceiro.json')}
                        />
                    </ImageStyled>
                    <TextContent>FINANCEIRO</TextContent>
                </ButtonStyled>
            </View>
        </Container>
    )
}

const ImageStyled = styled.View`
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    align-items: center;
    justify-content: center;
`
const TextContent = styled.Text`
    font-size: 20px;
    flex: 1;
    align-self: center;
    margin-top: 10px;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
`

const ButtonStyled = styled.TouchableOpacity`
    height: 120px;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    background-color: ${(props) => props.theme.colors.menu};
    padding: 5px;
    flex-direction: column;
    border-radius: 10px;
`
