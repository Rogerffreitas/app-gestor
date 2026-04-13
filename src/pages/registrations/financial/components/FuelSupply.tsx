import { FlatList, View } from 'react-native'
import WorkEquipmentDto from '../../../../domin/entity/work-equipment/WorkEquipmentDto'
import TitleInvoice from './TitleInvoice'
import { FuelSupplyTypes, InvoiceTypes } from '../../../../types'
import { FuelSupplyDto } from '../../../../domin/entity/fuel-supply/FuelSupplyDto'
import TransportVehicleDto from '../../../../domin/entity/transport-vehicle/TransportVehicleDto'
import Line from '../../../../components/cardLine/Line'
import CardLine from '../../../../components/cardLine/CardLine'
import ViewTituloCardLine from '../../../../components/cardLine/ViewTituloCardLine'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'

type props = {
    fuelSupplies: FuelSupplyDto[]
    item: TransportVehicleDto | WorkEquipmentDto
    type: InvoiceTypes
    goBack: () => void
}

export default function ({ fuelSupplies, item, type, goBack }: props) {
    return (
        <View>
            <TitleInvoice goBack={goBack} item={item} type={type} />
            <FlatList
                style={{ width: '100%', marginTop: 5 }}
                data={fuelSupplies}
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
                                        <TextTituloCardLine conteudo={'Quantidade:'} />
                                        <TextTituloCardLine conteudo={'Valor por litro:'} />
                                        <TextTituloCardLine conteudo={'Total:'} />
                                        {item.supplyType != FuelSupplyTypes.EQUIPMENT ? (
                                            <TextTituloCardLine conteudo={'Descontar? '} />
                                        ) : (
                                            <></>
                                        )}
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine
                                            conteudo={
                                                item.quantity
                                                    ? (item.quantity / 100).toLocaleString('pt-BR', {
                                                          style: 'decimal',
                                                          maximumFractionDigits: 2,
                                                      })
                                                    : 0
                                            }
                                        />
                                        <TextConteudoCardLine
                                            conteudo={
                                                item.valuePerLiter
                                                    ? (item.valuePerLiter / 100).toLocaleString('pt-BR', {
                                                          style: 'currency',
                                                          currency: 'BRL',
                                                      })
                                                    : 0
                                            }
                                        />
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
                                        {item.supplyType != FuelSupplyTypes.EQUIPMENT ? (
                                            <TextConteudoCardLine
                                                conteudo={item.isDiscount ? 'Sim' : 'Não'}
                                            />
                                        ) : (
                                            <></>
                                        )}
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
