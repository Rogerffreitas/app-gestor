import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled, { useTheme } from "styled-components/native";

type ContainerProps = {
  children?: React.ReactNode | undefined;
};

export default function Container(props: ContainerProps) {
  return (
    <LinearGradient
      // Button Linear Gradient
      colors={["#009999", "#00999930", "#00999930", "#009999"]}
      style={{
        flex: 1,
      }}
    >
      <ContainerStyled>
        <StatusBar backgroundColor={"#000"}></StatusBar>
        {props.children}
      </ContainerStyled>
    </LinearGradient>
  );
}

const ContainerStyled = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;
