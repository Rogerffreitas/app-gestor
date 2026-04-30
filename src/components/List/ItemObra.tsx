import React from 'react'
import styled from 'styled-components/native'

type CardComponentProps = {
    titulo: string
    descricao: string
    active: number
    onPress: any
}

export default function (props: CardComponentProps) {
    return (
        <Card onPress={props.onPress} activeOpacity={props.active}>
            <CardContent>
                <TextTitulo>{props.titulo}</TextTitulo>
                <TextDescricao>{props.descricao}</TextDescricao>
            </CardContent>
        </Card>
    )
}

const Card = styled.TouchableOpacity`
    width: 100%;
    align-items: center;
    margin-bottom: 10px;
`

const CardContent = styled.View`
    width: 95%;
    height: 80px;
    background-color: #fff;
`

const TextTitulo = styled.Text`
    background-color: ${(props) => props.theme.colors.menu};
    width: 100%;
    padding: 10px;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`

const TextDescricao = styled.Text`
    font-size: 14px;
    flex: 1;
    color: #696969;
    margin-top: 1px;
    margin-left: 10px;
    font-weight: bold;
`
