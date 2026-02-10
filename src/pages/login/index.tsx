import React from "react";
import ButtonAction from "../../components/button/ButtonAction";
import ForgotPasswordButton from "../../components/button/ForgotPasswordButton";
import FormComponent from "../../components/form/FormComponent";
import ButtonActionLoading from "../../components/button/ButtonActionLoading";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "react-native";
import theme from "../../global/styles/theme";
import { InputStyled } from "../../components/input/InputStyled";
import DescriptionTextInput from "../../components/input/DescriptionTextInput";
import useLogin from "./UseLogin";

export default function LoginScreen() {
  const {
    username,
    password,
    erroMsgUsername,
    erroMsgPassword,
    isLoading,
    handleSubmitButton,
    setUsername,
    setPassword,
    setErroMsgUsername,
    setErroMsgPassword,
  } = useLogin();

  return (
    <LinearGradient
      // Button Linear Gradient
      colors={["#009999", "#00999930", "#00999930", "#009999"]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container>
        <StatusBar backgroundColor={theme.colors.primary}></StatusBar>
        <FormComponent>
          <ImageIcon source={require("../../../assets/image/icon.png")} />
          <DescriptionTextInput
            description={"Usuário:* "}
            erroMenssage={erroMsgUsername}
          />
          <InputStyled
            placeholder={"Usuário"}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={username}
            secureTextEntry={false}
            onChangeText={(text) => {
              setUsername(text);
              setErroMsgUsername(null);
            }}
          />

          <DescriptionTextInput
            description={"Senha:* "}
            erroMenssage={erroMsgPassword}
          />

          <InputStyled
            placeholder={"Senha"}
            autoCapitalize={"none"}
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErroMsgPassword(null);
            }}
          />

          <ForgotPasswordButton />

          {!isLoading ? (
            <ButtonAction acao={"Login"} onPressFunction={handleSubmitButton} />
          ) : (
            <ButtonActionLoading onPressFunction={() => {}} />
          )}
        </FormComponent>
      </Container>
    </LinearGradient>
  );
}

const ImageIcon = styled.Image`
  height: 100px;
  width: 100px;
  margin-bottom: 15px;
`;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
