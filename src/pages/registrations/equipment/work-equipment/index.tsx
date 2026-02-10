import React from 'react'
import { FlatList, ActivityIndicator, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../../components/Container'
import styled from 'styled-components/native'
import CardLine from '../../../../components/cardLine/CardLine'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import Linha from '../../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import ListaVazia from '../../../../components/List/ListaVazia'
import Content from '../../../../components/Content'
import SyncButton from '../../../../components/SyncButton'
import ObraSelected from '../../../../components/List/ObraSelected'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import useWorkEquipmentList from './UseWorkEquipmentList'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'

export default function WorkEquipmentList({ navigation, route }) {
    const { work, workEquipmentServices, equipmentServices } = route.params
    const { workEquipments, isLoadingList, handleNewWorkEquipment, showConfirmDialog } = useWorkEquipmentList(
        { work, workEquipmentServices, navigation, equipmentServices }
    )

    if (isLoadingList) {
        return (
            <Container>
                <ActivityIndicator size="large" color="#666" />
            </Container>
        )
    }

    return (
        <Container>
            {workEquipments.length == 0 ? (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            navigation.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <View style={{ justifyContent: 'center', flex: 1, width: '95%' }}>
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
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={workEquipments}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => {}} opacity={1}>
                                    <ViewTituloCardLine titulo={item.equipment.modelOrPlate}>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'obra_equipamento'} />
                                        </View>
                                        <ButtonEditar onPress={() => showConfirmDialog(item)}>
                                            <FontAwesome name={'trash'} size={30} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine
                                                conteudo={
                                                    item.equipment.isEquipment ? 'Operador:' : 'Motorista:'
                                                }
                                            />
                                            <TextTituloCardLine conteudo={'Inicio do aluguel:'} />
                                            <TextTituloCardLine conteudo={'Mensalidade:'} />
                                            <TextTituloCardLine
                                                conteudo={
                                                    item.equipment.isEquipment
                                                        ? 'Valor por hora:'
                                                        : 'Valor por km:'
                                                }
                                            />
                                            <TextTituloCardLine conteudo={'Valor por diária:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.equipment.nameProprietary} />

                                            <TextConteudoCardLine
                                                conteudo={item.equipment.operatorMotorist}
                                            />
                                            <TextConteudoCardLine conteudo={item.equipment.startRental} />

                                            <TextConteudoCardLine
                                                conteudo={(
                                                    item.equipment.monthlyPayment / 100
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <TextConteudoCardLine
                                                conteudo={(
                                                    item.equipment.valuePerHourKm / 100
                                                ).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                            <TextConteudoCardLine
                                                conteudo={(item.equipment.valuePerDay / 100).toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }
                                                )}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleNewWorkEquipment} />
        </Container>
    )
}

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
