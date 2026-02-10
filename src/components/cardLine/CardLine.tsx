import React from 'react'
import styled from 'styled-components/native'

type CardLineProps = {
    children?: React.ReactNode | undefined
    onPress: any
    opacity: number
}

export default function (props: CardLineProps) {
    return (
        <CardLine onPress={props.onPress} activeOpacity={props.opacity}>
            {props.children}
        </CardLine>
    )
}

const CardLine = styled.TouchableOpacity`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 5px;
    flex-direction: column;
`
