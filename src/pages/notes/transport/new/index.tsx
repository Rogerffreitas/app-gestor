import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../../../../global/styles/theme'
import ButtonDropApontamento from '../../../../components/button/ButtonDropApontamento'
import ButtonDropApontamentoRota from '../../../../components/button/ButtonDropApontamentoRota'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonDropApontamentoEstaca from '../../../../components/button/ButtonDropApontamentoEstaca'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Container from '../../../../components/Container'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import InputComponent from '../../../../components/input/InputComponent'
import useNewTransport from './UseNewTransport'
import WorkRoutesDto from '../../../../domin/entity/work-routes/WorkRoutesDto'
import { MaterialDto } from '../../../../domin/entity/material/MaterialDto'
import { Reference } from '../../../../types'
import { TextInputMask } from 'react-native-masked-text'

export default function TransportNotes({ navigation, route }) {
    const { work, transportVehicle, materialTransportServices, workRoutesServices, materialServices } =
        route.params
    const {
        workRoute,
        workRoutes,
        material,
        materials,
        quantity,
        picket,
        state,
        setState,
        icon,
        handleClickButtonWorkRoute,
        handleClickButtonMaterial,
        handlerClickButtonQuantity,
        handlerClickButtonPicket,
        handleSelectWorkRoute,
        handleSelectMaterial,
        handleSelectQuantity,
        handlerSelectPicket,
        handleResestItemsSelect,
        handleSaveItemsSelect,
    } = useNewTransport({
        work,
        transportVehicle,
        workRoutesServices,
        materialServices,
        materialTransportServices,
        navigation,
    })

    if (state.isLoading) {
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
            <ButtonDropApontamento
                onPress={() => {}}
                numero={'1'}
                titulo={'OBRA:'}
                conteudo={work ? work.name : ''}
                corIcon={icon.work == 'check' ? 'green' : theme.colors.menu}
                nomeIcon={icon.work}
                tamanho={icon.work == 'check' ? 15 : 30}
            />
            <ButtonDropApontamento
                onPress={() => {}}
                numero={'2'}
                titulo={'VEÍCULO'}
                conteudo={transportVehicle.nameProprietary + ' Placa: ' + transportVehicle.plate}
                corIcon={icon.transportVehicle == 'check' ? 'green' : theme.colors.menu}
                nomeIcon={icon.transportVehicle}
                tamanho={icon.transportVehicle == 'check' ? 15 : 30}
            />
            <ButtonDropApontamentoRota
                onPress={handleClickButtonWorkRoute}
                numero={'3'}
                titulo={'ROTA:'}
                saida={workRoute != null || undefined ? workRoute.arrivalLocation : 'Escolha uma rota'}
                destino={workRoute?.departureLocation}
                corIcon={icon.workRoute == 'check' ? 'green' : theme.colors.menu}
                nomeIcon={icon.workRoute}
                tamanho={icon.workRoute == 'check' ? 15 : 30}
            />
            {workRoutes && (
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        alignItems: 'flex-end',
                    }}
                >
                    <FlatList
                        style={styles.list}
                        data={workRoutes}
                        keyExtractor={(item: WorkRoutesDto) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardList onPress={() => handleSelectWorkRoute(item)}>
                                    <CardListContent>
                                        <TextListTitle>LOCAL DE SAÍDA</TextListTitle>
                                        <TextListDescriptor>{item.arrivalLocation}</TextListDescriptor>
                                    </CardListContent>
                                    <CardListContent>
                                        <TextListTitle>LOCAL DE DESTINO</TextListTitle>
                                        <TextListDescriptor>{item.departureLocation}</TextListDescriptor>
                                    </CardListContent>
                                </CardList>
                            )
                        }}
                    />
                </View>
            )}
            {workRoute && (
                <ButtonDropApontamento
                    onPress={handleClickButtonMaterial}
                    numero={'4'}
                    titulo={'MATERIAL:'}
                    conteudo={material != null || undefined ? material.name : 'Escolha um material'}
                    corIcon={icon.material == 'check' ? 'green' : theme.colors.menu}
                    nomeIcon={icon.material}
                    tamanho={icon.material == 'check' ? 15 : 30}
                />
            )}
            {materials && (
                <View style={{ flex: 1, width: '100%', alignItems: 'flex-end' }}>
                    <FlatList
                        style={styles.list}
                        data={materials}
                        keyExtractor={(item: MaterialDto) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardList onPress={() => handleSelectMaterial(item)}>
                                    <CardListContent>
                                        <TextListTitle>MATERIAL</TextListTitle>
                                        <TextListDescriptor>{item.name}</TextListDescriptor>
                                    </CardListContent>
                                </CardList>
                            )
                        }}
                    />
                </View>
            )}
            {material && material.referenceMaterialCalculation === Reference.WEIGHT && (
                <ButtonDropApontamento
                    onPress={handlerClickButtonQuantity}
                    numero={'5'}
                    titulo={'QUANTIDADE:'}
                    conteudo={!quantity ? 'Informe o peso (t)' : quantity / 100 + ' t'}
                    corIcon={icon.quantity == 'check' ? 'green' : theme.colors.menu}
                    nomeIcon={icon.quantity}
                    tamanho={icon.quantity == 'check' ? 15 : 30}
                />
            )}

            {state.quantity && (
                <View style={{ width: '100%', alignItems: 'flex-end' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '88%',
                            backgroundColor: '#fff',
                            height: 80,
                            justifyContent: 'center',
                            borderBottomLeftRadius: 10,
                        }}
                    >
                        <View style={{ width: '57%', marginRight: 10 }}>
                            <DescriptionTextInput
                                description={'Quantidade:* '}
                                erroMenssage={state.erroMessagePicket}
                            />
                            <InputMaskNumber
                                value={null}
                                placeholder={'Quantidade'}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                secureTextEntry={false}
                                onChangeTextFunction={(value) => {
                                    setState((state) => ({
                                        ...state,
                                        quantityInputValue: value
                                            .replace('R$ ', '')
                                            .replace(/\./g, '')
                                            .replace(',', ''),
                                    }))

                                    setState((state) => ({ ...state, erroMessagePicket: '' }))
                                }}
                                autoFocus={true}
                                keyboardType={'numeric'}
                            />
                        </View>
                        <View
                            style={{
                                width: '30%',
                                justifyContent: 'center',
                            }}
                        >
                            <ButtonAction acao={'Salvar'} onPressFunction={handleSelectQuantity} />
                        </View>
                    </View>
                </View>
            )}

            {material != null && material.referenceMaterialCalculation === Reference.VOLUME ? (
                <ButtonDropApontamentoEstaca
                    onPress={handlerClickButtonPicket}
                    numero={'5'}
                    titulo={'ESTACA:'}
                    conteudo={
                        picket != null || undefined ? state.picketDescription : 'Informe o número da estaca'
                    }
                    corIcon={icon.picket == 'check' ? 'green' : theme.colors.menu}
                    nomeIcon={icon.picket}
                    tamanho={icon.picket == 'check' ? 15 : 30}
                />
            ) : (
                <></>
            )}

            {state.picket && picket == null ? (
                <FormInputEstaca>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: '88%',
                            backgroundColor: '#fff',
                            height: 80,
                            justifyContent: 'center',
                            borderBottomLeftRadius: 10,
                        }}
                    >
                        <View style={{ width: '57%', marginRight: 10 }}>
                            <DescriptionTextInput
                                description={'Estaca:* '}
                                erroMenssage={state.erroMessagePicket}
                            />
                            <TextInputMask
                                type={'only-numbers'}
                                onChangeText={(text) => {
                                    setState((state) => ({
                                        ...state,
                                        picketInputValue: parseInt(text),
                                    }))
                                    setState((state) => ({ ...state, erroMessagePicket: '' }))
                                }}
                                autoCapitalize={'characters'}
                                placeholderTextColor="#00000040"
                                autoCorrect={false}
                                secureTextEntry={false}
                                placeholder={'Número da estaca:'}
                                autoFocus={true}
                                keyboardType={'numeric'}
                                style={styles.inputMask}
                            />
                        </View>
                        <View
                            style={{
                                width: '30%',
                                justifyContent: 'center',
                            }}
                        >
                            <ButtonAction acao={'Salvar'} onPressFunction={handlerSelectPicket} />
                        </View>
                    </View>
                </FormInputEstaca>
            ) : (
                <></>
            )}
            {workRoute != null && material != null && picket != null && transportVehicle != null ? (
                <View style={styles.viewObservacao}>
                    <View style={styles.contentObservacao}>
                        <DescriptionTextInput description={'Observação:'} erroMenssage={null} />
                        <InputComponent
                            placeholder={'Observação'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                setState((state) => ({ ...state, observation: value }))
                            }}
                            autoFocus={false}
                            keyboardType={'default'}
                        />
                    </View>
                </View>
            ) : (
                <></>
            )}

            <ButtonView>
                <ButtonRestart onPress={() => handleResestItemsSelect()}>
                    <FontAwesome name={'trash'} size={30} style={{ color: '#fff' }} />
                </ButtonRestart>
                {workRoute != null &&
                    material != null &&
                    picket != null &&
                    transportVehicle != null &&
                    (!state.isLoading ? (
                        <ButtonSave onPress={() => handleSaveItemsSelect()}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>CONFIRMAR</Text>
                            <FontAwesome name={'check'} size={30} style={{ color: '#fff', marginLeft: 10 }} />
                        </ButtonSave>
                    ) : (
                        <ButtonSave onPress={() => {}}>
                            <ActivityIndicator size={'small'} color="#fff" />
                        </ButtonSave>
                    ))}
            </ButtonView>
        </Container>
    )
}

const styles = StyleSheet.create({
    inputMask: {
        borderWidth: 0.9,
        borderColor: '#00000090',
        borderRadius: 5,
        padding: 10,
        marginVertical: 1,
        width: '100%',
        color: '#000',
    },
    list: {
        flex: 1,
        width: '88%',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 10,
    },

    viewObservacao: {
        width: '100%',
        alignItems: 'flex-end',
    },

    contentObservacao: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        width: '88%',
        borderBottomLeftRadius: 10,
        backgroundColor: '#fff',
    },
})

const CardList = styled.TouchableOpacity`
    background-color: #d3d3d3;
    height: 50px;
    margin-top: 4px;
    margin-left: 5px;
    margin-right: 5px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`
const CardListContent = styled.View`
    flex: 1;
    flex-direction: column;
`

const TextListDescriptor = styled.Text`
    margin-left: 5px;
    font-weight: bold;
    font-size: 15px;
`

const TextListTitle = styled.Text`
    margin-left: 5px;
    font-weight: bold;
    font-size: 9px;
`

const ButtonRestart = styled.TouchableOpacity`
    height: 50px;
    width: 100px;
    margin-top: 15px;
    margin-right: 5px;
    margin-left: 10px;
    border-radius: 10px;
    background-color: red;
    justify-content: center;
    align-items: center;
`

const ButtonSave = styled.TouchableOpacity`
    flex: 1;
    height: 50px;
    margin-top: 15px;
    border-radius: 10px;
    margin-right: 10px;
    margin-left: 5px;
    background-color: green;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const ButtonView = styled.View`
    height: 70px;
    flex-direction: row;
`

const FormInputEstaca = styled.View`
    align-items: flex-end;
    width: 100%;
`
