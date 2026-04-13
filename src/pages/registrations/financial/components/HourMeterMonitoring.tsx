import { FlatList, View } from 'react-native'
import {
    Card,
    CardContent,
    TextDescricao,
    TextLabel,
    TextTitulo,
    ViewLeft,
    ViewRight,
    ViewTitle,
} from '../../../../components/List/FlatListItemApontamento'
import HourMeterMonitoringDto from '../../../../domin/entity/hour-meter-monitoring/HourMeterMonitoringDto'
import { styled } from 'styled-components/native'
import WorkEquipmentDto from '../../../../domin/entity/work-equipment/WorkEquipmentDto'
import TitleInvoice from './TitleInvoice'
import { InvoiceTypes } from '../../../../types'

type props = {
    hourMeterMonitoring: HourMeterMonitoringDto[]
    workEquipment: WorkEquipmentDto
    type: InvoiceTypes
    goBack: () => void
}

export default function ({ hourMeterMonitoring, workEquipment, type, goBack }: props) {
    return (
        <View>
            <TitleInvoice goBack={goBack} item={workEquipment} type={type} />
            <FlatList
                style={{ width: '100%', marginTop: 5 }}
                data={hourMeterMonitoring}
                keyExtractor={(item) => {
                    return item.id
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <Card onPress={goBack} activeOpacity={1}>
                                <ViewTitle>
                                    <View
                                        style={{
                                            height: 60,
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <TextTitulo>{workEquipment.equipment.modelOrPlate}</TextTitulo>

                                        <TextSubTitulo>
                                            {workEquipment.equipment.nameProprietary}
                                        </TextSubTitulo>
                                    </View>
                                </ViewTitle>
                                <CardContent>
                                    <ViewLeft>
                                        <TextLabel>
                                            {workEquipment.equipment.isEquipment
                                                ? 'Horimentro inicial:'
                                                : 'Hodômetro inicial'}
                                        </TextLabel>
                                        <TextDescricao>
                                            {workEquipment.equipment.isEquipment
                                                ? item?.initialHourMeterValue / 10 + ' H'
                                                : item?.initialHourMeterValue / 10 + ' Km'}
                                        </TextDescricao>
                                        <TextLabel>
                                            {workEquipment.equipment.isEquipment
                                                ? 'Horimentro final:'
                                                : 'Hodômetro final'}
                                        </TextLabel>
                                        <TextDescricao>
                                            {item.workEquipment.equipment.isEquipment
                                                ? item?.currentHourMeterValue / 10 + ' H'
                                                : item?.currentHourMeterValue / 10 + ' Km'}
                                        </TextDescricao>
                                        {item.observation ? (
                                            <View>
                                                <TextLabel>Obeservação: </TextLabel>
                                                <TextDescricao>{item.observation}</TextDescricao>
                                            </View>
                                        ) : (
                                            <View></View>
                                        )}
                                    </ViewLeft>
                                    <ViewRight>
                                        <TextLabel>Data: </TextLabel>
                                        <TextDescricao>{item.date}</TextDescricao>
                                        <TextLabel>Total: </TextLabel>
                                        <TextDescricao>
                                            {workEquipment.equipment.isEquipment
                                                ? item?.totalCalculatedInThePeriodInformed / 10 + ' H'
                                                : item?.totalCalculatedInThePeriodInformed / 10 + ' Km'}
                                        </TextDescricao>
                                    </ViewRight>
                                </CardContent>
                            </Card>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export const TextSubTitulo = styled.Text`
    width: 100%;
    text-align: left;
    margin-top: 2px;
    margin-left: 10px;
    font-size: 13px;
    flex: 1;
    color: #fff;
    font-weight: bold;
`
