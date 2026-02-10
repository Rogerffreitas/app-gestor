import React from 'react'
import styled from 'styled-components/native'

type CardContentProps = {
    children?: React.ReactNode | undefined
}

export default function (props: CardContentProps) {
    return <CardContent>{props.children}</CardContent>
}

const CardContent = styled.View`
    justify-content: space-between;
    flex-direction: row;
    margin-left: 5px;
`
