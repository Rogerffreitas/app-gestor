import React from 'react'
import { StyleSheet, View } from 'react-native'
import ButtonAction from '../../../../components/button/ButtonAction'
import FormComponent from '../../../../components/form/FormComponent'
import InputComponent from '../../../../components/input/InputComponent'
import Container from '../../../../components/Container'
import styled from 'styled-components/native'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import CheckBox from '../../../../components/CheckBox'
import InputMaskNumber from '../../../../components/input/InputMaskNumber'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import InputMaskMoneyPrecision3 from '../../../../components/input/InputMaskMoneyPrecision3'
import InputMask from '../../../../components/input/InputMask'
import { SelectList } from 'react-native-dropdown-select-list'
import useNewRoute from './UseNewRoute'

export default function NewRoute({ navigation, route }) {
    const { work, workRoutesServices, depositServices } = route.params

    const {
        depositsSelectedList,
        states,
        selected,
        setSelected,
        erros,
        handleButtonSubmit,
        onSelect,
        onChange,
    } = useNewRoute({ navigation, work, workRoutesServices, depositServices })

    return (
        <Container>
            <FormComponent>
                <Card>
                    <Title>CADASTRO DE ROTA</Title>
                    <Description>OBRA: {work.name}</Description>
                </Card>
                <DescriptionTextInput
                    description={'Local de Origem:* '}
                    erroMenssage={erros.arrivalLocation}
                />
                <View style={styles.multView}>
                    <SelectList
                        setSelected={(val) => setSelected(val)}
                        onSelect={onSelect}
                        data={depositsSelectedList}
                        save="key"
                        searchPlaceholder="Buscar"
                        placeholder="Selecione uma jazida"
                        notFoundText="vazio"
                        inputStyles={selected != null ? { color: '#000' } : { color: '#00000040' }}
                        boxStyles={{ borderRadius: 5, borderWidth: 0.9, borderColor: '#00000090' }}
                    />
                </View>
                <DescriptionTextInput
                    description={'Local de Destino:* '}
                    erroMenssage={erros.departureLocation}
                />
                <InputComponent
                    placeholder={'Local de Destino'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeTextFunction={(value) => {
                        onChange('departureLocation')(value)
                    }}
                    autoFocus={true}
                    keyboardType={'default'}
                />

                {erros.km || erros.initialPicket ? (
                    <View style={{ width: '100%' }}>
                        <ContentError>
                            <View style={{ flexDirection: 'row' }}>
                                <TextError>{erros.km}</TextError>
                                <TextError>{erros.initialPicket}</TextError>
                            </View>
                        </ContentError>
                    </View>
                ) : (
                    <></>
                )}

                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: '47%' }}>
                        <DescriptionTextInput description={'Distância em Km:* '} erroMenssage={null} />

                        <InputMaskNumber
                            value={null}
                            placeholder={'Distância em KM'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('km')(value.replace('R$ ', '').replace(/\./g, '').replace(',', ''))
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '47%' }}>
                        <DescriptionTextInput description={'Estaca de destino:* '} erroMenssage={null} />

                        <InputMask
                            value={null}
                            type={'only-numbers'}
                            mask={'defaults'}
                            placeholder={'Estaca de destino:'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('initialPicket')(value)
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                </View>
                <DescriptionTextInput description={'Valor:* '} erroMenssage={erros.value} />
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '60%' }}>
                        <InputMaskMoneyPrecision3
                            value={null}
                            placeholder={'Valor'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            secureTextEntry={false}
                            onChangeTextFunction={(value) => {
                                onChange('value')(
                                    value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                )
                            }}
                            autoFocus={false}
                            keyboardType={'numeric'}
                        />
                    </View>
                    <View style={{ width: '30%', marginLeft: 10 }}>
                        <CheckBox
                            checked={states.isFixedValue}
                            onPressFunction={() => {
                                onChange('isFixedValue')(!states.isFixedValue)
                            }}
                            description={'Valor fixo?'}
                        />
                    </View>
                </View>

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handleButtonSubmit} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}

const styles = StyleSheet.create({
    multView: {
        width: '100%',
        marginTop: 1,
    },
})

const Card = styled.TouchableOpacity`
    height: 50px;
    width: 100%;
    background-color: #fff;
    padding-bottom: 0px;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.menu};
    margin-bottom: 15px;
    border-radius: 10px;
`

const Title = styled.Text`
    width: 100%;
    font-size: 15px;
    color: #fff;
    font-weight: bold;
    margin-left: 8px;
    justify-content: center;
`

const Description = styled.Text`
    width: 100%;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin-left: 8px;
`

const TextError = styled.Text`
    color: red;
    font-size: 12px;
    font-weight: bold;
`

const ContentError = styled.View`
    width: 95%;
    justify-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`
