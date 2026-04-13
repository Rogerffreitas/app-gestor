import React from 'react'
import { ActivityIndicator, FlatList, View, Text, TouchableOpacity } from 'react-native'
import Container from '../../../components/Container'
import Content from '../../../components/Content'
import ListaVazia from '../../../components/List/ListaVazia'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import Linha from '../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import ObraSelected from '../../../components/List/ObraSelected'
import styled from 'styled-components/native'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import useHourMeterMonitoring from './UseHourMeterMonitoring'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function HourMeterMonitoring() {
    const { isLoadingList, workEquipments, work, noteToday, actions } = useHourMeterMonitoring()
    if (isLoadingList) {
        return (
            <Container>
                <View
                    style={{
                        justifyContent: 'center',
                        flex: 1,
                    }}
                >
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            {workEquipments.length != 0 ? (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            actions.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />

                    <View
                        style={{
                            width: '100%',
                            flex: 1,
                            alignItems: 'center',
                        }}
                    >
                        <FlatList
                            style={{
                                width: '90%',
                            }}
                            data={workEquipments}
                            keyExtractor={(item) => {
                                return item.id
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <CardLine
                                        onPress={() => {
                                            actions.handlerClickNewButton(item)
                                        }}
                                    >
                                        <ViewTituloCardLine
                                            style={{
                                                backgroundColor: '#000080',

                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{ width: '75%' }}>
                                                <TextTitlo>{item.equipment.modelOrPlate}</TextTitlo>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    actions.handleClickItemWorkEquipment(item)
                                                }}
                                                style={{
                                                    width: '15%',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <FontAwesome name="list-ul" size={30} color="#FFF" />
                                            </TouchableOpacity>
                                            <View
                                                style={{
                                                    width: 35,
                                                    height: 35,
                                                    borderRadius: 20,
                                                }}
                                            >
                                                {noteToday.includes(item.id) ? (
                                                    <Text style={{ fontSize: 22 }}>✅</Text>
                                                ) : (
                                                    <Text style={{ fontSize: 22 }}>⚠️</Text>
                                                )}
                                            </View>
                                        </ViewTituloCardLine>

                                        <Linha></Linha>
                                        <CardLineContent>
                                            <CardLineContentLeft>
                                                <TextTituloCardLine conteudo={'Proprietário:'} />
                                                <TextTituloCardLine
                                                    conteudo={
                                                        item.equipment.isEquipment
                                                            ? 'Operador:'
                                                            : 'Motorista:'
                                                    }
                                                />
                                                <TextTituloCardLine
                                                    conteudo={
                                                        item.equipment.isEquipment
                                                            ? 'Horimetro:'
                                                            : 'Hodômetro'
                                                    }
                                                />
                                            </CardLineContentLeft>
                                            <CardLineContentRight>
                                                <TextConteudoCardLine
                                                    conteudo={item.equipment.nameProprietary}
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={item.equipment.operatorMotorist}
                                                />
                                                <TextConteudoCardLine
                                                    conteudo={
                                                        item.equipment.isEquipment
                                                            ? item.currentHourMeterOrOdometer
                                                                ? (
                                                                      item.currentHourMeterOrOdometer / 10
                                                                  ).toLocaleString('pt-br', {
                                                                      style: 'decimal',
                                                                      maximumFractionDigits: 1,
                                                                  })
                                                                : 0 + ' H'
                                                            : item.currentHourMeterOrOdometer
                                                              ? (
                                                                    item.currentHourMeterOrOdometer / 10
                                                                ).toLocaleString('pt-br', {
                                                                    style: 'decimal',
                                                                    maximumFractionDigits: 1,
                                                                })
                                                              : 0 + ' Km'
                                                    }
                                                />
                                            </CardLineContentRight>
                                        </CardLineContent>
                                    </CardLine>
                                )
                            }}
                        />
                    </View>
                </Content>
            ) : (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            actions.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <View style={{ justifyContent: 'flex-start', flex: 1, width: '95%' }}>
                        <ListaVazia />
                    </View>
                </Content>
            )}
        </Container>
    )
}

const CardLine = styled.TouchableOpacity`
    width: 100%;
    background-color: #fff;
    border-radius: 10px;
    margin-top: 5px;
`
const ViewTituloCardLine = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
`

const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
