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
import ListaVazia from '../../../../components/List/ListaVazia'
import Linha from '../../../../components/cardLine/Line'
import SyncButton from '../../../../components/sync-button'
import useFuelSupplesList from './useFuelSupplesList'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'
import { FuelSupplyTypes } from '../../../../types'

export default function FuelSupplyList() {
    const { isLoadingList, fuelSupples, actions } = useFuelSupplesList()

    if (isLoadingList) {
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
            {fuelSupples.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <ContentCardList>
                    <FlatList
                        style={{ flex: 1, width: '95%' }}
                        data={fuelSupples}
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
                                                <SyncButton item={item} model={'abastecimento'} />
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
                                                <TextTituloCardLine conteudo={'Quantidade:'} />
                                                <TextTituloCardLine conteudo={'Valor por litro:'} />
                                                <TextTituloCardLine conteudo={'Total:'} />
                                                {item.supplyType != FuelSupplyTypes.EQUIPMENT ? (
                                                    <TextTituloCardLine conteudo={'Descontar? '} />
                                                ) : (
                                                    <></>
                                                )}
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.quantity
                                                            ? (item.quantity / 100).toLocaleString('pt-BR', {
                                                                  style: 'decimal',
                                                                  maximumFractionDigits: 2,
                                                              })
                                                            : 0
                                                    }
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.valuePerLiter
                                                            ? (item.valuePerLiter / 100).toLocaleString(
                                                                  'pt-BR',
                                                                  {
                                                                      style: 'currency',
                                                                      currency: 'BRL',
                                                                  }
                                                              )
                                                            : 0
                                                    }
                                                />
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
                                                {item.supplyType != FuelSupplyTypes.EQUIPMENT ? (
                                                    <TextConteudoCardLine
                                                        conteudo={item.isDiscount ? 'Sim' : 'Não'}
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                </View>
                            )
                        }}
                    ></FlatList>
                </ContentCardList>
            )}

            <ButtonNewRegister onPressFunction={actions.handlerClickNewButton} activeOpacity={0.7} />
        </Container>
    )
}

const ContentCardList = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
