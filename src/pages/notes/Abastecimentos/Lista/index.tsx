import React, { useState, useEffect } from 'react'
import { TouchableOpacity, FlatList, StyleSheet, View, ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { useAuth } from '../../../../contexts/AuthContext'
import Container from '../../../../components/Container'
import { getAll } from '../../../../dao/AbastecimentoDAO'

import theme from '../../../../global/styles/theme'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Abastecimento from '../../../../database/model/FuelSupplyModel'
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
import SyncButton from '../../../../components/SyncButton'

export default function ({ navigation, route }) {
    const { usuario } = useAuth()
    const [load, setLoad] = useState(true)
    const [obra, setObra] = useState(route.params?.obra)
    const [veiculo, setVeiculo] = useState(route.params?.veiculo)
    const [tipo, setTipo] = useState<string>(route.params?.tipo)
    const [loadingList, setLoadingList] = useState(true)
    const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([])

    useEffect(() => {
        _getAll()
    }, [load])

    async function _getAll() {
        navigation.addListener('focus', () => setLoad(!load))
        const result = await getAll(obra, tipo, veiculo, usuario.empresaId)
        setAbastecimentos(result)
        setLoadingList(false)
    }

    function _handlerNewRaw() {
        navigation.navigate('Novo Abastecimento', {
            obra: obra,
            veiculo: veiculo,
            tipo: tipo,
        })
    }
    function _editarAbastecimento(abastecimento: Abastecimento) {
        navigation.navigate('Editar Abastecimento', {
            abastecimento: abastecimento._raw,
        })
    }

    if (loadingList) {
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
            {abastecimentos.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <ContentCardList>
                    <FlatList
                        style={{ flex: 1, width: '95%' }}
                        data={abastecimentos}
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
                                        <ViewTituloCardLine titulo={item.descricao}>
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
                                                    onPress={() => _editarAbastecimento(item)}
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
                                                {item.tipo != 'equipamento' ? (
                                                    <TextTituloCardLine conteudo={'Descontar? '} />
                                                ) : (
                                                    <></>
                                                )}
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine
                                                    conteudo={item.quantidade.toLocaleString(
                                                        'pt-BR',
                                                        {
                                                            style: 'decimal',
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={item.valorPorLitro.toLocaleString(
                                                        'pt-BR',
                                                        { style: 'currency', currency: 'BRL' }
                                                    )}
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={item.valor.toLocaleString('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                />
                                                {item.tipo != 'equipamento' ? (
                                                    <TextConteudoCardLine
                                                        conteudo={item.descontar ? 'Sim' : 'Não'}
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
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={_handlerNewRaw}
                style={styles.touchableOpacityStyle}
            >
                <FontAwesome name="plus" size={20} color={'#fff'} />
            </TouchableOpacity>
        </Container>
    )
}

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
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
    },
})

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
