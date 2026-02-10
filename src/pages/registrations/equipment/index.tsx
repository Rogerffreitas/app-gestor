import React from "react";
import { ActivityIndicator, FlatList, View, Image } from "react-native";
import Container from "../../../components/Container";
import styled from "styled-components/native";
import ItemObra from "../../../components/List/ItemObra";
import ListaVazia from "../../../components/List/ListaVazia";
import Content from "../../../components/Content";
import LottieView from "lottie-react-native";
import useEquipmentMenuOptions from "./UseEquipmentList";
import { MenuEquipmentType } from "../../../types";

export default function EquipmentMenuOptions({ navigation, route }) {
  const {
    workServices,
    equipmentServices,
    userServices,
    workEquipmentServices,
    maintenanceTruckServices,
  } = route.params;
  const {
    works,
    type,
    isLoadingList,
    animation,
    handleClickTypeList,
    handleClickItemWorkList,
  } = useEquipmentMenuOptions({
    navigation,
    workServices,
    equipmentServices,
    userServices,
    workEquipmentServices,
    maintenanceTruckServices,
  });

  if (isLoadingList) {
    return (
      <Container>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#666" />
        </View>
      </Container>
    );
  }

  if (!type) {
    return (
      <Container>
        <View style={{ width: "100%" }}>
          <ButtonStyled
            style={{ backgroundColor: "#000080" }}
            onPress={() => handleClickTypeList(MenuEquipmentType.EQUIPMENTS)}
          >
            <ImageStyled>
              <Image
                source={require("../../../assets/maquina.png")}
                style={{ height: 35, width: 92 }}
              />
            </ImageStyled>
            <TextContent>
              <TextContent>EQUIPAMENTOS</TextContent>
            </TextContent>
          </ButtonStyled>
          <ButtonStyled
            style={{ backgroundColor: "#000080" }}
            onPress={() => handleClickTypeList(MenuEquipmentType.WORKS)}
          >
            <ImageStyled>
              <LottieView
                autoPlay
                ref={animation}
                style={{ width: 80, height: 80 }}
                source={require("../../../assets/obra.json")}
              />
            </ImageStyled>
            <TextContent>
              <TextContent>ADICIONAR EQUIPAMENTOS A OBRA</TextContent>
            </TextContent>
          </ButtonStyled>
          <ButtonStyled
            style={{ backgroundColor: "#000080" }}
            onPress={() =>
              handleClickTypeList(MenuEquipmentType.MAINTENANCE_TRUCKS)
            }
          >
            <ImageStyled>
              <Image
                source={require("../../../assets/melosa.png")}
                style={{ height: 40, width: 70 }}
              />
            </ImageStyled>
            <TextContent>
              <TextContent>CADASTRAR MELOSA</TextContent>
            </TextContent>
          </ButtonStyled>
        </View>
      </Container>
    );
  }

  if (type && works.length == 0) {
    return (
      <Container>
        <Content>
          <ListaVazia />
        </Content>
      </Container>
    );
  }

  if (type && works.length > 0) {
    return (
      <Container>
        <FlatList
          style={{
            flex: 1,
            width: "100%",
          }}
          data={works}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => {
            return (
              <ItemObra
                active={0.2}
                onPress={() => {
                  handleClickItemWorkList(item);
                }}
                titulo={item.name}
                descricao={item.description}
              />
            );
          }}
        />
      </Container>
    );
  }
}

const TextContent = styled.Text`
  font-size: 20px;
  flex: 1;
  align-self: center;
  margin-top: 10px;
  color: ${(props) => props.theme.fontColors.primary};
  font-weight: bold;
`;

const ButtonStyled = styled.TouchableOpacity`
  height: 120px;
  align-items: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  background-color: ${(props) => props.theme.colors.menu};
  padding: 5px;
  flex-direction: column;
  border-radius: 10px;
`;

const ImageStyled = styled.View`
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
`;
