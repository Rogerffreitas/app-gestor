import React from "react";
import Container from "../../../../components/Container";
import FormComponent from "../../../../components/form/FormTitleComponent";
import ButtonAction from "../../../../components/button/ButtonAction";
import { InputStyled } from "../../../../components/input/InputStyled";
import { StyleSheet, View } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DescriptionTextInput from "../../../../components/input/DescriptionTextInput";
import ButtonActionLoading from "../../../../components/button/ButtonActionLoading";
import CheckBox from "../../../../components/CheckBox";
import InputMaskNumber from "../../../../components/input/InputMaskNumber";
import InputMaskMoneyPrecision3 from "../../../../components/input/InputMaskMoneyPrecision3";
import useEditMaterial from "./UseEditMaterial";
import { Reference } from "../../../../types";

export default function EditMaterial({ navigation, route }) {
  const { material, materialServices } = route.params;
  const { states, erros, handleClickEditButton, showConfirmDialog, onChange } =
    useEditMaterial({
      navigation,
      materialServices,
      material,
    });

  return (
    <Container>
      <FormComponent nomeForm={material ? "Código : " + material.serverId : ""}>
        <DescriptionTextInput
          description={"Nome do Material:* "}
          erroMenssage={erros.name}
        />
        <InputStyled
          placeholder={"Nome do Material:"}
          autoCapitalize={"characters"}
          autoCorrect={false}
          secureTextEntry={false}
          value={states.name}
          onChangeText={(value) => {
            onChange("name")(value);
          }}
          keyboardType={"default"}
          autoFocus={true}
        />
        <DescriptionTextInput
          description={"Densidade (t/m³):* "}
          erroMenssage={erros.density}
        />

        <InputMaskNumber
          value={states.density / 100}
          placeholder={"Densidade (t/m³)"}
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={false}
          onChangeTextFunction={(value) => {
            onChange("density")(value.replace(/\./g, "").replace(",", ""));
          }}
          autoFocus={false}
          keyboardType={"numeric"}
        />

        <DescriptionTextInput
          description={"Valor (R$):* "}
          erroMenssage={erros.value}
        />
        <InputMaskMoneyPrecision3
          value={states.value / 1000}
          placeholder={"Valor"}
          autoCapitalize={"none"}
          autoCorrect={false}
          secureTextEntry={false}
          onChangeTextFunction={(value) => {
            onChange("value")(
              value.replace("R$ ", "").replace(/\./g, "").replace(",", "")
            );
          }}
          autoFocus={false}
          keyboardType={"numeric"}
        />

        <View style={styles.containerCheckbox}>
          <View>
            <CheckBox
              checked={states.volume}
              onPressFunction={() => {
                onChange("volume")(true);
                onChange("weight")(false);
                onChange("reference")(Reference.VOLUME);
              }}
              description={"Volume (m³)"}
            />
          </View>
          <View>
            <CheckBox
              checked={states.weight}
              onPressFunction={() => {
                onChange("volume")(false);
                onChange("weight")(true);
                onChange("reference")(Reference.WEIGHT);
              }}
              description={"Peso (t)"}
            />
          </View>
        </View>
        {!states.isLoading ? (
          <ButtonAction
            acao={"Salvar Edição"}
            onPressFunction={handleClickEditButton}
          />
        ) : (
          <ButtonActionLoading onPressFunction={() => {}} />
        )}

        <ViewButton>
          <ButtonEditar onPress={() => showConfirmDialog()}>
            <FontAwesome name={"trash"} size={20} style={{ color: "#fff" }} />
          </ButtonEditar>
        </ViewButton>
      </FormComponent>
    </Container>
  );
}

const ButtonEditar = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ViewButton = styled.View`
  width: 100%;
  border-radius: 5px;
  background-color: red;
  flex-direction: row;
  padding: 7px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const styles = StyleSheet.create({
  containerCheckbox: {
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    marginBottom: 10,
  },
});
