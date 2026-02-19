import Container from '../../../components/Container'
import styled from 'styled-components/native'
import { ActivityIndicator, FlatList, View } from 'react-native'
import CardLine from '../../../components/cardLine/CardLine'
import ViewTituloCardLine from '../../../components/cardLine/ViewTituloCardLine'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import { FuelSupplyTypes } from '../../../types'
import ListaVazia from '../../../components/List/ListaVazia'
import Linha from '../../../components/cardLine/Line'
import ObraSelected from '../../../components/List/ObraSelected'
import useFuelSupples from './UseFuelSupples'

export default function FuelSupples({ navigation, route }) {
    const { work, type, transportVehicleServices, fuelSupplyServices, workEquipmentServices } = route.params
    const {
        isLoadingList,
        transportVehicles,
        workEquipments,
        handleClickItemWorkEquipment,
        handleClickItemTransportVehicle,
        saveWork,
    } = useFuelSupples({
        work,
        type,
        fuelSupplyServices,
        transportVehicleServices,
        workEquipmentServices,
        navigation,
    })
    if (isLoadingList) {
        return (
            <Container>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (type === FuelSupplyTypes.TRANSPORT_VEHICLE && transportVehicles.length != 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            saveWork(null)
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
                        data={transportVehicles}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => handleClickItemTransportVehicle(item)} opacity={0.7}>
                                    <ViewTituloCardLine titulo={item.nameProprietary} />
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Placa:'} />
                                            <TextTituloCardLine conteudo={'Cor:'} />
                                            <TextTituloCardLine conteudo={'Capacidade:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.plate} />
                                            <TextConteudoCardLine conteudo={item.color} />
                                            <TextConteudoCardLine conteudo={item.capacity + ' m³'} />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            </Container>
        )
    }
    if (type === FuelSupplyTypes.EQUIPMENT && workEquipments.length != 0) {
        return (
            <Container>
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            saveWork(null)
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
                                <CardLine
                                    onPress={() => {
                                        handleClickItemWorkEquipment(item)
                                    }}
                                    opacity={0.7}
                                >
                                    <ViewTituloCardLine titulo={item.equipment.modelOrPlate} />
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Operador:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.equipment.nameProprietary} />
                                            <TextConteudoCardLine
                                                conteudo={item.equipment.operatorMotorist}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            </Container>
        )
    }

    if (transportVehicles.length == 0 && workEquipments.length == 0) {
        return (
            <Container>
                <Content style={{ justifyContent: 'flex-start' }}>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            saveWork(null)
                            navigation.goBack()
                        }}
                        titulo={work.name}
                        descricao={work.description}
                    />
                    <ListaVazia />
                </Content>
            </Container>
        )
    }
}

const Content = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`
