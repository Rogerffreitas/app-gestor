import React from 'react'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function ButtonDropListItemFatura({
    onPress,
    titulo,
    corIcon,
    nomeIcon,
    tamanho,
}: any) {
    return (
        <Card onPress={onPress} activeOpacity={1}>
            <CardContent>
                <TitleContentView>
                    <TextTitle>{titulo}</TextTitle>
                </TitleContentView>
                <Icon style={{ backgroundColor: corIcon }}>
                    <FontAwesome name={nomeIcon} size={tamanho} style={{ color: '#fff' }} />
                </Icon>
            </CardContent>
        </Card>
    )
}

const Card = styled.TouchableOpacity`
    height: 50px;
    width: 95%;
    margin-top: 5px;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`
const CardContent = styled.View`
    width: 100%;
    height: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`

const TextTitle = styled.Text`
    font-size: 17px;
    color: #fff;
    font-weight: bold;
    text-align: center;
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

const Icon = styled.View`
    border-radius: 30px;
    height: 30px;
    width: 30px;
    margin-right: 15px;
    justify-content: center;
    align-items: center;
`
