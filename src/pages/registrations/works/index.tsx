import React from 'react'
import { FlatList, ActivityIndicator, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../components/Container'
import styled from 'styled-components/native'
import ListaVazia from '../../../components/List/ListaVazia'
import Content from '../../../components/Content'
import SyncButton from '../../../components/SyncButton'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import Line from '../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import { useWorksList } from './UseWorksList'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function WorksList({ navigation, route }) {
    const { workServices, userServices, depositServices, workRoutesServices } = route.params
    const { works, loadingList, handleClickItemList, handleClickEditButton, handleClintNewButton } =
        useWorksList({
            depositServices,
            userServices,
            workRoutesServices,
            navigation,
            workServices,
        })

    if (loadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
            </Container>
        )
    }

    return (
        <Container>
            {works && works.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <FlatList
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    data={works}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <Card onPress={() => handleClickItemList(item)}>
                                <ViewTitulo>
                                    <TextTitulo>{item.name}</TextTitulo>
                                    <View
                                        style={{
                                            width: '10%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <SyncButton item={item} model={'work'} />
                                    </View>
                                    <ButtonEditar onPress={() => handleClickEditButton(item)}>
                                        <FontAwesome name={'edit'} size={20} style={{ color: '#fff' }} />
                                    </ButtonEditar>
                                </ViewTitulo>
                                <Line />
                                <CardLineContent>
                                    <CardLineContentLeft>
                                        <TextTituloCardLine conteudo={'Descrição:'} />
                                        <TextTituloCardLine conteudo={'Estacas:'} />
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine conteudo={item.description} />
                                        <TextConteudoCardLine conteudo={item.pickets} />
                                    </CardLineContentRight>
                                </CardLineContent>
                            </Card>
                        )
                    }}
                />
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleClintNewButton} />
        </Container>
    )
}

const Card = styled.TouchableOpacity`
    margin-top: 4px;
    margin-bottom: 4px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
`

const TextTitulo = styled.Text`
    width: 100%;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const ViewTitulo = styled.View`
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    padding: 10px;
`
const ViewDescricao = styled.View`
    height: 40px;
    width: 100%;
`
