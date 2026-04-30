import styled from 'styled-components/native'

export const Card = styled.TouchableOpacity`
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
    padding-bottom: 5px;
    flex-direction: column;
`
export const CardContent = styled.View`
    flex-direction: row;
`

export const ViewLeft = styled.View`
    flex: 1;
    flex-direction: column;
`
export const ViewRight = styled.View`
    flex: 1;
    flex-direction: column;
`

export const ViewTitle = styled.View`
    flex-direction: row;
    background-color: ${(props) => props.theme.colors.menu};
`
export const TextTitulo = styled.Text`
    width: 100%;
    margin-top: 5px;
    margin-left: 10px;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`

export const SubTextTitulo = styled.Text`
    width: 100%;
    margin-left: 10px;
    font-size: 10px;
    color: #fff;
    font-weight: bold;
`

export const TextDescricao = styled.Text`
    font-size: 15px;

    color: #696969;
    margin-top: 1px;
    margin-left: 10px;
`
export const TextLabel = styled.Text`
    margin-top: 3px;
    margin-left: 10px;
    font-size: 10px;
    font-weight: bold;
`
