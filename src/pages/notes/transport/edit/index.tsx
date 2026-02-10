import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Text, View } from 'react-native'
import { useAuth } from '../../../../contexts/AuthContext'
import Obra from '../../../../database/model/WorkModel'
import WorkRoutesModel from '../../../../database/model/WorkRoutesModel'
import TransportVehicle from '../../../../database/model/TransportVehicleModel'
import Material from '../../../../database/model/MaterialModel'
import * as RotaDAO from '../../../../dao/RotaDao'
import * as MaterialDAO from '../../../../dao/MaterialDAO'
import * as VeiculoDAO from '../../../../dao/VeiculoDAO'
import styled from 'styled-components/native'
import { LinearGradient } from 'expo-linear-gradient'
import theme from '../../../../global/styles/theme'
import ButtonDropApontamento from '../../../../components/button/ButtonDropApontamento'
import ButtonDropApontamentoRota from '../../../../components/button/ButtonDropApontamentoRota'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonDropApontamentoEstaca from '../../../../components/button/ButtonDropApontamentoEstaca'
import InputMask from '../../../../components/input/InputMask'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useConfig } from '../../../../contexts/ConfigContext'
import { save } from '../../../../dao/TransporteDAO'
import { CommonActions } from '@react-navigation/native'

export default function Apontamentos({ navigation, route }) {
    const { usuario } = useAuth()
    const { deslocamentoInternoObraPago, espacoEstacaMetro } = useConfig()

    const [obra, setObra] = useState<Obra>(route.params?.obra)
    const [rota, setRota] = useState<Rota>(null)
    const [rotas, setRotas] = useState<Rota[]>(null)
    const [veiculo, setVeiculo] = useState<Veiculo>()
    const [veiculos, setVeiculos] = useState<Veiculo[]>([])
    const [material, setMaterial] = useState<Material>()
    const [materiais, setMateriais] = useState<Material[]>()
    const [estaca, setEstaca] = useState<number>(null)

    const [iconObra, setIconObra] = useState('check')
    const [iconRota, setIconRota] = useState('caret-left')
    const [iconMaterial, setIconMaterial] = useState('caret-left')
    const [iconVeiculo, setIconVeiculo] = useState('caret-left')
    const [iconEstaca, setIconEstaca] = useState('caret-left')

    const [estadoEstaca, setEstadoEstaca] = useState(false)
    const [preEstaca, setPreEstaca] = useState<number>(null)

    const [dropButtonRota, setDropButtonRota] = useState(false)
    const [dropButtonMaterial, setDropButtonMaterial] = useState(false)
    const [dropButtonVeiculo, setDropButtonVeiculo] = useState(false)
    const [dropButtonEstaca, setDropButtonEstaca] = useState(false)

    const [erroMessageEstaca, setErroMessageEstaca] = useState(null)

    useEffect(() => {
        async function config() {
            if (rota == null || undefined) {
                if (dropButtonRota) {
                    const result = await RotaDAO.getAll('rotas', obra.id)
                    setRotas(result)
                    setIconRota('caret-down')
                } else {
                    setRotas(null)
                    setIconRota('caret-left')
                }
            }
            if (material == null || undefined) {
                if (dropButtonMaterial) {
                    const result = await MaterialDAO.getAll('materiais', usuario.empresaId, rota.id)
                    setMateriais(result)
                    setIconMaterial('caret-down')
                } else {
                    setMateriais(null)
                    setIconMaterial('caret-left')
                }
            }
            if (veiculo == null || undefined) {
                if (dropButtonVeiculo) {
                    const result = await VeiculoDAO.getAll('veiculos', usuario.empresaId, obra.id)
                    setVeiculos(result)
                    setIconVeiculo('caret-down')
                } else {
                    setVeiculos(null)
                    setIconVeiculo('caret-left')
                }
            }
            if (estaca == null || undefined) {
                if (dropButtonEstaca) {
                    setIconEstaca('caret-down')
                    setEstadoEstaca(true)
                } else {
                    setEstadoEstaca(false)
                    setIconEstaca('caret-left')
                }
            }
        }
        config()
    }, [dropButtonRota, dropButtonMaterial, dropButtonVeiculo, dropButtonEstaca])

    function _handlerClickButtonObra() {}

    function _handlerClickButtonRota() {
        setDropButtonRota(!dropButtonRota)
    }

    function _handlerClickButtonMaterial() {
        setDropButtonMaterial(!dropButtonMaterial)
    }

    function _handlerClickButtonVeiculo() {
        setDropButtonVeiculo(!dropButtonVeiculo)
    }
    function _handlerClickButtonEstaca() {
        setDropButtonEstaca(!dropButtonEstaca)
    }

    function _handlerSelectRota(item: Rota) {
        setRota(item)
        setIconRota('check')
        setRotas(null)
    }

    function _handlerSelectMaterial(item: Material) {
        setMaterial(item)
        setIconMaterial('check')
        setMateriais(null)
    }

    function _handlerSelectVeiculo(item: Veiculo) {
        setVeiculo(item)
        setIconVeiculo('check')
        setVeiculos(null)
    }

    function _handlerSelectEstaca() {
        setEstaca(preEstaca)
        setIconEstaca('check')
        setDropButtonEstaca(!dropButtonEstaca)
        setEstadoEstaca(null)
    }

    function _handlerResestItemsSelect() {
        setMateriais(null)
        setVeiculos(null)
        setRotas(null)
        setRota(null)
        setVeiculo(null)
        setMaterial(null)
        setEstadoEstaca(false)
        setEstaca(null)
        setDropButtonVeiculo(false)
        //setIconEstaca('caret-left')
        setDropButtonEstaca(false)
        setDropButtonMaterial(false)
        setDropButtonRota(false)
    }

    async function _handlerSaveItemsSelect() {
        let kmPercorridosInternoObra = 0

        if (deslocamentoInternoObraPago) {
            let metrosEstacas = estaca * espacoEstacaMetro
            kmPercorridosInternoObra = metrosEstacas / 1000
        }

        let kmTotal = rota.km + kmPercorridosInternoObra
        let valorTotal = rota.valor * kmTotal * veiculo.capacidade

        let result = await save(
            rota.id,
            rota.saida,
            rota.destino,
            kmTotal,
            parseFloat(valorTotal.toFixed(2)),
            veiculo.id,
            veiculo.descricao,
            veiculo.placa,
            veiculo.capacidade,
            estaca + '',
            kmPercorridosInternoObra,
            material.nome,
            obra.id,
            usuario.empresaId,
            usuario.id
        )

        if (result.id) {
            Alert.alert('Apontamento realizado')
            navigation.dispatch(CommonActions.goBack())
        }
    }

    return (
        <LinearGradient
            // Button Linear Gradient
            colors={['#009999', '#00999930', '#00999930', '#009999']}
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container>
                <ButtonDropApontamento
                    onPress={_handlerClickButtonObra}
                    numero={'1'}
                    titulo={'OBRA:'}
                    conteudo={obra.nome}
                    corIcon={iconObra == 'check' ? 'green' : theme.colors.menu}
                    nomeIcon={iconObra}
                    tamanho={iconObra == 'check' ? 15 : 30}
                />
                <ButtonDropApontamentoRota
                    onPress={_handlerClickButtonRota}
                    numero={'2'}
                    titulo={'ROTA:'}
                    saida={rota != null || undefined ? rota.saida : 'Escolha uma rota'}
                    destino={rota?.destino}
                    corIcon={iconRota == 'check' ? 'green' : theme.colors.menu}
                    nomeIcon={iconRota}
                    tamanho={iconRota == 'check' ? 15 : 30}
                />
                {rotas != null ? (
                    <FlatList
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginTop: 5,
                            marginLeft: 15,
                            marginRight: 15,
                            paddingTop: 5,
                        }}
                        data={rotas}
                        keyExtractor={(item: Rota) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardList onPress={() => _handlerSelectRota(item)}>
                                    <CardListContent>
                                        <TextListTitle>LOCAL DE SAÍDA</TextListTitle>
                                        <TextListDescriptor>{item.saida}</TextListDescriptor>
                                    </CardListContent>
                                    <CardListContent>
                                        <TextListTitle>LOCAL DE DESTINO</TextListTitle>
                                        <TextListDescriptor>{item.destino}</TextListDescriptor>
                                    </CardListContent>
                                </CardList>
                            )
                        }}
                    />
                ) : (
                    ''
                )}
                {rota != null ? (
                    <ButtonDropApontamento
                        onPress={_handlerClickButtonMaterial}
                        numero={'3'}
                        titulo={'MATERIAL:'}
                        conteudo={
                            material != null || undefined ? material.nome : 'Escolha um material'
                        }
                        corIcon={iconMaterial == 'check' ? 'green' : theme.colors.menu}
                        nomeIcon={iconMaterial}
                        tamanho={iconMaterial == 'check' ? 15 : 30}
                    />
                ) : (
                    ''
                )}
                {materiais != null ? (
                    <FlatList
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginTop: 5,
                            marginLeft: 15,
                            marginRight: 15,
                            paddingTop: 5,
                        }}
                        data={materiais}
                        keyExtractor={(item: Material) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardList onPress={() => _handlerSelectMaterial(item)}>
                                    <CardListContent>
                                        <TextListTitle>MATERIAL</TextListTitle>
                                        <TextListDescriptor>{item.nome}</TextListDescriptor>
                                    </CardListContent>
                                </CardList>
                            )
                        }}
                    />
                ) : (
                    ''
                )}

                {material != null ? (
                    <ButtonDropApontamentoEstaca
                        onPress={_handlerClickButtonEstaca}
                        numero={'4'}
                        titulo={'ESTACA:'}
                        conteudo={
                            estaca != null || undefined ? estaca : 'Informe o número da estaca'
                        }
                        corIcon={iconEstaca == 'check' ? 'green' : theme.colors.menu}
                        nomeIcon={iconEstaca}
                        tamanho={iconEstaca == 'check' ? 15 : 30}
                    />
                ) : (
                    ''
                )}

                {estadoEstaca ? (
                    <FormInputEstaca>
                        <InputMask
                            type={'only-numbers'}
                            mask={'defaults'}
                            placeholder={'Informe o número da estaca:'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(text) => {
                                setPreEstaca(text), setErroMessageEstaca('')
                            }}
                            autoFocus={true}
                            keyboardType={'numeric'}
                            value={undefined}
                        />

                        <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 12 }}>
                            {erroMessageEstaca}
                        </Text>

                        <ButtonAction acao={'Salvar'} onPressFunction={_handlerSelectEstaca} />
                    </FormInputEstaca>
                ) : (
                    ''
                )}

                {estaca != null ? (
                    <ButtonDropApontamento
                        onPress={_handlerClickButtonVeiculo}
                        numero={'5'}
                        titulo={'VEÍCULO'}
                        conteudo={
                            veiculo != null || undefined ? veiculo.placa : 'Escolha um Veículo'
                        }
                        corIcon={iconVeiculo == 'check' ? 'green' : theme.colors.menu}
                        nomeIcon={iconVeiculo}
                        tamanho={iconVeiculo == 'check' ? 15 : 30}
                    />
                ) : (
                    ''
                )}
                {veiculos != null ? (
                    <FlatList
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            marginTop: 5,
                            marginLeft: 15,
                            marginRight: 15,
                            paddingTop: 5,
                        }}
                        data={veiculos}
                        keyExtractor={(item: Veiculo) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <View
                                    style={{
                                        alignItems: 'center',
                                        borderBottomColor: '#00000050',
                                        paddingBottom: 3,
                                        borderBottomWidth: 1,
                                    }}
                                >
                                    <CardPlaca onPress={() => _handlerSelectVeiculo(item)}>
                                        <CardListContent>
                                            <ViewPlaca>
                                                <TextPlacaTitle>PLACA</TextPlacaTitle>
                                            </ViewPlaca>

                                            <TextPlacaDescripition>
                                                {item.placa}
                                            </TextPlacaDescripition>
                                        </CardListContent>
                                    </CardPlaca>
                                </View>
                            )
                        }}
                    />
                ) : (
                    ''
                )}
                <ButtonView>
                    <ButtonRestart onPress={() => _handlerResestItemsSelect()}>
                        <FontAwesome name={'trash'} size={30} style={{ color: '#fff' }} />
                    </ButtonRestart>
                    {rota != null && material != null && estaca != null && veiculo != null ? (
                        <ButtonSave onPress={_handlerSaveItemsSelect}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>CONFIRMAR</Text>
                            <FontAwesome
                                name={'check'}
                                size={30}
                                style={{ color: '#fff', marginLeft: 10 }}
                            />
                        </ButtonSave>
                    ) : (
                        ''
                    )}
                </ButtonView>
            </Container>
        </LinearGradient>
    )
}

const Container = styled.View`
    flex: 1;
    width: 100%;
    flex-direction: column;
`

const CardList = styled.TouchableOpacity`
    flex: 1;
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

const TextPlacaTitle = styled.Text`
    flex: 1;
    width: 100%;
    font-weight: bold;
    font-size: 15px;
    color: #fff;
    background-color: #000080;
    text-align: center;
`

const TextPlacaDescripition = styled.Text`
    flex: 1;
    width: 100%;
    margin-left: 5px;
    margin-right: 5px;
    font-weight: bold;
    font-size: 25px;
    color: #000;
    text-align: center;
`

const CardPlaca = styled.TouchableOpacity`
    flex: 1;
    height: 70px;
    width: 70%;
    background-color: #fff;
    border: 3px;
    border-radius: 8px;
    margin-top: 4px;
    margin-left: 5px;
    margin-right: 5px;
`
const ViewPlaca = styled.View`
    height: 20px;
    width: 100%;
    flex-direction: row;
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
    background-color: #fff;
    margin-top: 5px;
    margin-left: 15px;
    margin-right: 15px;
    padding: 10px;
`
