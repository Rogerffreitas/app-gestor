import React from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
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
import useMaintenanceTruckRefuelTank from './UseMaintenanceTruckRefuelTank'
import { ModelSyncType } from '../../../../types'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'
import Container from '../../../../components/Container'

export default function MaintenanceTruckRefuelTank() {
    const { isLoadingList, fuelSupples, actions } = useMaintenanceTruckRefuelTank()

    if (isLoadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
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
                        style={{ flex: 1, width: '90%' }}
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
                                                <SyncButton item={item} model={ModelSyncType.FUEL_SUPPLES} />
                                            </View>
                                            {index == 0 && (
                                                <ButtonEditar
                                                    onPress={() => actions.handleClickButtonEdit(item)}
                                                >
                                                    <FontAwesome
                                                        name={'edit'}
                                                        size={20}
                                                        style={{ color: '#fff' }}
                                                    />
                                                </ButtonEditar>
                                            )}
                                        </ViewTituloCardLine>
                                        <Linha />
                                        <CardLineContent>
                                            <CardLineContentLeft>
                                                <TextTituloCardLine conteudo={'Quantidade:'} />
                                                <TextTituloCardLine conteudo={'Valor por litro:'} />
                                                <TextTituloCardLine conteudo={'Total:'} />
                                                <TextTituloCardLine conteudo={'Observação:'} />
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.quantity
                                                            ? `${(item.quantity / 100).toLocaleString(
                                                                  'pt-BR',
                                                                  {
                                                                      style: 'decimal',
                                                                      maximumFractionDigits: 2,
                                                                  }
                                                              )} L`
                                                            : 'N/D'
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
                                                            : 'N/D'
                                                    }
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.value
                                                            ? (item.value / 100).toLocaleString('pt-BR', {
                                                                  style: 'currency',
                                                                  currency: 'BRL',
                                                              })
                                                            : 'N/D'
                                                    }
                                                />
                                                <TextConteudoCardLine conteudo={item.observation} />
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                </View>
                            )
                        }}
                    ></FlatList>
                </ContentCardList>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={actions.handleClickButtonNew} />
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
