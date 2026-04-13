import FormComponent from '../../../../../components/form/FormTitleComponent'
import DescriptionTextInput from '../../../../../components/input/DescriptionTextInput'
import { InputStyled } from '../../../../../components/input/InputStyled'
import InputMaskNumber from '../../../../../components/input/InputMaskNumber'
import ButtonAction from '../../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../../components/button/ButtonActionLoading'
import CheckBox from '../../../../../components/CheckBox'
import { FuelSupplyTypes } from '../../../../../types'
import InputMaskNumber2 from '../../../../../components/input/InputMaskNumber2'

type FormType = {
    quantity: number
    valuePerLiter: number
    description: string
    observation: string
    isGasStation: boolean
    hourMeterOrKmMeter: number
    isDiscount: boolean
}

type Erros = {
    quantity: string
    valuePerLiter: string
    hourMeterOrKmMeter: string
    description: string
}

type FormProp = {
    type: FuelSupplyTypes
    navigation: any
    form: FormType
    erros: Erros
    isLoading: boolean
    onChange: (name: any) => (value: any) => void
    handlerClickButtonSubmit: () => void
}

export default function ({ type, form, erros, isLoading, onChange, handlerClickButtonSubmit }: FormProp) {
    return (
        <FormComponent nomeForm="Cadastro de Abastecimento">
            <DescriptionTextInput description={'Descrição:* '} erroMenssage={erros.description} />
            <InputStyled
                value={form.description}
                placeholder={'Descrição'}
                autoCapitalize={'characters'}
                autoCorrect={false}
                secureTextEntry={false}
                onChangeText={(value) => {
                    onChange('description')(value)
                }}
                autoFocus={false}
                keyboardType={'default'}
            />

            <DescriptionTextInput description={'Quantidade:* '} erroMenssage={erros.quantity} />
            <InputMaskNumber
                value={form.quantity ? form.quantity / 100 : null}
                placeholder={'Quantidade'}
                autoCapitalize={'none'}
                autoCorrect={false}
                secureTextEntry={false}
                onChangeTextFunction={(value) => {
                    onChange('quantity')(+value.replace('R$ ', '').replace(/\./g, '').replace(',', ''))
                }}
                autoFocus={true}
                keyboardType={'numeric'}
            />

            <DescriptionTextInput
                description={type === FuelSupplyTypes.EQUIPMENT ? 'Horimentro:* ' : 'Odometro:* '}
                erroMenssage={erros.hourMeterOrKmMeter}
            />
            <InputMaskNumber2
                value={form.hourMeterOrKmMeter ? form.hourMeterOrKmMeter / 10 : null}
                placeholder={'Horimentro/km'}
                autoCapitalize={'none'}
                autoCorrect={false}
                secureTextEntry={false}
                onChangeTextFunction={(value) => {
                    onChange('hourMeterOrKmMeter')(
                        +value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                    )
                }}
                autoFocus={false}
                keyboardType={'numeric'}
            />

            <DescriptionTextInput description={'Observação:'} erroMenssage={''} />
            <InputStyled
                value={form.observation}
                placeholder={'observação'}
                autoCapitalize={'characters'}
                autoCorrect={false}
                secureTextEntry={false}
                onChangeText={(value) => {
                    onChange('observation')(value)
                }}
                autoFocus={false}
                keyboardType={'default'}
            />
            {type === FuelSupplyTypes.TRANSPORT_VEHICLE && (
                <CheckBox
                    checked={form.isDiscount}
                    onPressFunction={() => onChange('isDiscount')(!form.isDiscount)}
                    description={'Descontar na fatura?'}
                />
            )}
            {!isLoading ? (
                <ButtonAction acao={'Salvar'} onPressFunction={handlerClickButtonSubmit} />
            ) : (
                <ButtonActionLoading onPressFunction={() => {}} />
            )}
        </FormComponent>
    )
}
