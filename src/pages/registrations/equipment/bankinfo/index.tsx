import React from 'react'
import { View } from 'react-native'
import Container from '../../../../components/Container'
import ButtonAction from '../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import FormComponent from '../../../../components/form/FormTitleComponent'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import { InputStyled } from '../../../../components/input/InputStyled'
import useBankInfo from './UseBankInfo'

export default function ({ navigation, route }) {
    const { equipmentId, bankInfo, equipmentServices } = route.params

    const { bankInformation, isLoading, handleClickEditButton, onChange } = useBankInfo({
        equipmentId,
        bankInfo,
        equipmentServices,
        navigation,
    })

    return (
        <Container>
            <FormComponent nomeForm={'Informações para pagamento'}>
                <DescriptionTextInput description={'Banco: '} erroMenssage={''} />
                <InputStyled
                    value={bankInformation.bank}
                    placeholder={'Nome do Banco'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('bank')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />
                <DescriptionTextInput description={'Beneficiado: '} erroMenssage={''} />
                <InputStyled
                    value={bankInformation.beneficiary}
                    placeholder={'Beneficiado da conta'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('beneficiary')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View style={{ width: '40%' }}>
                        <DescriptionTextInput description={'Agencia: '} erroMenssage={''} />
                        <InputStyled
                            value={bankInformation.agency}
                            placeholder={'Agencia'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                onChange('agency')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '55%', marginLeft: 17 }}>
                        <DescriptionTextInput description={'Operação/Conta: '} erroMenssage={''} />
                        <InputStyled
                            value={bankInformation.account}
                            placeholder={'Operação e conta'}
                            autoCapitalize={'characters'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeText={(value) => {
                                onChange('account')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <DescriptionTextInput description={'Chave Pix: '} erroMenssage={''} />
                <InputStyled
                    value={bankInformation.pix}
                    placeholder={'Chave Pix'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={(value) => {
                        onChange('pix')(value)
                    }}
                    autoFocus={false}
                    keyboardType={'default'}
                />

                {!isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handleClickEditButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}
