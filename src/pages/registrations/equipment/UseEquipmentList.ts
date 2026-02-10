import { useEffect, useRef, useState } from "react";
import WorkDto from "../../../domin/entity/work/WorkDto";
import { WorkServices } from "../../../domin/services/interfaces/WorkServices";
import { useAuth } from "../../../contexts/AuthContext";
import { MenuEquipmentType } from "../../../types";
import { EquipmentServices } from "../../../domin/services/interfaces/EquipmentServices";
import { errorVibration } from "../../../services/VibrationService";
import { Alert } from "react-native";
import { UserServices } from "../../../domin/services/interfaces/UserServices";
import { WorkEquipmentServices } from "../../../domin/services/interfaces/WorkEquipmentServices";
import { MaintenanceTruckServices } from "../../../domin/services/interfaces/MaintenanceTruckServices";
import EquipmentDto from "../../../domin/entity/equipment/EquipmentDto";

type EquipmentMenuOptionsProps = {
  workServices: WorkServices;
  equipmentServices: EquipmentServices;
  userServices: UserServices;
  workEquipmentServices: WorkEquipmentServices;
  maintenanceTruckServices: MaintenanceTruckServices;
  navigation: any;
};

export default function useEquipmentMenuOptions({
  navigation,
  workServices,
  equipmentServices,
  userServices,
  workEquipmentServices,
  maintenanceTruckServices,
}: EquipmentMenuOptionsProps) {
  const [works, setWorks] = useState<WorkDto[]>([]);
  const [work, setWork] = useState<WorkDto>(null);
  const { user } = useAuth();
  const [load, setLoad] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const animation = useRef(null);
  const [type, setType] = useState<MenuEquipmentType>(null);

  async function loadAllWorks() {
    navigation.setOptions({ title: "Equipamentos" });
    navigation.addListener("focus", () => setLoad(!load));
    try {
      const result = await workServices.loadWorkListFromDatabase(
        user.enterpriseId,
        "" + user.id,
        user.role
      );
      setWorks(result);
    } catch (error) {
      Alert.alert("Erro ao tentar buscar lista", "Menssagem: " + error);
      errorVibration();
    } finally {
      setIsLoadingList(false);
    }
  }

  useEffect(() => {
    loadAllWorks();
  }, [load]);

  function handleClickItemWorkList(item: WorkDto) {
    if (type == MenuEquipmentType.WORKS) {
      navigation.navigate("Work Equipment List", {
        work: item,
        equipmentServices: equipmentServices,
        workEquipmentServices: workEquipmentServices,
      });
    }
    if (type == MenuEquipmentType.MAINTENANCE_TRUCKS) {
      navigation.navigate("Maintenance trucks", {
        work: item,
        maintenanceTruckServices: maintenanceTruckServices,
        workEquipmentServices: workEquipmentServices,
        userServices: userServices,
      });
    }
  }

  function handleClickTypeList(type: MenuEquipmentType) {
    if (type == MenuEquipmentType.WORKS) {
      setType(type);
      navigation.setOptions({ title: "Escolha uma obra" });
    }
    if (type == MenuEquipmentType.EQUIPMENTS) {
      navigation.navigate("Equipments", {
        equipmentServices: equipmentServices,
      });
    }

    if (type == MenuEquipmentType.MAINTENANCE_TRUCKS) {
      setType(type);
      navigation.setOptions({ title: "Escolha uma obra" });
    }
  }

  return {
    works,
    work,
    isLoadingList,
    type,
    animation,
    handleClickTypeList,
    handleClickItemWorkList,
  };
}
