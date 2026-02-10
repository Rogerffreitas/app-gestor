import { Alert, ToastAndroid } from "react-native";
import { MaterialServices } from "../../../../domin/services/interfaces/MaterialServices";
import { MaterialDto } from "../../../../domin/entity/material/MaterialDto";
import { useAuth } from "../../../../contexts/AuthContext";
import { Reference } from "../../../../types";
import { useState } from "react";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type EditMaterialPros = {
  materialServices: MaterialServices;
  material: MaterialDto;
  navigation: any;
};

export default function useEditMaterial({
  navigation,
  material,
  materialServices,
}: EditMaterialPros) {
  const [states, setStates] = useState({
    name: material.name,
    density: material.density,
    value: material.value,
    isLoading: false,
    volume:
      material.referenceMaterialCalculation === Reference.VOLUME ? true : false,
    weight:
      material.referenceMaterialCalculation === Reference.WEIGHT ? true : false,
    reference: Reference.VOLUME,
  });
  const [erros, setErros] = useState({
    name: "",
    density: "",
    value: "",
  });

  const { user } = useAuth();

  async function handleClickEditButton() {
    if (material.id == null) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));
      await materialServices.updateMaterialInLocalDatabase(
        StrictBuilder<MaterialDto>()
          .id(material.id)
          .serverId(material.serverId)
          .name(states.name)
          .density(+states.density)
          .value(states.value)
          .referenceMaterialCalculation(states.reference)
          .userId(user.id)
          .userAction(UserAction.UPDATE)
          .depositId(material.depositId)
          .enterpriseId(material.enterpriseId)
          .isValid(true)
          .build(),
        changeErrorFields
      );
      Alert.alert("Material Editado");
      successVibration();
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setStates((state) => ({ ...state, isLoading: false }));
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar atualizar o Material", "Menssagem: " + error);
      errorVibration();
    }
  }

  function onChange(name: any) {
    return (value: any) => {
      setStates((state) => ({ ...state, [name]: value }));
      setErros((state) => ({ ...state, [name]: null }));
    };
  }

  function changeErrorFields(name: string) {
    return (value: string) => {
      setErros((state) => ({ ...state, [name]: value }));
    };
  }

  async function handleClickDeleteButton() {
    if (material.id == null) {
      Alert.alert("Error");
      navigation.goBack();
    }
    await materialServices.deleteMaterialInLocalDatabase(material.id, user.id);
    Alert.alert("Material Apagado");
    navigation.goBack();
  }

  const showConfirmDialog = () => {
    return Alert.alert(
      "Deseja apagar o Material?",
      "Para confirmar pressione sim?",
      [
        {
          text: "SIM",
          onPress: () => {
            handleClickDeleteButton();
          },
        },

        {
          text: "NÃO",
        },
      ]
    );
  };

  return {
    states,
    erros,
    handleClickEditButton,
    showConfirmDialog,
    onChange,
  };
}
