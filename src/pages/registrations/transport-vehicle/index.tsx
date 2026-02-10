import React from 'react'
import useTransportVehicles from './UseTransportVehicles'
import { FlatList, ActivityIndicator, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../components/Container'
import styled from 'styled-components/native'
import CardLine from '../../../components/cardLine/CardLine'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import Linha from '../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ListaVazia from '../../../components/List/ListaVazia'
import Content from '../../../components/Content'
import ItemObra from '../../../components/List/ItemObra'
import SyncButton from '../../../components/SyncButton'
import ObraSelected from '../../../components/List/ObraSelected'
import theme from '../../../global/styles/theme'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function TransportVehicles({ navigation, route }) {
    const { workServices, transportVehicleServices } = route.params

    const {
        works,
        work,
        transportVehicles,
        isLoadingList,
        handleClickNewButton,
        handleClickEditBankInfo,
        handleClickEditButton,
        handleSelectWork,
        handleClickSelectedWork,
    } = useTransportVehicles({ workServices, transportVehicleServices, navigation })

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (works.length == 0) {
        return (
            <Container>
                <Content>
                    <ListaVazia />
                </Content>
            </Container>
        )
    }

    if (!work) {
        return (
            <Container>
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
                            <ItemObra
                                active={0.2}
                                onPress={() => {
                                    handleSelectWork(item)
                                }}
                                titulo={item.name}
                                descricao={item.description}
                            />
                        )
                    }}
                />
            </Container>
        )
    }

    if (work && transportVehicles.length == 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={handleClickSelectedWork}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <View style={{ justifyContent: 'center', flex: 1, width: '95%' }}>
                        <ListaVazia />
                    </View>
                    <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleClickNewButton} />
                </Content>
            </Container>
        )
    }
    if (work && transportVehicles.length > 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={handleClickSelectedWork}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={transportVehicles}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => {}} opacity={1}>
                                    <ViewTituloCardLine>
                                        <TextTitlo>{item.nameProprietary}</TextTitlo>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'veiculo'} />
                                        </View>
                                        <ButtonEditar onPress={() => handleClickEditBankInfo(item)}>
                                            <FontAwesome name={'bank'} size={18} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                        <ButtonEditar onPress={() => handleClickEditButton(item)}>
                                            <FontAwesome name={'edit'} size={24} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha></Linha>
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Cpf/Cnpj:'} />
                                            <TextTituloCardLine conteudo={'Telefone:'} />
                                            <TextTituloCardLine conteudo={'Placa:'} />
                                            <TextTituloCardLine conteudo={'Cor:'} />
                                            <TextTituloCardLine conteudo={'Motorista:'} />
                                            <TextTituloCardLine conteudo={'Capacidade:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.cpfCnpjProprietary} />
                                            <TextConteudoCardLine conteudo={item.telProprietary} />
                                            <TextConteudoCardLine conteudo={item.plate} />
                                            <TextConteudoCardLine conteudo={item.color} />
                                            <TextConteudoCardLine conteudo={item.motorist} />
                                            <TextConteudoCardLine conteudo={item.capacity + ' m³'} />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>

                <ButtonNewRegister activeOpacity={0.7} onPressFunction={ButtonNewRegister} />
            </Container>
        )
    }
}

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const ViewTituloCardLine = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
`

const TextTitlo = styled.Text`
    width: 65%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
