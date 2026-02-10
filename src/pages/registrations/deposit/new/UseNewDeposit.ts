import { useState } from "react";
import { DepositServices } from "../../../../domin/services/interfaces/DepositServices";
import DepositDto from "../../../../domin/entity/deposit/DepositDto";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { Alert, ToastAndroid } from "react-native";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type NewDepositProps = {
  depositServices: DepositServices;
  navigation: any;
};

export default function useNewDeposit({
  depositServices,
  navigation,
}: NewDepositProps) {
  const [states, setStates] = useState({
    name: "",
    description: "",
    isLoading: false,
    isSynchronizing: false,
  });
  const [erros, setErros] = useState({
    name: "",
    description: "",
  });
  const { user } = useAuth();

  async function handleSubmitButton() {
    //console.log(rota)
    if (user.id == null || user.enterpriseId == null) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));
      const response = await depositServices.createDepositInLocalDatabase(
        StrictBuilder<DepositDto>()
          .name(states.name)
          .description(states.description)
          .serverId(0)
          .userId(user.id)
          .userAction(UserAction.CREATE)
          .enterpriseId(user.enterpriseId)
          .isValid(true)
          .build(),
        changeErrorFields
      );

      if (response.id) {
        Alert.alert("Jazida cadastrada");
        //sincronizar()
        successVibration();
        navigation.goBack();
      }
    } catch (error) {
      console.log(error.mesage);
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

  return {
    states,
    erros,
    setErros,
    setStates,
    handleSubmitButton,
    onChange,
  };
}
