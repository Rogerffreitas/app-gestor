import React from 'react'
import styled from 'styled-components/native'

export default function ButtonCard({ onPressFunction, nome, source, stack }: any) {
  return (
    <ButtonStyled onPress={onPressFunction}>
      <CardContent>
        <ImageStyled source={source} />
        <TextContent>{nome}</TextContent>
      </CardContent>
    </ButtonStyled>
  )
}
const ImageStyled = styled.Image`
  width: 50px;
  height: 50px;
  background-color: #fff;
  border-radius: 10px;
`
const TextContent = styled.Text`
  font-size: 30px;
  flex: 1;
  align-self: center;
  color: #fff;
  font-weight: bold;
`
const CardContent = styled.View`
  flex: 1;
  justify-content: center;
  align-content: center;
`

const ButtonStyled = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
  align-items: center;
  padding: 10px;
`
