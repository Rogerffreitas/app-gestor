import React from 'react'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function ButtonDropApontamento({
    onPress,
    numero,
    titulo,
    conteudo,
    corIcon,
    nomeIcon,
    tamanho,
}: any) {
    return (
        <Card onPress={onPress} activeOpacity={1}>
            <CardContent>
                <NumberContentView>
                    <TextNumber>{numero}</TextNumber>
                </NumberContentView>
                <TitleContentView>
                    <TextTitle>{titulo}</TextTitle>
                    <TextConteudo>{conteudo}</TextConteudo>
                </TitleContentView>
                <Icon style={{ backgroundColor: corIcon }}>
                    <FontAwesome name={nomeIcon} size={tamanho} style={{ color: '#fff' }} />
                </Icon>
            </CardContent>
        </Card>
    )
}

const Card = styled.TouchableOpacity`
    height: 60px;
    width: 100%;
    margin-top: 5px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`
const CardContent = styled.View`
    width: 100%;
    height: 100%;
    margin-left: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    background-color: ${(props) => props.theme.colors.menu};
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
`

const TextTitle = styled.Text`
    font-size: 12px;
    color: #fff;
    font-weight: bold;
`

const TextConteudo = styled.Text`
    font-size: 17px;
    color: #fff;
    font-weight: bold;
`

const TextNumber = styled.Text`
    font-size: 25px;
    color: #000;
    font-weight: bold;
    align-items: center;
    justify-content: center;
`

const TitleContentView = styled.View`
    flex: 1;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    margin-left: 5px;
    align-items: flex-start;
    justify-content: flex-start;
`

const NumberContentView = styled.View`
    height: 100%;
    width: 10%;
    background-color: #fff;
    border-top-left-radius: 7px;
    border-bottom-left-radius: 7px;
    align-items: center;
    justify-content: center;
`

const Icon = styled.View`
    border-radius: 30px;
    height: 30px;
    width: 30px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
`
