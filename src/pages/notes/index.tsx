import React, { use, useEffect, useRef, useState } from 'react'
import Container from '../../components/Container'
import styled from 'styled-components/native'
import LottieView from 'lottie-react-native'
import { View, Image, FlatList, ActivityIndicator, Alert } from 'react-native'
import { useAuth } from '../../contexts/AuthContext'
import { useApplicationContext } from '../../contexts/ApplicationContext'
import ObraSelected from '../../components/List/ObraSelected'
import ItemObra from '../../components/List/ItemObra'
import { DiscountTypes, FuelSupplyTypes, MenuOptionsNotesTypes, ScreenNames, UserRoles } from '../../types'
import { errorVibration } from '../../services/VibrationService'
import { useNavigation } from '@react-navigation/native'
import { useInjection } from '@/src/contexts/InjectionContext'
import WorkDto from '@domin/entity/work/WorkDto'

export default function Notes() {
    const workServices = useInjection('WorkServices')
    const navigation = useNavigation()
    const animation = useRef(null)
    const [type, setType] = useState<MenuOptionsNotesTypes>(null)
    const { user } = useAuth()
    const [works, setWorks] = useState<WorkDto[]>([])
    const [isLoadingList, setIsLoadingList] = useState(true)
    const { work, saveWork } = useApplicationContext()

    async function loadAllWork() {
        navigation.setOptions({ title: 'Escolha uma obra' })

        try {
            const allWorks =
                await workServices.loadAllWorkByEnterpriseIdAndUserIdAndValidServerIdFromDatabase(
                    user.enterpriseId,
                    user.id,
                    user.role
                )
            setWorks(allWorks)
        } catch (error) {
            Alert.alert('Erro ao tentar buscar as obras', 'Menssagem: ' + error)
            errorVibration()
        } finally {
            setIsLoadingList(false)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (work) {
                navigation.setOptions({ title: 'Apontamentos' })
                setIsLoadingList(false)
                return
            }
            loadAllWork()
        })
        return unsubscribe
    }, [work, navigation])

    function handleClickItemWork(item: WorkDto) {
        saveWork(item)
        navigation.setOptions({ title: 'Apontamentos' })
    }

    if (isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }

    if (!work) {
        return (
            <Container>
                <FlatList
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    data={works}
                    keyExtractor={(item) => {
                        return item.id
                    }}
                    renderItem={({ item }) => {
                        return (
                            <ItemObra
                                active={0.2}
                                onPress={() => {
                                    handleClickItemWork(item)
                                }}
                                titulo={item.name}
                                descricao={item.description}
                            />
                        )
                    }}
                />
            </Container>
        )
    }

    if (work && !type) {
        return (
            <Container>
                <View
                    style={{
                        width: '100%',
                    }}
                >
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            saveWork(null)
                            loadAllWork()
                        }}
                        titulo={'OBRA: ' + work.name}
                        descricao={work.description}
                    />
                    {user.role == UserRoles.USER || user.role == UserRoles.ADMIN ? (
                        <View>
                            <ButtonStyled onPress={() => setType(MenuOptionsNotesTypes.TRANSPORT_VEHICLE)}>
                                <ImageStyled>
                                    <LottieView
                                        autoPlay
                                        ref={animation}
                                        style={{ width: 90, height: 90 }}
                                        source={require('../../assets/truck2.json')}
                                    />
                                </ImageStyled>
                                <TextContent>
                                    <TextContent>Caçambas</TextContent>
                                </TextContent>
                            </ButtonStyled>
                            <ButtonStyled
                                style={{ backgroundColor: '#000080' }}
                                onPress={() => setType(MenuOptionsNotesTypes.EQUIPMENT)}
                            >
                                <ImageStyled>
                                    <Image
                                        source={require('../../assets/maquina.png')}
                                        style={{ height: 35, width: 92 }}
                                    />
                                </ImageStyled>
                                <TextContent>
                                    <TextContent>Equipamentos</TextContent>
                                </TextContent>
                            </ButtonStyled>
                        </View>
                    ) : (
                        <></>
                    )}
                    {user.role == UserRoles.MAINTENANCE_TRUCK ||
                    user.role === UserRoles.USER ||
                    user.role == UserRoles.ADMIN ? (
                        <ButtonStyled
                            style={{ backgroundColor: '#000080' }}
                            onPress={() => {
                                navigation.navigate(ScreenNames.MAINTENANCE_TRUCK_FUEL_TANK)
                            }}
                        >
                            <ImageStyled>
                                <Image
                                    source={require('../../assets/melosa.png')}
                                    style={{ height: 40, width: 70 }}
                                />
                            </ImageStyled>
                            <TextContent>
                                <TextContent>Melosa</TextContent>
                            </TextContent>
                        </ButtonStyled>
                    ) : (
                        <></>
                    )}
                </View>
            </Container>
        )
    }

    if (work && type) {
        return (
            <Container>
                <View style={{ width: '100%' }}>
                    <ObraSelected
                        active={1}
                        onPress={() => {
                            setType(null)
                        }}
                        titulo={'OBRA: ' + work.name}
                        descricao={work.description}
                    />

                    {type == MenuOptionsNotesTypes.TRANSPORT_VEHICLE && (
                        <ButtonStyled
                            onPress={() => {
                                navigation.navigate(ScreenNames.TRANSPORT_NOTE)
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
                            <TextContent>
                                <TextContent>Transportes</TextContent>
                            </TextContent>
                        </ButtonStyled>
                    )}
                    {type == MenuOptionsNotesTypes.EQUIPMENT && (
                        <ButtonStyled
                            style={{ backgroundColor: '#000080' }}
                            onPress={() => {
                                navigation.navigate(ScreenNames.HOUR_METER_MONITORINGS)
                            }}
                        >
                            <ImageStyled>
                                <Image
                                    source={require('../../assets/maquina.png')}
                                    style={{ height: 35, width: 92 }}
                                />
                            </ImageStyled>
                            <TextContent>
                                <TextContent>Horimetro</TextContent>
                            </TextContent>
                        </ButtonStyled>
                    )}
                    <ButtonStyled
                        style={{ backgroundColor: '#000080' }}
                        onPress={() => {
                            navigation.navigate(ScreenNames.DISCOUNTS, {
                                type: type as unknown as DiscountTypes,
                            })
                        }}
                    >
                        <ImageStyled>
                            <Image
                                source={require('../../assets/invoice.png')}
                                style={{ height: 50, width: 60 }}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Descontos</TextContent>
                        </TextContent>
                    </ButtonStyled>
                    <ButtonStyled
                        style={{ backgroundColor: '#000080' }}
                        onPress={() => {
                            navigation.navigate(ScreenNames.FUEL_SUPPLIES, {
                                type: type as unknown as FuelSupplyTypes,
                            })
                        }}
                    >
                        <ImageStyled>
                            <Image
                                source={require('../../assets/fuel-station.png')}
                                style={{ height: 50, width: 40 }}
                            />
                        </ImageStyled>
                        <TextContent>
                            <TextContent>Abastecimentos</TextContent>
                        </TextContent>
                    </ButtonStyled>
                </View>
            </Container>
        )
    }
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
    font-size: 30px;
    flex: 1;
    align-self: center;
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
