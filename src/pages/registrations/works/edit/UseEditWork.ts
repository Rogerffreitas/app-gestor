import { useState } from "react";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { Alert, ToastAndroid } from "react-native";
import { WorkServices } from "../../../../domin/services/interfaces/WorkServices";
import { useAuth } from "../../../../contexts/AuthContext";
import WorkDto from "../../../../domin/entity/work/WorkDto";
import { UserAction } from "../../../../types";

type UseCreateWorkProps = {
  navigation: any;
  workServices: WorkServices;
  work: WorkDto;
};

export default function useEditWork({
  navigation,
  work,
  workServices,
}: UseCreateWorkProps) {
  const [states, setStates] = useState({
    name: work.name,
    description: work.description,
    pickets: work.pickets,
    isLoading: false,
    sync: false,
  });

  const [erros, setErros] = useState({
    name: "",
    description: "",
    pickets: "",
    userList: "",
  });
  const { user } = useAuth();

  async function handleEditButtonPress() {
    if (work.id == null && !user) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      work.name = states.name;
      work.description = states.description;
      work.pickets = states.pickets;
      work.userId = user.id;
      work.userAction = UserAction.UPDATE;

      setStates((state) => ({ ...state, isLoading: true }));
      await workServices.updateWorkInLocalDatabase(work, changeErrorFields);
      Alert.alert("Obra Editada");
      successVibration();
      navigation.goBack();
    } catch (error) {
      setStates((state) => ({ ...state, isLoading: false }));
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar atualizar a obra", "Menssagem: " + error);
      errorVibration();
    }
  }

  async function _deletarObra() {
    if (work.id == null && !user) {
      Alert.alert("Error");
      navigation.goBack();
    }
    try {
      await workServices.deleteWorkInLocalDatabase(work.id, user.id);
      Alert.alert("Obra Apagada");
      successVibration();
      navigation.goBack();
    } catch (error) {
      if (error.message == "Não é possível apagar a obra") {
        Alert.alert(
          error.message,
          "Já existe(m) apontamento(s) para essa obra"
        );
      }
      console.log(error.message);
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

  const showConfirmDialog = () => {
    return Alert.alert(
      "Deseja apagar a Obra?",
      "Para confirmar pressione sim?",
      [
        {
          text: "SIM",
          onPress: () => {
            _deletarObra();
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
    handleEditButtonPress,
    showConfirmDialog,
    onChange,
  };
}
