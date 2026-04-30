import MaterialTransportDto from '@gestor/domain/entity/material-transport/MaterialTransportDto'

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
