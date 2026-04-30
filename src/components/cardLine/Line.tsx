import { View } from 'react-native'
import styled from 'styled-components/native'

export default function () {
    return (
        <View style={{ width: '100%', padding: 3 }}>
            <Linha />
        </View>
    )
}

const Linha = styled.Text`
    width: 100%;
    height: 1px;
    flex: 1;
    background-color: #000;
`
