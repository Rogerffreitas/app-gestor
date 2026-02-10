import React from 'react'
import styled, { useTheme } from 'styled-components/native'

type Props = {
    children?: React.ReactNode | undefined
}

export default function (props: Props) {
    return <Content>{props.children}</Content>
}

const Content = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`
