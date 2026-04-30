import React from 'react'
import styled from 'styled-components/native'

export default function ForgotPasswordButton({ onPressFunction }: any) {
  return (
    <ButtonStyled onPress={onPressFunction}>
      <TextStyled>Esquece a senha ?</TextStyled>
    </ButtonStyled>
  )
}

const ButtonStyled = styled.TouchableOpacity`
  width: 100%;
  text-align: flex-end;
`

const TextStyled = styled.Text`
  color: ${(props) => props.theme.colors.menu};
  font-size: 12px;
  font-weight: bold;
  text-align: right;
`
