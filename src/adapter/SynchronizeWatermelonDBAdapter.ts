import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from '../database'
import Token from '../interfaces/Token'
import axios from 'axios'
import { Alert } from 'react-native'
import { SyncAdapter } from '../domin/application/infra/SyncAdapter'
import { SyncPushResponse } from '../interfaces/SyncPushResponse'
import { SyncRepositoryGateway } from '../domin/application/gateways/SyncRepositoryGateway'

export class SynchronizeWatermelonDBAdapter implements SyncAdapter {
    constructor(private repository: SyncRepositoryGateway) {}

    async sync(token: Token, url: string, signOut: () => void): Promise<SyncPushResponse> {
        let syncPushResponse = {} as SyncPushResponse

        await synchronize({
            database,
            sendCreatedAsUpdated: true,
            pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
                console.log('Last Pull: ' + lastPulledAt)
                try {
                    const urlParams =
                        'last_pulled_at=' +
                        lastPulledAt +
                        '&schema_version=' +
                        schemaVersion +
                        '&migration=' +
                        encodeURIComponent(JSON.stringify(migration))
                    const response = await axios.get(url + '/syncs' + '?' + urlParams, {
                        headers: {
                            Authorization: token ? `Bearer ${token.token}` : '',
                        },
                    })

                    if (response.status == 200) {
                        const { changes, latest_version } = await response.data
                        //console.log(latest_version)
                        //console.log(changes)
                        //console.log('pull finalizado')
                        return { changes, timestamp: latest_version }
                    }
                } catch (err) {
                    console.log(err)
                    if (err.response.status == 401) {
                        console.log(err.response.status)
                        Alert.alert('Faça login novamente', '', [
                            {
                                text: 'Sair',
                                onPress: () => {
                                    signOut()
                                    Alert.alert('Você está desconectado')
                                },
                                style: 'default',
                            },
                        ])
                    }
                    throw Error('Error pulling data: ' + err.message)
                }
            },

            pushChanges: async ({ changes, lastPulledAt }) => {
                //console.log('push latestVersion: ' + lastPulledAt)

                try {
                    const response = await axios.post<SyncPushResponse>(
                        url + '/syncs' + '?last_pulled_at=' + lastPulledAt,

                        changes,
                        {
                            headers: {
                                Authorization: token ? `Bearer ${token.token}` : '',
                            },
                        }
                    )
                    console.log(response.data)
                    syncPushResponse = response.data
                    await this.repository.saveAllServerIds(syncPushResponse)
                } catch (err) {
                    console.log(err)
                    if (err.response.status == 401) {
                        Alert.alert('Faça login novamente', '', [
                            {
                                text: 'Sair',
                                onPress: () => {
                                    signOut()
                                    Alert.alert('Você está desconectado')
                                },
                                style: 'default',
                            },
                        ])
                    }
                    throw Error('Error pushing data: ' + err.message)
                }
            },
            migrationsEnabledAtVersion: 1,
        })

        return syncPushResponse
    }
}
