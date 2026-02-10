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
import useEquipmentList from './UseEquipmentList'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'

export default function Equipments({ navigation, route }) {
    const { equipmentServices } = route.params
    const { isLoadingList, equipments, handleNewEquipment, handleEditEquipment, handleUpdateBankInfo } =
        useEquipmentList({ equipmentServices, navigation })
    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            {equipments.length == 0 ? (
                <Content>
                    <View style={{ justifyContent: 'center', flex: 1, width: '95%' }}>
                        <ListaVazia />
                    </View>
                </Content>
            ) : (
                <Content>
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={equipments}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => {}} opacity={1}>
                                    <ViewTituloCardLine>
                                        <TextTitlo>{item.modelOrPlate}</TextTitlo>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'equipamento'} />
                                        </View>
                                        <ButtonEditar onPress={() => handleUpdateBankInfo(item)}>
                                            <FontAwesome name={'bank'} size={18} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                        <ButtonEditar onPress={() => handleEditEquipment(item)}>
                                            <FontAwesome name={'edit'} size={24} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha></Linha>
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Cpf:'} />
                                            <TextTituloCardLine conteudo={'Telefone:'} />
                                            <TextTituloCardLine
                                                conteudo={item.isEquipment ? 'Operador:' : 'Motorista:'}
                                            />
                                            <TextTituloCardLine conteudo={'Inicio do aluguel:'} />
                                            <TextTituloCardLine
                                                conteudo={item.isEquipment ? 'Horimetro ' : 'Hodômetro '}
                                            />
                                            <TextTituloCardLine conteudo={'Mensalidade:'} />
                                            <TextTituloCardLine
                                                conteudo={
                                                    item.isEquipment ? 'Valor por hora:' : 'Valor por km:'
                                                }
                                            />
                                            <TextTituloCardLine conteudo={'Valor por diária:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine
                                                conteudo={item.nameProprietary.substring(0, 23)}
                                            />
                                            <TextConteudoCardLine conteudo={item.cpfCnpjProprietary} />
                                            <TextConteudoCardLine conteudo={item.telProprietary} />
                                            <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                            <TextConteudoCardLine conteudo={item.startRental} />
                                            <TextConteudoCardLine
                                                conteudo={(item.hourMeterOrOdometer / 10).toLocaleString(
                                                    'pt-br',
                                                    {
                                                        style: 'decimal',
                                                        maximumFractionDigits: 1,
                                                    }
                                                )}
                                            />
                                            <TextConteudoCardLine
                                                conteudo={(item.monthlyPayment / 100).toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }
                                                )}
                                            />
                                            <TextConteudoCardLine
                                                conteudo={(item.valuePerHourKm / 100).toLocaleString(
                                                    'pt-BR',
                                                    {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }
                                                )}
                                            />
                                            <TextConteudoCardLine
                                                conteudo={(item.valuePerDay / 100).toLocaleString('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL',
                                                })}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            )}
            <ButtonNewRegister activeOpacity={0.7} onPressFunction={handleNewEquipment} />
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
    width: 65%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
