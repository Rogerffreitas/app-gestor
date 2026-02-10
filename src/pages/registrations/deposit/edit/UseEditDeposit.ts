import { useState } from "react";
import { DepositServices } from "../../../../domin/services/interfaces/DepositServices";
import DepositDto from "../../../../domin/entity/deposit/DepositDto";
import { useAuth } from "../../../../contexts/AuthContext";
import { Alert, ToastAndroid } from "react-native";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type EditDepositProps = {
  depositServices: DepositServices;
  deposit: DepositDto;
  navigation: any;
};

export default function useEditDeposit({
  deposit,
  depositServices,
  navigation,
}: EditDepositProps) {
  const [states, setStates] = useState({
    name: deposit.name,
    description: deposit.description,
    isLoading: false,
    isSynchronizing: false,
  });
  const [erros, setErros] = useState({
    name: "",
    description: "",
  });

  const { user } = useAuth();

  async function handleSubmitButton() {
    if (deposit.id == null) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));
      await depositServices.updateDepositInLocalDatabase(
        StrictBuilder<DepositDto>()
          .name(states.name)
          .description(states.description)
          .id(deposit.id)
          .serverId(deposit.serverId)
          .userId(user.id)
          .userAction(UserAction.UPDATE)
          .enterpriseId(deposit.enterpriseId)
          .isValid(deposit.isValid)
          .build(),
        changeErrorFields
      );

      Alert.alert("Jazida editada");
      //sincronizar()
      successVibration();
      navigation.goBack();
    } catch (error) {
      console.log(error.mesage);
      setStates((state) => ({ ...state, isLoading: false }));
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar salvar a Jazida", "Menssagem: " + error);
      errorVibration();
    }
  }

  async function hadleClickDeleteButton() {
    if (deposit.id == null) {
      Alert.alert("Error");
      navigation.goBack();
    }
    await depositServices.deleteDepositInLocalDatabase(deposit.id, user.id);
    Alert.alert("Jazida apagada!");
    navigation.goBack();
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

  const showConfirmDialog = () => {
    return Alert.alert(
      "Deseja apagar a Jazida?",
      "Para confirmar pressione sim?",
      [
        {
          text: "SIM",
          onPress: () => {
            hadleClickDeleteButton();
          },
        },

        {
          text: "NÃO",
        },
      ]
    );
  };

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

  return {
    states,
    erros,
    setStates,
    handleSubmitButton,
    showConfirmDialog,
    onChange,
  };
}
