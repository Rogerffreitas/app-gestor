import React from 'react'
import Container from '../../../../../components/Container'
import Content from '../../../../../components/Content'
import { FlatList, TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native'
import CardLine from '../../../../../components/cardLine/CardLine'
import styled from 'styled-components/native'
import Linha from '../../../../../components/cardLine/Line'
import CardLineContentLeft from '../../../../../components/cardLine/CardLineContentLeft'
import TextTituloCardLine from '../../../../../components/cardLine/TextTituloCardLine'
import CardLineContent from '../../../../../components/cardLine/CardLineContent'
import CardLineContentRight from '../../../../../components/cardLine/CardLineContentRight'
import TextConteudoCardLine from '../../../../../components/cardLine/TextConteudoCardLine'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import theme from '../../../../../global/styles/theme'
import FormComponent from '../../../../../components/form/FormComponent'
import DescriptionTextInput from '../../../../../components/input/DescriptionTextInput'
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import ButtonAction from '../../../../../components/button/ButtonAction'
import ButtonActionLoading from '../../../../../components/button/ButtonActionLoading'
import useNewMaintenanceTrucks from './UseNewMaintenanceTruck'
import InputMaskNumber from '../../../../../components/input/InputMaskNumber'

export default function () {
    const { states, errors, actions } = useNewMaintenanceTrucks()
    if (states.isLoadingList) {
        return (
            <Container>
                <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#666" />
                </View>
            </Container>
        )
    }
    if (states.workEquipment == null) {
        return (
            <Container>
                <Content>
                    <FlatList
                        style={{
                            flex: 1,
                            width: '90%',
                        }}
                        data={states.workEquipments}
                        keyExtractor={(item) => {
                            return item.id
                        }}
                        renderItem={({ item }) => {
                            return (
                                <CardLine onPress={() => actions.selectWorkEquipment(item)} opacity={0.7}>
                                    <ViewTituloCardLine
                                        style={{
                                            backgroundColor:
                                                states.selectedWorkEquipment &&
                                                states.selectedWorkEquipment.id == item.id
                                                    ? '#ef6c00'
                                                    : '#000080',
                                        }}
                                    >
                                        <TextTitlo>{item.equipment.modelOrPlate}</TextTitlo>
                                    </ViewTituloCardLine>
                                    <Linha />
                                    <CardLineContent>
                                        <CardLineContentLeft>
                                            <TextTituloCardLine conteudo={'Proprietário:'} />
                                            <TextTituloCardLine conteudo={'Motorista:'} />
                                        </CardLineContentLeft>
                                        <CardLineContentRight>
                                            <TextConteudoCardLine conteudo={item.equipment.nameProprietary} />
                                            <TextConteudoCardLine conteudo={item.operatorMotorist} />
                                        </CardLineContentRight>
                                    </CardLineContent>
                                </CardLine>
                            )
                        }}
                    />
                    {!states.isLoading ? (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => actions.handleSelectionConfirmation()}
                            style={[styles.touchableOpacityStyle, { flexDirection: 'row' }]}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    marginHorizontal: 5,
                                }}
                            >
                                SALVAR
                            </Text>
                            <FontAwesome name="check" size={20} color={'#fff'} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {}}
                            style={[styles.touchableOpacityStyle, { flexDirection: 'row' }]}
                        >
                            <ActivityIndicator size="large" color="#fff" />
                        </TouchableOpacity>
                    )}
                </Content>
            </Container>
        )
    }

    if (states.workEquipment) {
        return (
            <Container>
                <Content>
                    <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                        <View style={{ width: '90%' }}>
                            <CardLine
                                onPress={() => {
                                    actions.clearValues()
                                }}
                                opacity={0.7}
                            >
                                <ViewTituloCardLine
                                    style={{
                                        backgroundColor: '#ef6c00',
                                    }}
                                >
                                    <TextTitlo>
                                        {states.selectedWorkEquipment.equipment.modelOrPlate}
                                    </TextTitlo>
                                    <ViewButtonCancel>
                                        <FontAwesome name="close" size={20} color={'#fff'} />
                                    </ViewButtonCancel>
                                </ViewTituloCardLine>
                                <Linha />
                                <CardLineContent>
                                    <CardLineContentLeft>
                                        <TextTituloCardLine conteudo={'Proprietário:'} />
                                        <TextTituloCardLine conteudo={'Motorista:'} />
                                    </CardLineContentLeft>
                                    <CardLineContentRight>
                                        <TextConteudoCardLine
                                            conteudo={states.selectedWorkEquipment.equipment.nameProprietary}
                                        />

                                        <TextConteudoCardLine
                                            conteudo={states.selectedWorkEquipment.operatorMotorist}
                                        />
                                    </CardLineContentRight>
                                </CardLineContent>
                            </CardLine>
                        </View>
                        <View style={{ marginTop: 10, width: '100%', alignItems: 'center' }}>
                            <FormComponent>
                                <DescriptionTextInput
                                    description={'Capacidade do tanque(L):* '}
                                    erroMenssage={errors.capacity}
                                />
                                <InputMaskNumber
                                    value={states.capacity}
                                    placeholder={'Capacidade'}
                                    autoCapitalize={'characters'}
                                    autoCorrect={false}
                                    secureTextEntry={false}
                                    onChangeTextFunction={(value) => {
                                        actions.onChange('capacity')(
                                            value.replace('R$ ', '').replace(/\./g, '').replace(',', '')
                                        )
                                    }}
                                    autoFocus={false}
                                    keyboardType={'numeric'}
                                />

                                <DescriptionTextInput
                                    description={'Responsável:* '}
                                    erroMenssage={errors.usersList}
                                />
                                <MultiListView>
                                    <MultipleSelectList
                                        setSelected={(val) => actions.setSelected(val)}
                                        data={states.usersSelectList}
                                        save="key"
                                        onSelect={() => actions.onSelect()}
                                        label="Apontadores"
                                        searchPlaceholder="Buscar"
                                        placeholder="Selecione um Usuário"
                                        notFoundText="vazio"
                                        badgeStyles={{ backgroundColor: '#008', borderRadius: 5 }}
                                        inputStyles={{ color: '#00000040' }}
                                        boxStyles={{
                                            borderRadius: 5,
                                            borderWidth: 0.9,
                                            borderColor: '#00000090',
                                        }}
                                    />
                                </MultiListView>
                                {!states.isLoading ? (
                                    <ButtonAction
                                        acao={'Salvar'}
                                        onPressFunction={actions.handleSubmitButton}
                                    />
                                ) : (
                                    <ButtonActionLoading onPressFunction={() => {}} />
                                )}
                            </FormComponent>
                        </View>
                    </View>
                </Content>
            </Container>
        )
    }
}

const ViewTituloCardLine = styled.View`
    width: 98%;
    background-color: ${(props) => props.theme.colors.menu};
    flex-direction: row;
    border-radius: 4px;
    margin: 4px;
    justify-content: space-between;
`
const TextTitlo = styled.Text`
    width: 75%;
    padding: 5px;
    font-size: 20px;
    color: #fff;
    font-weight: bold;
    margin: 5px;
`
const styles = StyleSheet.create({
    touchableOpacityStyle: {
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
        width: 120,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.btplus,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 55,
        position: 'absolute',
        bottom: 7,
    },
})

const MultiListView = styled.View`
    width: 100%;
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
