import * as Updates from 'expo-updates'
import NetInfo from '@react-native-community/netinfo'

export async function onFetchUpdateAsync() {
    try {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected && state.type == 'wifi') {
              /*  const update = await Updates.checkForUpdateAsync()

                if (update.isAvailable) {
                    await Updates.fetchUpdateAsync()
                    await Updates.reloadAsync()
                }*/
            }
        })
    } catch (error) {
        console.log(error)
    }
}
