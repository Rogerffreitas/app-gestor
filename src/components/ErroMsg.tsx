import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

type propsMsg = {
  children?: React.ReactNode | undefined
}

export default function ErroMsd(props: propsMsg) {
  return <TextMsg>{props.children}</TextMsg>
}

const TextMsg = styled.Text`
  width: 100%;
  color: red;
  font-size: 12px;
  font-weight: bold;
`
