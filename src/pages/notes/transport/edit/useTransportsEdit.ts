import MaterialTransportDto from '../../../../domin/entity/material-transport/MaterialTransportDto'
import { MaterialTransportServices } from '../../../../domin/services/interfaces/MaterialTransportServices'

type UseTransportEditProps = {
    materialTransportDto: MaterialTransportDto
    materialTransportServices: MaterialTransportServices
    navigation: any
}

export default function useTransportsList({
    materialTransportDto,
    materialTransportServices,
    navigation,
}: UseTransportEditProps) {}
