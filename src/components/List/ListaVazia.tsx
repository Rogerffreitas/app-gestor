import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

export default function () {
    return (
        <View
            style={{
                width: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ListaVazia>
                <TextoListaVazia>Dados não localizados</TextoListaVazia>
                <TextoListaVazia>ou não cadastrados</TextoListaVazia>
            </ListaVazia>
        </View>
    )
}

const ListaVazia = styled.View`
    width: 90%;
    padding: 15px;
    border-radius: 10px;
    justify-content: center;
    background-color: ${(props) => props.theme.colors.menu};
`
const TextoListaVazia = styled.Text`
    color: #fff;
    font-size: 30px;
    font-weight: bold;
`
