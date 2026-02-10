import React from 'react'
import styled from 'styled-components/native'

type ViewTituloCardLineProps = {
    children?: React.ReactNode | undefined
    titulo: string
}

export default function (props: ViewTituloCardLineProps) {
    return (
        <ViewTituloCardLine>
            <TextTitlo>{props.titulo}</TextTitlo>
            {props.children}
        </ViewTituloCardLine>
    )
}

const ViewTituloCardLine = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
    justify-content: space-between;
`

const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
