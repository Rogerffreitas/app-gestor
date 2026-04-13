import React from 'react'
import { FlatList, ActivityIndicator, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../components/Container'
import styled from 'styled-components/native'
import ListaVazia from '../../../components/List/ListaVazia'
import Content from '../../../components/Content'
import SyncButton from '../../../components/sync-button'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import Line from '../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import { useWorksList } from './UseWorksList'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function WorksList() {
    const { states, actions } = useWorksList()

    if (states.isLoadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
            </Container>
        )
    }

    return (
        <Container>
            {states.works && states.works.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <FlatList
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    data={states.works}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <Card onPress={() => actions.handleClickItemList(item)}>
                                <ViewTitulo>
                                    <TextTitulo>{item.name}</TextTitulo>
                                    <View
                                        style={{
                                            width: '10%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <SyncButton item={item} model={'works'} />
                                    </View>
                                    <ButtonEditar onPress={() => actions.handleClickEditButton(item)}>
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
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={actions.handleClintNewButton} />
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
