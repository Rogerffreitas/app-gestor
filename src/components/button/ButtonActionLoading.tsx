import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

export default function ButtonActionLoading({ onPressFunction }: any) {
  return (
    <ButtonStyled onPress={onPressFunction}>
      <ActivityIndicator size={'small'} color="#fff" />
    </ButtonStyled>
  )
}

const ButtonStyled = styled.TouchableOpacity`
  justify-content: center;
  flex-direction: row;
  background-color: ${(props) => props.theme.colors.primarySelect};
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
  align-items: center;
  padding: 10px;
`

const TextStyled = styled.Text`
  color: #fff;
  font-weight: bold;
`
