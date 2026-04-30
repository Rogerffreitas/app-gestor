import React from 'react'
import { FlatList, Text } from 'react-native'
import styled from 'styled-components/native'

export default function FlatListApontamento({ data, onPress }) {
  return (
    <FlatList
      style={{ flex: 1, width: '100%' }}
      data={data}
      keyExtractor={(item) => {
        return item.id
      }}
      renderItem={({ item }) => {
        return (
          <Card onPress={(item) => onPress(item)}>
            <CardContent>
              <Text>Placa: {item.descricao}</Text>
            </CardContent>
          </Card>
        )
      }}
    />
  )
}

const Card = styled.TouchableOpacity`
  margin-vertical: 4px;
  margin-horizontal: 18px;
  background-color: #fff;
  flex-basis: 46%;
  padding-bottom: 5px;
  flex-direction: column;
  flex-wrap: nowrap;
  border-left-color: ${(props) => props.theme.colors.menu};
  border-left-width: 10px;
  border-radius: 5px;
`
const CardContent = styled.View``
