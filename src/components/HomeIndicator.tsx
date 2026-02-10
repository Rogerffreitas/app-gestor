import React, { useEffect, useRef, useState } from 'react'
import { sync } from '../services/sync'
import styled from 'styled-components/native'
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Feather from '@expo/vector-icons/Feather'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import LottieView from 'lottie-react-native'
import { ToastAndroid, View } from 'react-native'

const SyncIndicator = () => {
    const [syncState, setSyncState] = useState<boolean>(false)
    const [syncText, setSyncText] = useState<string>('')
    const [netInfoState, setNetInfoState] = useState<boolean>(false)
    const [netInfoType, setNetInfoType] = useState<NetInfoStateType>()
    const animation = useRef(null)
    const Auth = useAuth()
    const Config = useConfig()

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            //console.log(state.type)
            //console.log(state.isConnected)
            setNetInfoType(state.type)
            setNetInfoState(state.isConnected)
        })
    }, [])

    useEffect(() => {
        if (netInfoState && Auth.token != null) {
            setSyncState(true)
            ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
            setTimeout(function () {
                sync(Auth.token, Config.urlApi, Auth.signOut)
                    .then(() => {
                        setSyncState(false)
                        setSyncText('')
                        Config.lastConectionServer = Date.now()
                    })
                    .catch((err) => {
                        console.log('sync:' + err)
                        setSyncState(false)
                        setSyncText('Sync failed!')
                    })
            }, 3000)
        }
    }, [netInfoState, Auth.token])

    async function syncForcada() {
        setSyncState(true)
        ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
        setTimeout(function () {
            sync(Auth.token, Config.urlApi, Auth.signOut)
                .then(() => {
                    setSyncState(false)
                    setSyncText('')
                    Config.lastConectionServer = Date.now()
                })
                .catch((err) => {
                    console.log('sync:' + err)
                    setSyncState(false)
                    setSyncText('Sync failed!')
                })
        }, 3000)
    }

    return (
        <SyncStylesContainer>
            <View style={{ width: '15%', alignItems: 'center' }}>
                {syncText == 'Sync failed!' ? <Text>⚠️</Text> : <Text></Text>}
            </View>
            {netInfoState ? (
                syncState != false ? (
                    <View style={{ width: '33%', alignItems: 'center' }}>
                        <LottieView
                            autoPlay
                            ref={animation}
                            style={{ width: 50, height: 50 }}
                            source={require('../assets/sync.json')}
                        />
                    </View>
                ) : (
                    <ButtonSync
                        onPress={() => {
                            console.log('sync')
                            syncForcada()
                        }}
                    >
                        <FontAwesome name="refresh" size={25} color={'#fff'} />
                    </ButtonSync>
                )
            ) : (
                ''
            )}
            <View style={{ width: '33%', alignItems: 'center' }}>
                {netInfoState != true ? (
                    <Feather name="wifi-off" size={25} color={'#FFF'} />
                ) : netInfoType == NetInfoStateType.wifi ? (
                    <FontAwesome name="wifi" size={25} color={'#fff'} />
                ) : (
                    <Ionicons name="cellular" size={24} color={'#fff'} />
                )}
            </View>
        </SyncStylesContainer>
    )
}

const SyncStylesContainer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const SyncStylesText = styled.Text`
    color: #ffffff;
`

const Text = styled.Text`
    font-size: 15px;
    color: #fff;
    font-weight: bold;
`

const ButtonSync = styled.Pressable`
    width: 33%;
    align-items: center;
`

export default SyncIndicator
