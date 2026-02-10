import React from 'react'
import styled from 'styled-components/native'

export default function ({ conteudo }) {
    return <TextConteudo>{conteudo}</TextConteudo>
}

const TextConteudo = styled.Text`
    margin-left: 15px;
    font-size: 15px;
    flex: 1;
    color: #696969;
    align-items: center;
`
