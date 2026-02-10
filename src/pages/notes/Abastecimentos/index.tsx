import Container from '../../../components/Container'
import { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { useAuth } from '../../../contexts/AuthContext'
import Obra from '../../../database/model/WorkModel'
import { getAll as getAllObras } from '../../../dao/ObraDAO'
import { getAll as getVeiculos } from '../../../dao/VeiculoDAO'
import { ActivityIndicator, FlatList, View } from 'react-native'
import Veiculo from '../../../database/model/TransportVehicleModel'
import CardLine from '../../../components/cardLine/CardLine'
import ViewTituloCardLine from '../../../components/cardLine/ViewTituloCardLine'
import CardLineContentRight from '../../../components/cardLine/CardLineContentRight'
import CardLineContent from '../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../components/cardLine/CardLineContentLeft'
import TextConteudoCardLine from '../../../components/cardLine/TextConteudoCardLine'
import TextTituloCardLine from '../../../components/cardLine/TextTituloCardLine'
import ItemObra from '../../../components/List/ItemObra'
import ListaVazia from '../../../components/List/ListaVazia'
import Linha from '../../../components/cardLine/Line'
import ObraSelected from '../../../components/List/ObraSelected'
import { buscarPorEmpresaObra as getAllObraEquipamentos } from '../../../dao/ObraEquipamentoDAO'
import ObraEquipamento from '../../../database/model/WorkEquipmentModel'
import { useApplicationContext } from '../../../contexts/ApplicationContext'

export default function Abastecimentos({ navigation, route }) {
    const [tipo, setTipo] = useState<string>(route.params?.tipo)
    const { usuario } = useAuth()
    const [load, setLoad] = useState(true)
    const [obra, setObra] = useState<Obra>()
    const [veiculos, setVeiculos] = useState<Veiculo[]>([])
    const [equipamentos, setEquipamentos] = useState<ObraEquipamento[]>([])
    const [loadingList, setLoadingList] = useState(true)
    const [obras, setObras] = useState<Obra[]>([])
    const context = useApplicationContext()

    useEffect(() => {
        if (context.obra) {
            __handlerClickItemObra(context.obra)
        } else {
            _getAll()
        }
    }, [load])

    async function _getAll() {
        navigation.addListener('focus', () => setLoad(!load))
        const result = await getAllObras(
            'obras',
            usuario.empresaId,
            usuario.username + '-' + usuario.id,
            usuario.role
        )
        setObras(result)
        setLoadingList(false)
    }

    function __handlerClickItemObra(item: Obra) {
        context.guardarObra(item)
        setObra(item)
        if (tipo) {
            if (tipo == 'equipamento') {
                _getEquipamentos(item.id)
                navigation.setOptions({ title: 'Escolha um equipamento' })
            }
            if (tipo == 'transporte') {
                _getVeiculos(item.id)
                navigation.setOptions({ title: 'Escolha uma caçamba' })
            }
        }
    }

    function _handlerClickItemVeiculo(veiculo: Veiculo) {
        //console.log(veiculo)
        //console.log(obra)
        navigation.navigate('Lista de Abastecimentos', {
            veiculo: veiculo.id,
            obra: obra.id,
            tipo: 'transporte',
        })
    }

    function _handlerClickItemEquipamento(equipamento: ObraEquipamento) {
        //console.log(veiculo)
        //console.log(obra)
        navigation.navigate('Lista de Abastecimentos', {
            veiculo: equipamento.id,
            obra: obra.id,
            tipo: 'equipamento',
        })
    }

    async function _getVeiculos(id: string) {
        setLoadingList(true)
        //console.log(id)
        const result = await getVeiculos('veiculos', usuario.empresaId, id)
        //console.log(result)
        setVeiculos(result)
        setLoadingList(false)
    }

    async function _getEquipamentos(obraId: string) {
        setLoadingList(true)
        const result = await getAllObraEquipamentos(obraId, usuario.empresaId)
        setEquipamentos(result)
        setLoadingList(false)
    }

    if (loadingList) {
        return (
            <Container>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    return (
        <Container>
            {obra == null ? (
                <FlatList
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    data={obras}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <ItemObra
                                active={0.2}
                                onPress={() => __handlerClickItemObra(item)}
                                titulo={item.nome}
                                descricao={item.descricao}
                            />
                        )
                    }}
                />
            ) : loadingList ? (
                <ActivityIndicator size="large" color="#666" />
            ) : veiculos.length != 0 ? (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            navigation.setOptions({ title: 'Escolha uma obra' })
                            setObra(null)
                            context.guardarObra(null)
                            setVeiculos([])
                            setLoad(!load)
                        }}
                        titulo={obra.nome}
                        descricao={obra.descricao}
                    />
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={veiculos}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine
                                    onPress={() => _handlerClickItemVeiculo(item)}
                                    opacity={0.7}
                                >
                                    <ViewTituloCardLine titulo={item.proprietario} />
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Placa:'} />
                                            <TextTituloCardLine conteudo={'Cor:'} />
                                            <TextTituloCardLine conteudo={'Capacidade:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.placa} />
                                            <TextConteudoCardLine conteudo={item.cor} />
                                            <TextConteudoCardLine
                                                conteudo={item.capacidade + ' m³'}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            ) : equipamentos.length != 0 ? (
                <Content>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            setObra(null)
                            setEquipamentos([])
                            context.guardarObra(null)
                            navigation.setOptions({ title: 'Escolha uma obra' })
                            setLoad(!load)
                        }}
                        titulo={obra.nome}
                        descricao={obra.descricao}
                    />
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={equipamentos}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine
                                    onPress={() => {
                                        _handlerClickItemEquipamento(item)
                                    }}
                                    opacity={0.7}
                                >
                                    <ViewTituloCardLine titulo={item.modeloPlaca} />
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Operador:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.proprietario} />
                                            <TextConteudoCardLine
                                                conteudo={item.operadorMotorista}
                                            />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                </Content>
            ) : (
                <Content style={{ justifyContent: 'flex-start' }}>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            setObra(null)
                            context.guardarObra(null)
                            navigation.setOptions({ title: 'Escolha uma obra' })
                            setLoad(!load)
                        }}
                        titulo={obra.nome}
                        descricao={obra.descricao}
                    />
                    <ListaVazia />
                </Content>
            )}
        </Container>
    )
}

const Content = styled.View`
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
`
