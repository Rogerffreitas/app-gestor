import styled from 'styled-components/native'
import CardLine from '../../../../components/cardLine/CardLine'
import { InvoiceTypes } from '../../../../types'
import CardLineContent from '../../../../components/cardLine/CardLineContent'
import CardLineContentRight from '../../../../components/cardLine/CardLineContentRight'
import CardLineContentLeft from '../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../components/cardLine/TextTituloCardLine'
import Line from '../../../../components/cardLine/Line'
import TextConteudoCardLine from '../../../../components/cardLine/TextConteudoCardLine'
import TransportVehicleDto from '@gestor/domain/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '@gestor/domain/entity/work-equipment/WorkEquipmentDto'
import FontAwesome from '@expo/vector-icons/FontAwesome'

type props = {
    item: TransportVehicleDto | WorkEquipmentDto
    type: InvoiceTypes
    goBack: () => void
}
export default function TitleInvoice({ item, type, goBack }: props) {
    if (type === InvoiceTypes.EQUIPMENT && item) {
        const workEquipment = item as WorkEquipmentDto
        return (
            <CardLine onPress={() => goBack()} opacity={0.7}>
                <ViewTituloCardLineSelected>
                    <TextTitlo>{workEquipment.equipment.modelOrPlate}</TextTitlo>
                    <ViewButtonCancel>
                        <FontAwesome name="close" size={20} color={'#fff'} />
                    </ViewButtonCancel>
                </ViewTituloCardLineSelected>
                <Line />
                <CardLineContent>
                    <CardLineContentLeft>
                        <TextTituloCardLine conteudo={'Proprietário:'} />
                        <TextTituloCardLine conteudo={'Operador/Motorista:'} />
                    </CardLineContentLeft>
                    <CardLineContentRight>
                        <TextConteudoCardLine conteudo={workEquipment.equipment.nameProprietary} />
                        <TextConteudoCardLine conteudo={workEquipment.operatorMotorist} />
                    </CardLineContentRight>
                </CardLineContent>
            </CardLine>
        )
    }

    if (type === InvoiceTypes.TRANSPORT_VEHICLE && item) {
        const transportVehicle = item as TransportVehicleDto
        return (
            <CardLine onPress={() => goBack()} opacity={0.7}>
                <ViewTituloCardLineSelected>
                    <TextTitlo>{`${transportVehicle.nameProprietary} ${transportVehicle.plate}`}</TextTitlo>
                    <ViewButtonCancel>
                        <FontAwesome name="close" size={20} color={'#fff'} />
                    </ViewButtonCancel>
                </ViewTituloCardLineSelected>
                <Line />
                <CardLineContent>
                    <CardLineContentLeft>
                        <TextTituloCardLine conteudo={'Proprietário:'} />
                        <TextTituloCardLine conteudo={'Motorista:'} />
                    </CardLineContentLeft>
                    <CardLineContentRight>
                        <TextConteudoCardLine conteudo={transportVehicle.nameProprietary} />
                        <TextConteudoCardLine conteudo={transportVehicle.motorist} />
                    </CardLineContentRight>
                </CardLineContent>
            </CardLine>
        )
    }
}

const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`

const ViewTituloCardLineSelected = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.selected};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
    justify-content: space-between;
`
const ViewButtonCancel = styled.View`
    height: 35px;
    margin: 5px;
    width: 35px;
    margin-right: 10px;
    background-color: red;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    border-color: #fff;
    border-width: 2px;
`
