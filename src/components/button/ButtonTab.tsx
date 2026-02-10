import React from 'react'
import { View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import styled from 'styled-components/native'

export default function ButtonTab({ color, onPressFunction }: any) {
    return (
        <View style={{}}>
            <ButtonStyled onPress={() => onPressFunction()}>
                <MaterialIcons name="logout" color={color} size={40} style={{ marginTop: 1 }} />
            </ButtonStyled>
        </View>
    )
}

const ButtonStyled = styled.TouchableOpacity`
    width: 75px;
    height: 75px;
    border-radius: 40px;
    margin-bottom: 20px;
    background-color: red;
    align-items: center;
    justify-content: center;
`
