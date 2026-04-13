import React, { memo } from 'react'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import LottieView from 'lottie-react-native'
import styled from 'styled-components/native'
import { useSyncButton } from './UseSyncButton'

const SyncStatusIcon = ({ item, model }) => {
    console.log(item)
    const { animation, syncState, handleClickSyncButton } = useSyncButton({
        item,
        model,
    })

    const isGhostSynced = item.serverId === 0 && item.status === 'synced'
    const isPending = item.status === 'created' || item.status === 'updated'
    const isFullySynced = item.serverId > 0 && item.status === 'synced'

    if (isGhostSynced) {
        return (
            <ButtonSync
                onPress={handleClickSyncButton}
                disabled={syncState === 'synchronizing'} // Evita múltiplos cliques
            >
                {syncState === 'synchronizing' ? (
                    <LottieContainer>
                        <LottieView
                            autoPlay
                            loop
                            ref={animation}
                            style={{ width: 40, height: 40 }}
                            source={require('../../assets/sync.json')}
                        />
                    </LottieContainer>
                ) : syncState === 'check' ? (
                    <Ionicons name="checkmark-circle-sharp" size={30} color="#02b126" />
                ) : (
                    <FontAwesome name="refresh" size={30} color="#FF9800" />
                )}
            </ButtonSync>
        )
    }

    if (isPending) {
        return <Ionicons name="timer-outline" size={30} color="#fff" />
    }

    if (isFullySynced) {
        return <Ionicons name="checkmark-circle-sharp" size={30} color="#02b123" />
    }

    return null
}

const ButtonSync = styled.Pressable`
    width: 44px;
    height: 44px;
    justify-content: center;
    align-items: center;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`

const LottieContainer = styled.View`
    width: 50px;
    height: 45px;
    justify-content: center;
    align-items: center;
`

export default memo(SyncStatusIcon)
