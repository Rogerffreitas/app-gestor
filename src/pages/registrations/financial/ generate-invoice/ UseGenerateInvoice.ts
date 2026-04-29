import { useState } from 'react'
import TransportVehicleDto from '@gestor/domain/entity/transport-vehicle/TransportVehicleDto'
import WorkEquipmentDto from '@gestor/domain/entity/work-equipment/WorkEquipmentDto'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList, ScreenNames } from '../../../../types'
import { InvoiceDto } from '@gestor/domain/entity/invoice/InvoiceDto'

type GenerateInvoiceProp = RouteProp<RootStackParamList, ScreenNames.GENERATE_INVOICE>

export default function useGenerateInvoice() {
    const route = useRoute<GenerateInvoiceProp>()
    const navigation = useNavigation()
    const { workId, type, transportVehicleOrWorkEquipment } = route.params

    const [states, setStates] = useState({
        isLoadingList: false,
        workEquipmentOrVehicle: null as WorkEquipmentDto | TransportVehicleDto,
        startDate: getDateFormatad(true, new Date().getTime()),
        endDate: getDateFormatad(false, new Date().getTime()),
        invoice: null as InvoiceDto,
    })

    function getDateFormatad(tipo: boolean, d: number) {
        const data = new Date(d)
        var dd = data.getDate()
        var mm = data.getMonth() + 1

        var dia = dd + ''
        var mes = mm + ''

        if (dd < 10) {
            dia = '0' + dd
        }
        if (mm < 10) {
            mes = '0' + mm
        }

        if (tipo) {
            return new Date(data.getFullYear() + '-' + mes + '-' + dia + ' ' + '00' + ':' + '00' + ':' + '00')
        } else {
            return new Date(data.getFullYear() + '-' + mes + '-' + dia + ' ' + '23' + ':' + '59' + ':' + '59')
        }
    }

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate
        //console.log('current: ' + currentDate)
        //console.log('time: ' + currentDate.getTime())
        setStates((state) => ({ ...state, startDate: getDateFormatad(true, currentDate) }))
    }

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate
        //console.log('current: ' + currentDate)
        //console.log('time: ' + currentDate.getTime())
        setStates((state) => ({ ...state, endDate: getDateFormatad(false, currentDate) }))
    }

    function showDataInicial() {
        DateTimePickerAndroid.open({
            value: states.startDate,
            onChange: onChangeStartDate,
            mode: 'date',
            is24Hour: true,
        })
    }

    function showDataFinal() {
        DateTimePickerAndroid.open({
            value: states.endDate,
            onChange: onChangeEndDate,
            mode: 'date',
            is24Hour: false,
        })
    }

    async function loadAll() {
        navigation.navigate(ScreenNames.NEW_INVOICE, {
            transportVehicleOrWorkEquipment: transportVehicleOrWorkEquipment,
            workId: workId,
            type: type,
            startDate: states.startDate.getTime(),
            endDate: states.endDate.getTime(),
        })
    }

    return {
        states,
        type,
        transportVehicleOrWorkEquipment,
        actions: {
            goBack: () => navigation.goBack(),
            onChangeStartDate,
            onChangeEndDate,
            showDataInicial,
            showDataFinal,
            loadAll,
        },
    }
}
