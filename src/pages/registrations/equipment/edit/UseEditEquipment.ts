import { useState } from "react";
import EquipmentDto from "../../../../domin/entity/equipment/EquipmentDto";
import { EquipmentServices } from "../../../../domin/services/interfaces/EquipmentServices";
import { useAuth } from "../../../../contexts/AuthContext";
import { Alert, ToastAndroid } from "react-native";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type EditEquipmentProps = {
  equipment: EquipmentDto;
  equipmentServices: EquipmentServices;
  navigation: any;
};

export default function UseEditEquipment({
  equipment,
  equipmentServices,
  navigation,
}: EditEquipmentProps) {
  const [states, setStates] = useState({
    proprietatyName: equipment.nameProprietary,
    cpfCnpj: equipment.cpfCnpjProprietary,
    tel: equipment.telProprietary,
    startRental: equipment.startRental,
    monthlyPayment: equipment.monthlyPayment,
    valuePerHourKm: equipment.valuePerHourKm,
    valuePerDay: equipment.valuePerDay,
    operatorMotorist: equipment.operatorMotorist,
    modelOrPlate: equipment.modelOrPlate,
    hourMeterOrOdometer: equipment.hourMeterOrOdometer,
    isLoading: false,
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

  async function handleEditButton() {
    if (equipment.id == null) {
      Alert.alert("Error");
      navigation.goBack();
    }

    /*if (!validate()) {
            errorVibration()
            return
        }*/
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
        .isEquipment(equipment.isEquipment)
        .modelOrPlate(states.modelOrPlate)
        .operatorMotorist(states.operatorMotorist)

        .serverId(equipment.serverId)
        .id(equipment.id)
        .userId(user.id)
        .userAction(UserAction.UPDATE)
        .enterpriseId(equipment.enterpriseId)
        .isValid(true)

        .build();

      await equipmentServices.updateEquipmentInLocalDatabase(
        equipament,
        changeErrorFields
      );
      Alert.alert("Equipamento editado");
      successVibration();
      navigation.goBack();
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
      errorVibration();
      Alert.alert("Erro ao tentar editar o equipamento: " + error);
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

  async function deleteEquipment() {
    if (equipment.id == null) {
      Alert.alert("Error");
      navigation.goBack();
    }

    try {
      await equipmentServices.deleteEquipmentInLocalDatabase(
        equipment.id,
        user.id
      );
      Alert.alert("Equipamento apagado");
      successVibration();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Não é possível apagar o Equipamento", error.message);
      console.log(error.message);
    }
  }

  const showConfirmDialog = () => {
    return Alert.alert(
      "Deseja apagar o equipamento?",
      "Para confirmar pressione sim?",
      [
        {
          text: "SIM",
          onPress: () => {
            deleteEquipment();
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
    onChange,
    showConfirmDialog,
    handleEditButton,
  };
}
