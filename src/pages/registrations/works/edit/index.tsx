import React from 'react'
import Container from '../../../../components/Container'
import FormComponent from '../../../../components/form/FormTitleComponent'
import ButtonAction from '../../../../components/button/ButtonAction'
import { InputStyled } from '../../../../components/input/InputStyled'
import styled from 'styled-components/native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import DescriptionTextInput from '../../../../components/input/DescriptionTextInput'
import ButtonActionLoading from '../../../../components/button/ButtonActionLoading'
import useEditWork from './UseEditWork'

export default function EditWork({ navigation, route }) {
    const { workServices, work } = route.params
    const { states, erros, showConfirmDialog, handleEditButtonPress, onChange } = useEditWork({
        navigation,
        work,
        workServices,
    })
    return (
        <Container>
            <FormComponent nomeForm={work.serverId ? 'Código: ' + work.serverId : work.name}>
                <DescriptionTextInput description={'Nome da Obra:* '} erroMenssage={erros.name} />
                <InputStyled
                    placeholder={'Nome da Obra'}
                    autoCapitalize={'characters'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    value={states.name}
                    onChangeText={(text) => {
                        onChange('name')(text)
                    }}
                    keyboardType={'default'}
                    autoFocus={true}
                />
                <DescriptionTextInput description={'Descrição da Obra:* '} erroMenssage={erros.description} />
                <InputStyled
                    placeholder={'Descrição da Obra:'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    value={states.description}
                    onChangeText={(value) => {
                        onChange('description')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={false}
                />
                <DescriptionTextInput description={'Número de estacas:* '} erroMenssage={erros.pickets} />
                <InputStyled
                    placeholder={'Número de estacas da obra'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry={false}
                    value={states.pickets + ''}
                    onChangeText={(value) => {
                        onChange('pickets')(value)
                    }}
                    keyboardType={'default'}
                    autoFocus={false}
                />
                {!states.isLoading ? (
                    <ButtonAction acao={'Salvar Edição'} onPressFunction={handleEditButtonPress} />
                ) : (
                    <ButtonActionLoading onPressFunction={() => {}} />
                )}
                <ViewButton>
                    <ButtonEditar onPress={() => showConfirmDialog()}>
                        <FontAwesome name={'trash'} size={20} style={{ color: '#fff' }} />
                    </ButtonEditar>
                </ViewButton>
            </FormComponent>
        </Container>
    )
}

const ButtonEditar = styled.TouchableOpacity`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`
const ViewButton = styled.View`
    width: 100%;
    border-radius: 5px;
    background-color: red;
    flex-direction: row;
    padding: 7px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`
