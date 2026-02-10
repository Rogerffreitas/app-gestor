import React, { useRef } from 'react'
import styled, { useTheme } from 'styled-components/native'
import Container from '../../components/Container'
import LottieView from 'lottie-react-native'
import HeaderHome from '../../components/HeaderHome'
import { useAuth } from '../../contexts/AuthContext'
import { UserRoles } from '../../types'

export default function Home({ navigation }) {
    const { user } = useAuth()
    const theme = useTheme()
    const animation = useRef(null)

    const clickEventListener = (stack: any) => {
        navigation.navigate(stack)
    }

    return (
        <Container>
            <HeaderHome />
            <Content>
                <ButtonStyled onPress={() => clickEventListener('Notes')}>
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 90, height: 90 }}
                            source={require('../../assets/truck2.json')}
                        />
                    </ImageStyled>
                    <TextContent>
                        <TextContent>Apontamentos</TextContent>
                    </TextContent>
                </ButtonStyled>
                {user.role === UserRoles.ADMIN ? (
                    <ButtonStyled onPress={() => clickEventListener('Cadastros')}>
                        <ImageStyled>
                            <LottieView
                                autoPlay
                                ref={animation}
                                style={{ width: 60, height: 60 }}
                                source={require('../../assets/task.json')}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Cadastros</TextContent>
                        </TextContent>
                    </ButtonStyled>
                ) : (
                    <></>
                )}

                <ButtonStyled onPress={() => clickEventListener('Perfil')}>
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 60, height: 60 }}
                            source={require('../../assets/profile.json')}
                        />
                    </ImageStyled>
                    <TextContent>
                        <TextContent>Perfil</TextContent>
                    </TextContent>
                </ButtonStyled>

                {user.role === UserRoles.ADMIN ? (
                    <ButtonStyled onPress={() => clickEventListener('Configuracao')}>
                        <ImageStyled>
                            <LottieView
                                autoPlay
                                ref={animation}
                                style={{ width: 60, height: 60 }}
                                source={require('../../assets/setting-gears.json')}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Configuração</TextContent>
                        </TextContent>
                    </ButtonStyled>
                ) : (
                    <></>
                )}
            </Content>
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
    font-size: 30px;
    flex: 1;
    align-self: center;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
`
const Content = styled.View`
    width: 100%;
    flex: 1;
    align-content: center;
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
