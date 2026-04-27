import MaterialTransportDto from '@domin/entity/material-transport/MaterialTransportDto'

type UseTransportEditProps = {
    materialTransportDto: MaterialTransportDto
    materialTransportServices: any
    navigation: any
}

export default function useTransportsList({
    materialTransportDto,
    materialTransportServices,
    navigation,
}: UseTransportEditProps) {}
