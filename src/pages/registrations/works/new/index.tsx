import React from 'react'
import FormComponent from '../../../../components/form/FormTitleComponent'
import InputComponent from '../../../../components/input/InputComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import Container from '../../../../components/Container'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import styled from 'styled-components/native'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import useNewWork from './UseNewWork'
import { MultipleSelectList } from 'react-native-dropdown-select-list'

export default function CreateWork({ navigation, route }) {
    const { userServices, workServices } = route.params
    const { states, errors, usersSelectList, setSelected, onSelect, handlerSubmitButton, onChange } =
        useNewWork({
            navigation,
            workServices,
            userServices,
        })
    return (
        <Container>
            <FormComponent nomeForm="Cadastro de Nova obra">
                <DescriptionTextInput description={'Nome da obra:* '} erroMenssage={errors.name} />

                <InputComponent
                    placeholder={'Nome da Obra'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    keyboardType={'default'}
                    autoFocus={true}
                    onChangeTextFunction={(value) => {
                        onChange('name')(value)
                    }}
                />
                <DescriptionTextInput
                    description={'Descrição da obra:* '}
                    erroMenssage={errors.description}
                />
                <InputComponent
                    placeholder={'Descrição da obra'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    keyboardType={'default'}
                    autoFocus={false}
                    onChangeTextFunction={(value) => {
                        onChange('description')(value)
                    }}
                />
                <DescriptionTextInput description={'Número de estacas:* '} erroMenssage={errors.pickets} />
                <InputComponent
                    placeholder={'Número de estacas da obra'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    keyboardType={'numeric'}
                    autoFocus={false}
                    onChangeTextFunction={(value) => {
                        onChange('pickets')(value)
                    }}
                />
                <DescriptionTextInput description={'Apontador da Obra:* '} erroMenssage={errors.usersList} />
                <MultiListView>
                    <MultipleSelectList
                        data={usersSelectList}
                        setSelected={(val) => setSelected(val)}
                        onSelect={onSelect}
                        save="key"
                        label="Apontadores"
                        searchPlaceholder="Buscar"
                        placeholder={'Selecione um Usuário'}
                        notFoundText="vazio"
                        badgeStyles={{ backgroundColor: '#008', borderRadius: 5 }}
                        inputStyles={{ color: '#00000040' }}
                        boxStyles={{ borderRadius: 5, borderWidth: 0.9, borderColor: '#00000090' }}
                    />
                </MultiListView>

                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar'} onPressFunction={handlerSubmitButton} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
            </FormComponent>
        </Container>
    )
}

const MultiListView = styled.View`
    width: 100%;
`
