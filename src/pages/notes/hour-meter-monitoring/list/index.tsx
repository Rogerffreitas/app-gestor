import React from 'react'
import { FlatList, View, ActivityIndicator } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../../components/Container'
import {
    Card,
    CardContent,
    TextDescricao,
    TextLabel,
    TextTitulo,
    ViewLeft,
    ViewRight,
    ViewTitle,
} from '../../../../components/List/FlatListItemApontamento'
import Content from '../../../../components/Content'
import ListaVazia from '../../../../components/List/ListaVazia'
import SyncButton from '../../../../components/sync-button'
import styled from 'styled-components/native'
import useHourMeterMonitoringList from './UseHourMeterMonitoringList'

export default function HourMeterMonitoringList() {
    const { isLoadingList, workEquipment, hourMeterMonitoringList, handleClickEditButton } =
        useHourMeterMonitoringList()
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
            {hourMeterMonitoringList.length == 0 ? (
                <Content>
                    <ListaVazia />
                </Content>
            ) : (
                <View
                    style={{
                        width: '100%',
                        flex: 1,
                        alignItems: 'center',
                    }}
                >
                    <FlatList
                        style={{ width: '100%' }}
                        data={hourMeterMonitoringList}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                        }}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ flex: 1 }}>
                                    <Card onPress={() => {}} activeOpacity={1}>
                                        <ViewTitle>
                                            <View
                                                style={{
                                                    width: '75%',
                                                    height: 60,
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <TextTitulo>
                                                    {workEquipment.equipment.modelOrPlate}
                                                </TextTitulo>

                                                <TextSubTitulo>
                                                    {workEquipment.equipment.nameProprietary}
                                                </TextSubTitulo>
                                            </View>
                                            <View
                                                style={{
                                                    width: '25%',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: '50%',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {index == 0 ? (
                                                        <ButtonEditar
                                                            onPress={() => handleClickEditButton(item)}
                                                        >
                                                            <FontAwesome
                                                                name={'edit'}
                                                                size={30}
                                                                style={{ color: '#fff' }}
                                                            />
                                                        </ButtonEditar>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </View>
                                                <View
                                                    style={{
                                                        width: '50%',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <SyncButton item={item} model={'horimetro'} />
                                                </View>
                                            </View>
                                        </ViewTitle>
                                        <CardContent>
                                            <ViewLeft>
                                                <TextLabel>
                                                    {workEquipment.equipment.isEquipment
                                                        ? 'Horimentro inicial:'
                                                        : 'Hodômetro inicial'}
                                                </TextLabel>
                                                <TextDescricao>
                                                    {workEquipment.equipment.isEquipment
                                                        ? item?.initialHourMeterValue / 10 + ' H'
                                                        : item?.initialHourMeterValue / 10 + ' Km'}
                                                </TextDescricao>
                                                <TextLabel>
                                                    {workEquipment.equipment.isEquipment
                                                        ? 'Horimentro final:'
                                                        : 'Hodômetro final'}
                                                </TextLabel>
                                                <TextDescricao>
                                                    {workEquipment.equipment.isEquipment
                                                        ? item?.currentHourMeterValue / 10 + ' H'
                                                        : item?.currentHourMeterValue / 10 + ' Km'}
                                                </TextDescricao>
                                                {item.observation ? (
                                                    <View>
                                                        <TextLabel>Obeservação: </TextLabel>
                                                        <TextDescricao>{item.observation}</TextDescricao>
                                                    </View>
                                                ) : (
                                                    <View></View>
                                                )}
                                            </ViewLeft>
                                            <ViewRight>
                                                <TextLabel>Data: </TextLabel>
                                                <TextDescricao>{item.date}</TextDescricao>
                                                <TextLabel>Total: </TextLabel>
                                                <TextDescricao>
                                                    {workEquipment.equipment.isEquipment
                                                        ? item?.totalCalculatedInThePeriodInformed / 10 + ' H'
                                                        : item?.totalCalculatedInThePeriodInformed / 10 +
                                                          ' Km'}
                                                </TextDescricao>
                                            </ViewRight>
                                        </CardContent>
                                    </Card>
                                </View>
                            )
                        }}
                    />
                </View>
            )}
        </Container>
    )
}

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
`
export const TextSubTitulo = styled.Text`
    width: 100%;
    text-align: left;
    margin-top: 2px;
    margin-left: 10px;
    font-size: 13px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`
