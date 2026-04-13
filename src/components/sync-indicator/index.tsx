import React from 'react'
import styled from 'styled-components/native'
import { NetInfoStateType } from '@react-native-community/netinfo'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Feather from '@expo/vector-icons/Feather'
import { Ionicons } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import { useSyncIndicator } from './UseSyncIndicator'

export default function SyncIndicator() {
    const { isSyncing, status, isConnected, connectionType, animation, manualSync } = useSyncIndicator()
    if (isConnected && connectionType === NetInfoStateType.wifi) {
        return (
            <SyncStylesContainer>
                <StatusSlot>{status === 'error' && <WarningText>⚠️</WarningText>}</StatusSlot>
                <ActionSlot>
                    {isSyncing ? (
                        <LottieView
                            autoPlay
                            loop
                            ref={animation}
                            style={{ width: 45, height: 45 }}
                            source={require('../../assets/sync.json')}
                        />
                    ) : (
                        <ButtonSync onPress={manualSync}>
                            <FontAwesome name="refresh" size={22} color="#fff" />
                        </ButtonSync>
                    )}
                </ActionSlot>

                <StatusSlot>{renderNetworkIcon(isConnected, connectionType)}</StatusSlot>
            </SyncStylesContainer>
        )
    }

    return (
        <SyncStylesContainer>
            <StatusSlot>{status === 'error' && <WarningText>⚠️</WarningText>}</StatusSlot>
            <ActionSlot>
                <IconPlaceholder />
            </ActionSlot>
            <StatusSlot>{renderNetworkIcon(isConnected, connectionType)}</StatusSlot>
        </SyncStylesContainer>
    )
}

const renderNetworkIcon = (isConnected, type) => {
    if (!isConnected) return <Feather name="wifi-off" size={22} color="#FF5252" />

    return type === NetInfoStateType.wifi ? (
        <FontAwesome name="wifi" size={22} color="#fff" />
    ) : (
        <Ionicons name="cellular" size={22} color="#fff" />
    )
}

const SyncStylesContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 100%;
`

const StatusSlot = styled.View`
    width: 25%;
    align-items: center;
`

const ActionSlot = styled.View`
    width: 40%;
    align-items: center;
    justify-content: center;
`

const WarningText = styled.Text`
    font-size: 16px;
`

const ButtonSync = styled.Pressable`
    padding: 8px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.2); /* Feedback visual sutil */
    align-items: center;
    justify-content: center;
`

const IconPlaceholder = styled.View`
    height: 40px;
`
