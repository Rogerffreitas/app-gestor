import React, { useRef, useState } from 'react'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useAuth } from '../contexts/AuthContext'
import { useConfig } from '../contexts/ConfigContext'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { sync } from '../services/sync'

export default function ({ item, model }) {
    const Auth = useAuth()
    const Config = useConfig()
    const [syncState, setSyncState] = useState('')
    const animation = useRef(null)

    //console.log(item._raw._status)
    return item.status == 'created' || item.status == 'updated' ? (
        <Ionicons name="timer-outline" size={30} color={'#fff'} />
    ) : item.serverId > 0 ? (
        <Ionicons name="checkmark-circle-sharp" size={30} color={'#02b126'} />
    ) : item.status == 'synced' ? (
        <ButtonSync
            onPress={() => {
                setSyncState('synchronizing')
                //console.log(item)
                setTimeout(async function () {
                    try {
                        const response = await axios.post(
                            Config.urlApi + 'syncs/sync',
                            {
                                item: item,
                                model: model,
                            },

                            {
                                headers: {
                                    Authorization: Auth.token ? `Bearer ${Auth.token.token}` : '',
                                },
                            }
                        )

                        if (response.status == 200 || response.status == 201) {
                            const result = response.data
                            console.log('btn sync ' + result)
                            sync(Auth.token, Config.urlApi, Auth.signOut)
                        }

                        setSyncState('check')
                    } catch (error) {
                        console.error(error.message)
                        setSyncState('sync')
                    }
                }, 3000)
            }}
        >
            {syncState == 'synchronizing' ? (
                <View style={{ alignItems: 'center' }}>
                    <LottieView
                        autoPlay
                        ref={animation}
                        style={{ width: 50, height: 45 }}
                        source={require('../assets/sync.json')}
                    />
                </View>
            ) : syncState == 'check' ? (
                <Ionicons name="checkmark-circle-sharp" size={30} color={'#02b126'} />
            ) : (
                <FontAwesome name="refresh" size={30} color={'#fff'} />
            )}
        </ButtonSync>
    ) : (
        <Ionicons name="timer-outline" size={30} color={'#fff'} />
    )
}

const ButtonSync = styled.Pressable`
    width: 100%;
    align-items: center;
`
