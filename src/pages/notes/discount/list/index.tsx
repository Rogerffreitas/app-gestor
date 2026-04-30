import React from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import Container from '../../../../components/Container'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import CardLine from '../../../../components/cardLine/CardLine'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import Content from '../../../../components/Content'
import Linha from '../../../../components/cardLine/Line'
import ListaVazia from '../../../../components/List/ListaVazia'
import SyncButton from '../../../../components/sync-button'
import useDiscountsList from './UseDiscountsList'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'

export default function DiscountsList() {
    const { states, actions } = useDiscountsList()
    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            {states.discounts.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <Content>
                    <FlatList
                        style={{ flex: 1, width: '95%' }}
                        data={states.discounts}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1 }}>
                                    <CardLine onPress={() => ({})} opacity={1}>
                                        <ViewTituloCardLine titulo={item.description}>
                                            <View
                                                style={{
                                                    width: '10%',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <SyncButton item={item} model={'desconto'} />
                                            </View>
                                            {index == 0 ? (
                                                <ButtonEditar
                                                    onPress={() => actions.handleClickEditButton(item)}
                                                >
                                                    <FontAwesome
                                                        name={'edit'}
                                                        size={20}
                                                        style={{ color: '#fff' }}
                                                    />
                                                </ButtonEditar>
                                            ) : (
                                                <></>
                                            )}
                                        </ViewTituloCardLine>
                                        <Linha />
                                        <CardLineContent>
                                            <CardLineContentLeft>
                                                <TextTituloCardLine conteudo={'Valor:'} />
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.value
                                                            ? (item.value / 100).toLocaleString('pt-BR', {
                                                                  style: 'currency',
                                                                  currency: 'BRL',
                                                              })
                                                            : 0
                                                    }
                                                />
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                </View>
                            )
                        }}
                    ></FlatList>
                </Content>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={actions.handlerClickNewButton} />
        </Container>
    )
}

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
