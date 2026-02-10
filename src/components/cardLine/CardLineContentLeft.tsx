import React from 'react'
import styled from 'styled-components/native'

type CardLineContentLeftProps = {
    children?: React.ReactNode | undefined
}

export default function (props: CardLineContentLeftProps) {
    return <CardContent>{props.children}</CardContent>
}

const CardContent = styled.View`
    width: 38%;
    flex-direction: column;
    margin-top: 5px;
    margin-bottom: 5px;
`
