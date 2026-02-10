import { useRef, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { EquipmentServices } from "../../../../domin/services/interfaces/EquipmentServices";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import EquipmentDto from "../../../../domin/entity/equipment/EquipmentDto";
import { UserAction } from "../../../../types";
import { Alert, ToastAndroid } from "react-native";

enum EquipmentOrVehicle {
  EQUIPMENT = "Máquina",
  VEHICLE = "Veículo",
}

type NewEquipmentPros = {
  equipmentServices: EquipmentServices;
  navigation: any;
};

export default function useNewEquipment({
  navigation,
  equipmentServices,
}: NewEquipmentPros) {
  const [states, setStates] = useState({
    proprietatyName: "",
    cpfCnpj: "",
    tel: "",
    startRental: "",
    monthlyPayment: 0,
    valuePerHourKm: 0,
    valuePerDay: 0,
    operatorMotorist: "",
    isEquipment: false,
    modelOrPlate: "",
    hourMeterOrOdometer: 0,
    isLoading: false,
    animation: useRef(null),
    sync: false,
    type: "",
  });

  const [erros, setErros] = useState({
    proprietatyName: "",
    cpfCnpj: "",
    tel: "",
    startRental: "",
    monthlyPayment: "",
    valuePerHourKm: "",
    valuePerDay: "",
    operatorMotorist: "",
    isEquipment: "",
    modelOrPlate: "",
    hourMeterOrOdometer: "",
  });
  const { user } = useAuth();

  async function handleSubmitButton() {
    if (user.id == null || user.enterpriseId == null) {
      errorVibration();
      Alert.alert("Error");
      navigation.goBack();
    }
    try {
      setStates((state) => ({ ...state, isLoading: true }));

      const equipament = StrictBuilder<EquipmentDto>()
        .nameProprietary(states.proprietatyName)
        .cpfCnpjProprietary(states.cpfCnpj)
        .telProprietary(states.tel)
        .startRental(states.startRental)
        .monthlyPayment(states.monthlyPayment)
        .valuePerDay(states.valuePerDay)
        .valuePerHourKm(states.valuePerHourKm)
        .hourMeterOrOdometer(states.hourMeterOrOdometer)
        .isEquipment(states.isEquipment)
        .modelOrPlate(states.modelOrPlate)
        .operatorMotorist(states.operatorMotorist)
        .serverId(0)
        .userId(user.id)
        .userAction(UserAction.CREATE)
        .enterpriseId(user.enterpriseId)
        .isValid(true)
        .build();

      const response = await equipmentServices.createEquipmentInLocalDatabase(
        equipament,
        changeErrorFields
      );

      if (response.id) {
        successVibration();
        //sincronizar()
        Alert.alert("Equipamento Cadastrado");
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
      Alert.alert("Erro ao tentar salvar o equipamento", error);
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

  function handleClickType(type: EquipmentOrVehicle) {
    if (type === EquipmentOrVehicle.EQUIPMENT) {
      setStates((states) => ({
        ...states,
        type: EquipmentOrVehicle.EQUIPMENT,
      }));
      setStates((states) => ({ ...states, isEquipment: true }));
    } else if (type === EquipmentOrVehicle.VEHICLE) {
      setStates((states) => ({ ...states, type: EquipmentOrVehicle.VEHICLE }));
      setStates((states) => ({ ...states, isEquipment: false }));
    }
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
    onChange,
    setErros,
    setStates,
    handleClickType,
    handleSubmitButton,
    EquipmentOrVehicle,
  };
}
