import styled from 'styled-components/native'

export default function ({ description, erroMenssage }) {
    return (
        <Content>
            <TextDescription>{description}</TextDescription>
            <TextError>{erroMenssage}</TextError>
        </Content>
    )
}

const TextDescription = styled.Text`
    color: #000;
    font-size: 12px;
    font-weight: bold;
    margin-right: 10px;
`

const TextError = styled.Text`
    color: red;
    font-size: 12px;
    font-weight: bold;
`

const Content = styled.View`
    width: 95%;
    justify-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`
