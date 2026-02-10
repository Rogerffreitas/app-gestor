import { useState } from "react";
import { MaterialServices } from "../../../../domin/services/interfaces/MaterialServices";
import DepositDto from "../../../../domin/entity/deposit/DepositDto";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { Alert, ToastAndroid } from "react-native";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { MaterialDto } from "../../../../domin/entity/material/MaterialDto";
import { Reference } from "../../../../types";
import { UserAction } from "../../../../types";

type NewMaterialPros = {
  materialServices: MaterialServices;
  deposit: DepositDto;
  navigation: any;
};

export default function useNewMaterial({
  materialServices,
  deposit,
  navigation,
}: NewMaterialPros) {
  const [states, setStates] = useState({
    name: "",
    density: 0,
    value: 0,
    isLoading: false,
    syncState: false,
    volume: true,
    weight: false,
    reference: Reference.VOLUME,
  });
  const [erros, setErros] = useState({
    name: "",
    density: "",
    inflation: "",
    value: "",
  });

  const { user } = useAuth();

  async function handleSubmitButton() {
    if (user.id == null || user.enterpriseId == null || deposit.id == null) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));
      const response = await materialServices.createMaterialInLocalDatabase(
        StrictBuilder<MaterialDto>()
          .serverId(0)
          .name(states.name)
          .density(+states.density)
          .depositId(deposit.id)
          .referenceMaterialCalculation(states.reference)
          .value(+states.value)
          .enterpriseId(user.enterpriseId)
          .userId(user.id)
          .userAction(UserAction.CREATE)
          .isValid(true)
          .build(),
        changeErrorFields
      );
      if (response.id) {
        Alert.alert("Material Cadastrado");
        //sincronizar()
        successVibration();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar salvar o Material", "Menssagem: " + error);
      errorVibration();
    } finally {
      setStates((state) => ({ ...state, isLoading: false }));
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

  /*async function sincronizar() {
        setSyncState(true)
        ToastAndroid.show('Sincronizando dados', ToastAndroid.LONG)
        setTimeout(function () {
            sync(token, Config.urlApi, signOut)
                .then(() => {
                    setSyncState(false)

                    Config.lastConectionServer = Date.now()
                })
                .catch((err) => {
                    console.log('sync:' + err)
                    setSyncState(false)
                })
        }, 3000)
    }*/
  return { states, erros, handleSubmitButton, onChange };
}
