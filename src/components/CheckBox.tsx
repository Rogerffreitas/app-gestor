import React from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

export default function Checkbox({ checked, onPressFunction, description }) {
  return (
    <Content>
      <Description>{description}</Description>
      <CheckboxBase
        style={
          checked
            ? { backgroundColor: "#000080" }
            : { backgroundColor: "transparent" }
        }
        onPress={onPressFunction}
      >
        {checked && <Ionicons name="checkmark" size={20} color="white" />}
      </CheckboxBase>
    </Content>
  );
}

const Content = styled.View`
  margin-top: 10px;
  width: 95%;
  flex-direction: row;
`;

const Description = styled.Text`
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
`;

const CheckboxBase = styled.Pressable`
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-color: #b6293a;
  border-radius: 4px;
  border-width: 2px;
`;
