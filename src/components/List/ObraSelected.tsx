import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type CardComponentProps = {
    children?: React.ReactNode | undefined
    titulo: string
    descricao: string
    active: number
    onPress: any
}

export default function (props: CardComponentProps) {
    return (
        <Card onPress={props.onPress} activeOpacity={props.active}>
            <CardContent>
                <ViewTitulo>
                    <TextTitulo>{props.titulo}</TextTitulo>
                    <ViewButtonCancel>
                        <FontAwesome name="close" size={20} color={'#fff'} />
                    </ViewButtonCancel>
                </ViewTitulo>
                <TextDescricao>{props.descricao}</TextDescricao>
                {props.children}
            </CardContent>
        </Card>
    )
}

const ViewTitulo = styled.View`
    background-color: ${(props) => props.theme.colors.selected};
    flex-direction: row;
    justify-content: space-between;
`

const ViewButtonCancel = styled.View`
    height: 35px;
    margin: 5px;
    width: 35px;
    margin-right: 10px;
    background-color: red;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border-color: #fff;
    border-width: 2px;
`

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
