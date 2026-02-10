import React from 'react'
import { ActivityIndicator, FlatList, View } from 'react-native'
import Container from '../../../../components/Container'
import Content from '../../../../components/Content'
import ListaVazia from '../../../../components/List/ListaVazia'
import CardLine from '../../../../components/cardLine/CardLine'
import SyncButton from '../../../../components/SyncButton'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import Linha from '../../../../components/cardLine/Line'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import styled from 'styled-components/native'
import useMaintenanceTrucks from './UseMaintenanceTrucks'
import ButtonNewRegister from '../../../../components/button/ButtonNewRegister'

export default function MaintenanceTrucks({ navigation, route }) {
    const { work, maintenanceTruckServices, workEquipmentServices, userServices } = route.params
    const { maintenanceTruck, handleClickNewButton, isLoadingList, showConfirmDialog } = useMaintenanceTrucks(
        { work, navigation, maintenanceTruckServices, userServices, workEquipmentServices }
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
            {maintenanceTruck.length == 0 ? (
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
                        data={maintenanceTruck}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => {}} opacity={1}>
                                    <ViewTituloCardLine titulo={item.modelOrPlate}>
                                        <View
                                            style={{
                                                width: '10%',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <SyncButton item={item} model={'melosa'} />
                                        </View>

                                        <ButtonEditar onPress={() => showConfirmDialog(item)}>
                                            <FontAwesome name={'trash'} size={30} style={{ color: '#fff' }} />
                                        </ButtonEditar>
                                    </ViewTituloCardLine>
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Motorista:'} />
                                            <TextTituloCardLine conteudo={'Capacidade:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.nameProprietary} />
                                            <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                            <TextConteudoCardLine
                                                conteudo={
                                                    (item.capacity / 100).toLocaleString('pt-br', {
                                                        style: 'decimal',
                                                        maximumFractionDigits: 1,
                                                    }) + ' L'
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
            <ButtonNewRegister onPressFunction={handleClickNewButton} activeOpacity={0.7} />
        </Container>
    )
}

const ButtonEditar = styled.TouchableOpacity`
    width: 10%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
