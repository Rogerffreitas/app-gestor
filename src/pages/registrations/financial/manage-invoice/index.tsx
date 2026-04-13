import Container from '../../../../components/Container'
import React from 'react'
import styled from 'styled-components/native'
import { ActivityIndicator, FlatList, View } from 'react-native'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import Linha from '../../../../components/cardLine/Line'
import formatarData from '../../../../services/formatarData'
import useManageInvoice from './UseManageInvoice'
import MenuOption from '../components/MenuOption'
import Content from '../../../../components/Content'
import MenuOptionSelected from '../components/MenuOptionSelected'
import { InvoiceStatus } from '../../../../types'
import ListaVazia from '../../../../components/List/ListaVazia'

export default function ManageInvoice() {
    const { states, actions } = useManageInvoice()

    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (states.invoices && states.invoices.length == 0) {
        return (
            <Container>
                <MenuOptionSelected
                    label="Gerenciar Faturas"
                    onPress={() => {
                        actions.goBack()
                    }}
                    source={require('../../../../assets/faturas.json')}
                    isLottie={true}
                    lottieSize={60}
                />
                <ListaVazia />
            </Container>
        )
    }
    return (
        <Container>
            <Content>
                <View style={{ width: '100%' }}>
                    <MenuOptionSelected
                        label="Gerenciar Faturas"
                        onPress={() => {
                            actions.goBack()
                        }}
                        source={require('../../../../assets/faturas.json')}
                        isLottie={true}
                        lottieSize={60}
                    />
                </View>

                <FlatList
                    style={{
                        flex: 1,
                        width: '90%',
                    }}
                    data={states.invoices}
                    keyExtractor={(item) => {
                        return item.serverId + item.workId
                    }}
                    renderItem={({ item }) => {
                        return (
                            <CardFatura onPress={() => actions.handleClickItemInvoice(item)}>
                                <TextTitloFatura
                                    style={
                                        item.invoiceStatus === InvoiceStatus.PENDING
                                            ? { backgroundColor: '#000080' }
                                            : item.invoiceStatus === InvoiceStatus.PAID
                                              ? { backgroundColor: 'green' }
                                              : { backgroundColor: 'red' }
                                    }
                                >
                                    {item.description + '  - Fatura: ' + item.serverId}
                                </TextTitloFatura>
                                <Linha />
                                <CardLineContent>
                                    <CardLineContentLeft>
                                        <TextTituloCardLine conteudo={'Placa:'} />
                                        <TextTituloCardLine conteudo={'Status:'} />
                                        <TextTituloCardLine conteudo={'Data incial:'} />
                                        <TextTituloCardLine conteudo={'Data final:'} />
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine conteudo={item.modelOrPlate} />
                                        <TextConteudoCardLine
                                            conteudo={
                                                item.invoiceStatus === InvoiceStatus.PENDING
                                                    ? 'Criada'
                                                    : 'Não informado'
                                            }
                                        />
                                        <TextConteudoCardLine conteudo={formatarData(item.startDate)} />
                                        <TextConteudoCardLine conteudo={formatarData(item.endDate)} />
                                    </CardLineContentRight>
                                </CardLineContent>
                            </CardFatura>
                        )
                    }}
                />
            </Content>
        </Container>
    )
}

const TextTitloFatura = styled.Text`
    width: 98%;
    padding: 10px;
    font-size: 20px;
    flex: 1;
    color: #fff;
    font-weight: bold;
    border-radius: 4px;
    margin: 5px;
`

const CardFatura = styled.TouchableOpacity`
    width: 100%;
    justify-content: center;
    align-items: center;
    flex: 1;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 5px;
`
