import React from 'react'
import Container from '../../../../../components/Container'
import styled from 'styled-components/native'
import { FlatList, View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import Content from '../../../../../components/Content'
import CardLine from '../../../../../components/cardLine/CardLine'
import CardLineContentRight from '../../../../../components/cardLine/CardLineContentRight'
import CardLineContent from '../../../../../components/cardLine/CardLineContent'
import TextConteudoCardLine from '../../../../../components/cardLine/TextConteudoCardLine'
import CardLineContentLeft from '../../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../../components/cardLine/TextTituloCardLine'
import Linha from '../../../../../components/cardLine/Line'
import ListaVazia from '../../../../../components/List/ListaVazia'
import ItemObra from '../../../../../components/List/ItemObra'
import theme from '../../../../../global/styles/theme'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import useNewWorkEquipment from './UseNewWorkEquipment'
import ObraSelected from '../../../../../components/List/ObraSelected'

export default function NewWorkEquipment({ navigation, route }) {
    const { work, workEquipmentServices, equipmentServices, equipmentsSelectedIds } = route.params
    const {
        equipments,
        selectedWorkEquipments,
        handleSelectEquipment,
        handlerSubmitButton,
        isLoading,
        isLoadingList,
    } = useNewWorkEquipment({
        work,
        workEquipmentServices,
        equipmentServices,
        navigation,
        equipmentsSelectedIds: equipmentsSelectedIds,
    })

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            {equipments.length == 0 ? (
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
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={equipments}
                        keyExtractor={(item) => {
                            return item.id + '#'
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => handleSelectEquipment(item)} opacity={0.7}>
                                    <ViewTituloCardLine
                                        style={{
                                            backgroundColor:
                                                selectedWorkEquipments?.findIndex(
                                                    (i) => i.equipment.id == item.id
                                                ) != -1
                                                    ? '#ef6c00'
                                                    : '#000080',
                                        }}
                                    >
                                        <TextTitlo>{item.modelOrPlate}</TextTitlo>
                                    </ViewTituloCardLine>

                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Operador:'} />
                                            <TextTituloCardLine conteudo={'Inicio do aluguel:'} />
                                            <TextTituloCardLine conteudo={'Mensalidade:'} />
                                            <TextTituloCardLine conteudo={'Valor por hora:'} />
                                            <TextTituloCardLine conteudo={'Valor por diária:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.nameProprietary} />

                                            <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                            <TextConteudoCardLine conteudo={item.startRental} />

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
                    {!isLoading ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handlerSubmitButton}
                            style={[styles.touchableOpacityStyle, { flexDirection: 'row' }]}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    marginHorizontal: 5,
                                }}
                            >
                                SALVAR
                            </Text>
                            <FontAwesome name="check" size={20} color={'#fff'} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {}}
                            style={[styles.touchableOpacityStyle, { flexDirection: 'row' }]}
                        >
                            <ActivityIndicator size="large" color="#fff" />
                        </TouchableOpacity>
                    )}
                </Content>
            )}
        </Container>
    )
}

const ViewTituloCardLine = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
    justify-content: space-between;
`

const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
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
        width: 120,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.btplus,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 55,
        position: 'absolute',
        bottom: 7,
    },
})
