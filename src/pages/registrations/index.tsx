import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, View } from 'react-native'
import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'
import Container from '../../components/Container'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import { WorkServicesImpl } from '../../domin/services/impl/WorkServicesImpl'
import { AxiosHttpClientAdapter } from '../../infra/adapter/AxiosHttpClientAdapter'
import { WorkWatermelonDbRepository } from '../../persistence/WorkWatermelonDbRepository'
import { UserServicesImpl } from '../../domin/services/impl/UserServicesImpl'
import { DepositServicesImpl } from '../../domin/services/impl/DepositServicesImpl'
import { DepositWatermelonDbRepository } from '../../persistence/DepositWatermelonDbRepository'
import { MaterialServicesImpl } from '../../domin/services/impl/MaterialServicesImpl'
import { MaterialWatermelonDbRepository } from '../../persistence/MaterialWatermelonDbRepository'
import { WorkRoutesWatermelonDbRepository } from '../../persistence/WorkRoutesWatermelonDbRepository'
import { WorkRoutesServicesImpl } from '../../domin/services/impl/WorkRoutesServicesImpl'
import EquipmentServicesImpl from '../../domin/services/impl/EquipmentServicesImpl'
import { EquipmentWatermelonDbResitory } from '../../persistence/EquipmentWatermelonDbResitory'
import WorkEquipmentServicesImpl from '../../domin/services/impl/WorkEquipmentServicesImpl'
import { WorkEquipmentWatermelonDbRepository } from '../../persistence/WorkEquipmentWatermelonDbRepository'
import { MaintenanceTruckServicesImpl } from '../../domin/services/impl/MaintenanceTruckServicesImpl'
import { MaintenanceTruckWatermelonDbRepository } from '../../persistence/MaintenanceTruckWatermelonDbRepository'
import { ScreenNames } from '../../types'
import { TransportVehicleServicesImpl } from '../../domin/services/impl/TransportVehicleServicesImpl'
import { TransportVehicleWatermelonDbRepository } from '../../persistence/TransportVehicleWatermelonDbRepository'

export default function Cadastros({ navigation }) {
    const animation = useRef(null)
    const [netInfoState, setNetInfoState] = useState<boolean>(false)
    const [netInfoType, setNetInfoType] = useState<NetInfoStateType>()

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            //console.log(state.type)
            //console.log(state.isConnected)
            setNetInfoType(state.type)
            setNetInfoState(state.isConnected)
            if (!state.isConnected) {
                Alert.alert(
                    'Você está sem internet',
                    'Para ultilizar essas funções é nescessário que você esteja conectado'
                )
            }
        })
    }, [])

    const clickEventListener = (item) => {
        navigation.navigate(item)
    }

    return (
        <Container>
            <View style={{ width: '100%', height: '100%' }}>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate('Works', {
                            userServices: new UserServicesImpl(new AxiosHttpClientAdapter()),
                            workServices: new WorkServicesImpl(
                                new WorkWatermelonDbRepository(),
                                new AxiosHttpClientAdapter()
                            ),
                            workRoutesServices: new WorkRoutesServicesImpl(
                                new WorkRoutesWatermelonDbRepository()
                            ),
                            depositServices: new DepositServicesImpl(new DepositWatermelonDbRepository()),
                        })
                    }}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 80, height: 80 }}
                            source={require('../../assets/obra.json')}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE OBRAS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() =>
                        navigation.navigate('Deposits', {
                            depositServices: new DepositServicesImpl(new DepositWatermelonDbRepository()),
                            materialServices: new MaterialServicesImpl(new MaterialWatermelonDbRepository()),
                        })
                    }
                >
                    <ImageStyled>
                        <Image
                            source={require('../../assets/material.png')}
                            style={{ height: 43, width: 90 }}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE MATERIAIS</TextContent>
                </ButtonStyled>

                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate(ScreenNames.TRANSPORT_VEHICLES, {
                            transportVehicleServices: new TransportVehicleServicesImpl(
                                new TransportVehicleWatermelonDbRepository()
                            ),
                            workServices: new WorkServicesImpl(
                                new WorkWatermelonDbRepository(),
                                new AxiosHttpClientAdapter()
                            ),
                        })
                    }}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 90, height: 90 }}
                            source={require('../../assets/truck2.json')}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE CAÇAMBAS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => {
                        navigation.navigate('Equipment', {
                            equipmentServices: new EquipmentServicesImpl(new EquipmentWatermelonDbResitory()),
                            workServices: new WorkServicesImpl(
                                new WorkWatermelonDbRepository(),
                                new AxiosHttpClientAdapter()
                            ),
                            userServices: new UserServicesImpl(new AxiosHttpClientAdapter()),
                            workEquipmentServices: new WorkEquipmentServicesImpl(
                                new WorkEquipmentWatermelonDbRepository()
                            ),
                            maintenanceTruckServices: new MaintenanceTruckServicesImpl(
                                new MaintenanceTruckWatermelonDbRepository()
                            ),
                        })
                    }}
                >
                    <ImageStyled>
                        <Image
                            source={require('../../assets/maquina.png')}
                            style={{ height: 35, width: 92 }}
                        />
                    </ImageStyled>
                    <TextContent>CADASTRO DE EQUIPAMENTOS</TextContent>
                </ButtonStyled>
                <ButtonStyled
                    style={{ backgroundColor: '#000080' }}
                    onPress={() => clickEventListener('Financeiro')}
                >
                    <ImageStyled>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 60, height: 60 }}
                            source={require('../../assets/finaceiro.json')}
                        />
                    </ImageStyled>
                    <TextContent>FINANCEIRO</TextContent>
                </ButtonStyled>
            </View>
        </Container>
    )
}

const ImageStyled = styled.View`
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    align-items: center;
    justify-content: center;
`
const TextContent = styled.Text`
    font-size: 20px;
    flex: 1;
    align-self: center;
    margin-top: 10px;
    color: ${(props) => props.theme.fontColors.primary};
    font-weight: bold;
`

const ButtonStyled = styled.TouchableOpacity`
    height: 120px;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    background-color: ${(props) => props.theme.colors.menu};
    padding: 5px;
    flex-direction: column;
    border-radius: 10px;
`
