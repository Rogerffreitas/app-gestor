import React from 'react'
import styled from 'styled-components/native'

type CardLineContentRightProps = {
    children?: React.ReactNode | undefined
}

export default function (props: CardLineContentRightProps) {
    return <CardContent>{props.children}</CardContent>
}

const CardContent = styled.View`
    flex: 2;
    flex-direction: column;
    margin-top: 5px;
    margin-bottom: 5px;
`
