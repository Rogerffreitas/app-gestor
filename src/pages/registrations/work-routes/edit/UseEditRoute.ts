import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import WorkRoutesDto from "../../../../domin/entity/work-routes/WorkRoutesDto";
import { Alert, ToastAndroid } from "react-native";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import WorkDto from "../../../../domin/entity/work/WorkDto";
import { WorkRoutesServices } from "../../../../domin/services/interfaces/WorkRoutesServices";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type EditRouteProps = {
  workRoutesServices: WorkRoutesServices;
  workRoute: WorkRoutesDto;
  work: WorkDto;
  navigation: any;
};

export default function useEditRoute({
  navigation,
  workRoute,
  work,
  workRoutesServices,
}: EditRouteProps) {
  const [states, setStates] = useState({
    arrivalLocation: workRoute.arrivalLocation,
    departureLocation: workRoute.departureLocation,
    km: workRoute.km,
    initialPicket: workRoute.initialPicket,
    value: workRoute.value,
    isFixedValue: workRoute.isFixedValue,
    deposit: workRoute.deposit,
    isLoading: false,
    sync: false,
  });
  const [erros, setErros] = useState({
    arrivalLocation: "",
    departureLocation: "",
    km: "",
    initialPicket: "",
    value: "",
    isFixedValue: "",
  });
  const { user } = useAuth();

  async function handlerClickEditButton() {
    if (workRoute.id == null && !user) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));
      await workRoutesServices.updateWorkRoutesInLocalDatabase(
        StrictBuilder<WorkRoutesDto>()
          .serverId(0)
          .id(workRoute.id)
          .arrivalLocation(states.arrivalLocation)
          .departureLocation(states.departureLocation)
          .km(+states.km)
          .initialPicket(+states.initialPicket)
          .value(+states.value)
          .isFixedValue(states.isFixedValue)
          .work(work)
          .deposit(states.deposit)
          .userId(user.id)
          .userAction(UserAction.CREATE)
          .enterpriseId(user.enterpriseId)
          .isValid(true)
          .build(),
        changeErrorFields
      );
      Alert.alert("Rota Editada");
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
      Alert.alert("Erro ao tentar atualizar a rota", "Menssagem: " + error);
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
    if (workRoute.id == null) {
      Alert.alert("Error");
      errorVibration();
      navigation.goBack();
    }
    try {
      await workRoutesServices.deleteWorkRoutesInLocalDatabase(
        workRoute.id,
        user.id
      );
      Alert.alert("Rota Apagada");
      successVibration();
      navigation.goBack();
    } catch (err) {
      if (err.message == "Não é possível apagar a Rota") {
        Alert.alert(err.message, "Já existe(m) apontamento(s) para essa Rota");
      }
      console.log(err.message);
    }
  }
  const showConfirmDialog = () => {
    return Alert.alert(
      "Deseja apagar a Rota?",
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
    handlerClickEditButton,
    setStates,
    showConfirmDialog,
    onChange,
  };
}
