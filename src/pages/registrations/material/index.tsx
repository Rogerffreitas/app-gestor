import React from 'react'
import { FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../components/Container'
import styled from 'styled-components/native'
import theme from '../../../global/styles/theme'
import ListaVazia from '../../../components/List/ListaVazia'
import Content from '../../../components/Content'
import SyncButton from '../../../components/SyncButton'
import CardLine from '../../../components/cardLine/CardLine'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import Linha from '../../../components/cardLine/Line'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import useMaterialsList from './UseMaterialsList'
import { Reference } from '../../../types'
import ButtonNewRegister from '../../../components/button/ButtonNewRegister'

export default function Matirials({ navigation, route }) {
    const { deposit, materialServices } = route.params
    const { loadingList, materials, handleClickNewButton, handleClickEditButton } = useMaterialsList({
        navigation,
        materialServices,
        deposit,
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
            {materials.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <FlatList
                    style={{
                        flex: 1,
                        width: '90%',
                    }}
                    data={materials}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <CardLine onPress={() => {}} opacity={1}>
                                <ViewTituloCardLine>
                                    <View
                                        style={{
                                            width: '80%',
                                        }}
                                    >
                                        <TextTitlo>{item.name}</TextTitlo>
                                    </View>
                                    <View
                                        style={{
                                            width: '10%',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <SyncButton item={item} model={'material'} />
                                    </View>
                                    <ButtonEditar onPress={() => handleClickEditButton(item)}>
                                        <FontAwesome name={'edit'} size={24} style={{ color: '#fff' }} />
                                    </ButtonEditar>
                                </ViewTituloCardLine>
                                <></>
                                <Linha />

                                <CardLineContent>
                                    <CardLineContentLeft>
                                        <TextTituloCardLine conteudo={'Densidade:'} />
                                        <TextTituloCardLine
                                            conteudo={
                                                item.referenceMaterialCalculation == Reference.VOLUME
                                                    ? 'Valor por m³:'
                                                    : 'Valor por tonelada:'
                                            }
                                        />
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine conteudo={item.density / 100 + ' t/m³'} />
                                        <TextConteudoCardLine
                                            conteudo={
                                                'R$ ' +
                                                (item.value / 100).toLocaleString('pt-br', {
                                                    style: 'decimal',
                                                    maximumFractionDigits: 3,
                                                })
                                            }
                                        />
                                    </CardLineContentRight>
                                </CardLineContent>
                            </CardLine>
                        )
                    }}
                />
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

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
