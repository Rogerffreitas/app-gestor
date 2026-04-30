import React from 'react'
import styled from 'styled-components/native'

export default function ButtonAction({ acao, onPressFunction }: any) {
  return (
    <ButtonStyled onPress={onPressFunction}>
      <TextStyled>{acao}</TextStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.menu};
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
