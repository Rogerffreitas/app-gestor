import React from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import Container from '../../../components/Container'
import styled from 'styled-components/native'
import CardLine from '../../../components/cardLine/CardLine'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import Linha from '../../../components/cardLine/Line'
import ListaVazia from '../../../components/List/ListaVazia'
import Content from '../../../components/Content'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import SyncButton from '../../../components/SyncButton'
import useMaterialsList from './UseDepositsList'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function Deposits({ navigation, route }) {
    const { depositServices, materialServices } = route.params
    const { loadingList, deposits, handleClickItemList, handleClickNewButton, handleClickEditButton } =
        useMaterialsList({ depositServices, navigation, materialServices })

    if (loadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
            </Container>
        )
    }

    return (
        <Container>
            {deposits.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : loadingList ? (
                <ActivityIndicator size="large" color="#666" />
            ) : (
                <Content>
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={deposits}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => handleClickItemList(item)} opacity={0.5}>
                                    <ViewTituloCardLine>
                                        <TextTitlo>{item.name}</TextTitlo>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'jazida'} />
                                        </View>
                                        <ButtonEditar onPress={() => handleClickEditButton(item)}>
                                            <FontAwesome name={'edit'} size={24} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha></Linha>
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Descrição:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.description} />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleClickNewButton} />
        </Container>
    )
}

const TextTitlo = styled.Text`
    width: 77%;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin-left: 5px;
`

const ViewTituloCardLine = styled.View`
    width: 98%;
    height: 40px;
    align-items: center;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
