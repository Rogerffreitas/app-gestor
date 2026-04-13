import { FlatList, View } from 'react-native'
import WorkEquipmentDto from '../../../../domin/entity/work-equipment/WorkEquipmentDto'
import CardLine from '../../../../components/cardLine/CardLine'
import TitleInvoice from './TitleInvoice'
import { InvoiceTypes } from '../../../../types'
import DiscountDto from '../../../../domin/entity/discount/DiscountDto'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import Line from '../../../../components/cardLine/Line'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'

type props = {
    discounts: DiscountDto[]
    item: TransportVehicleDto | WorkEquipmentDto
    type: InvoiceTypes
    goBack: () => void
}

export default function ({ discounts, item, type, goBack }: props) {
    return (
        <View>
            <TitleInvoice goBack={goBack} item={item} type={type} />
            <FlatList
                style={{ width: '100%', marginTop: 5 }}
                data={discounts}
                keyExtractor={(item) => {
                    return item.id
                }}
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flex: 1 }}>
                            <CardLine onPress={() => ({})} opacity={1}>
                                <ViewTituloCardLine titulo={item.description} />

                                <Line />
                                <CardLineContent>
                                    <CardLineContentLeft>
                                        <TextTituloCardLine conteudo={'Valor:'} />
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine
                                            conteudo={
                                                item.value
                                                    ? (item.value / 100).toLocaleString('pt-BR', {
                                                          style: 'currency',
                                                          currency: 'BRL',
                                                      })
                                                    : 0
                                            }
                                        />
                                    </CardLineContentRight>
                                </CardLineContent>
                            </CardLine>
                        </View>
                    )
                }}
            />
        </View>
    )
}
