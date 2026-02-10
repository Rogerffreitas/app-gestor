import React from 'react'
import { FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import styled from 'styled-components/native'
import Container from '../../../components/Container'
import theme from '../../../global/styles/theme'
import CardLine from '../../../components/cardLine/CardLine'
import Linha from '../../../components/cardLine/Line'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ItemObra from '../../../components/List/ItemObra'
import Content from '../../../components/Content'
import ListaVazia from '../../../components/List/ListaVazia'
import { View } from 'react-native'
import SyncButton from '../../../components/SyncButton'
import ObraSelected from '../../../components/List/ObraSelected'
import { useRoutesList } from './UseRoutesList'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function WorkRoutes({ navigation, route }) {
    const { depositServices, workRoutesServices, work } = route.params
    const { routes, loadingList, handleClickEditButton, handleClintNewButton } = useRoutesList({
        navigation,
        workRoutesServices,
        work,
        depositServices,
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
            {routes.length == 0 ? (
                <Content>
                    <View style={{ justifyContent: 'flex-start', flex: 1, width: '95%' }}>
                        <ObraSelected
                            active={1}
                            onPress={() => {
                                navigation.goBack()
                            }}
                            titulo={work.name}
                            descricao={work.description}
                        />
                        <ListaVazia />
                    </View>
                </Content>
            ) : (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <FlatList
                        style={{ flex: 1, width: '90%' }}
                        data={routes}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        refreshing={true}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => {}} opacity={1}>
                                    <ViewTituloCardLine>
                                        <View
                                            style={{
                                                width: '80%',
                                            }}
                                        >
                                            <TextTitlo>{item.arrivalLocation}</TextTitlo>
                                            <TextTitlo>{item.departureLocation}</TextTitlo>
                                        </View>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'rota'} />
                                        </View>
                                        <ButtonEditar onPress={() => handleClickEditButton(item)}>
                                            <FontAwesome name={'edit'} size={20} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha></Linha>
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine
                                                conteudo={item.isFixedValue ? 'Valor :' : 'Valor Por KM:'}
                                            />
                                            <TextTituloCardLine conteudo={item.isFixedValue ? '' : 'DMT:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine
                                                conteudo={
                                                    'R$ ' +
                                                    (item.value / 1000).toLocaleString('pt-br', {
                                                        style: 'decimal',
                                                        maximumFractionDigits: 3,
                                                    })
                                                }
                                            />
                                            <TextConteudoCardLine
                                                conteudo={
                                                    item.isFixedValue
                                                        ? ''
                                                        : (item.km / 100).toLocaleString('pt-br', {
                                                              style: 'decimal',
                                                              maximumFractionDigits: 2,
                                                          }) + ' KM'
                                                }
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleClintNewButton} />
        </Container>
    )
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
    width: 100%;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin-left: 5px;
`

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.btplus,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        position: 'absolute',
        bottom: 0,
    },
})
