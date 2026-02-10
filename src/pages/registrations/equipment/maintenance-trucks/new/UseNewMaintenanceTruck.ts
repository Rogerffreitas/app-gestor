import { useEffect, useState } from "react";
import WorkDto from "../../../../../domin/entity/work/WorkDto";
import { MaintenanceTruckServices } from "../../../../../domin/services/interfaces/MaintenanceTruckServices";
import { UserServices } from "../../../../../domin/services/interfaces/UserServices";
import { WorkEquipmentServices } from "../../../../../domin/services/interfaces/WorkEquipmentServices";
import WorkEquipmentDto from "../../../../../domin/entity/work-equipment/WorkEquipmentDto";
import { useAuth } from "../../../../../contexts/AuthContext";
import UserDto from "../../../../../domin/entity/user/UserDto";
import { UserAction, UserRoles } from "../../../../../types";
import {
  errorVibration,
  successVibration,
} from "../../../../../services/VibrationService";
import { Alert, ToastAndroid } from "react-native";
import { StrictBuilder } from "../../../../../services/StrictBuilder";
import { MaintenanceTruckDto } from "../../../../../domin/entity/maintenance-truck/MaintenanceTruckDto";

const response: UserDto[] = [
  {
    enterpriseId: "32249eac-45ac-4067-8500-96d535819056",
    id: "a0f48998-ec33-48d5-b2c4-235d17b81949",
    name: "Roger User",
    role: "USER",
    username: "roger.user",
  },
  {
    enterpriseId: "32249eac-45ac-4067-8500-96d535819056",
    id: "a0f48998-ec33-48d5-b2c4-235d17b81948",
    name: "Roger User2",
    role: "USER",
    username: "roger.user2",
  },
];

type UserSelectionList = {
  key: string;
  value: string;
};

type NewMaintenanceTruckProps = {
  maintenanceTruckServices: MaintenanceTruckServices;
  workEquipmentServices: WorkEquipmentServices;
  userServices: UserServices;
  ids: string[];
  work: WorkDto;
  navigation;
};
export default function useNewMaintenanceTrucks({
  navigation,
  work,
  ids,
  maintenanceTruckServices,
  workEquipmentServices,
  userServices,
}: NewMaintenanceTruckProps) {
  const [isLoad, setIsLoad] = useState(true);
  const [workEquipments, setWorkEquipments] = useState<WorkEquipmentDto[]>([]);
  const [workEquipment, setWorkEquipment] = useState<WorkEquipmentDto>();
  const [selectedWorkEquipment, setSelectedWorkEquipment] =
    useState<WorkEquipmentDto>();
  const [usersSelectList, setUsersSelectList] = useState<UserSelectionList[]>();
  const [bdUsers, setBDUsers] = useState<UserDto[]>([]);
  const [selected, setSelected] = useState([]);
  const [states, setStates] = useState({
    capacity: 0,
    usersList: "",
    sync: false,
    isLoading: false,
    isLoadingList: false,
  });
  const [errors, setErrors] = useState({
    usersList: "",
    capacity: "",
  });
  const { user } = useAuth();
  async function loadAll() {
    navigation.addListener("focus", () => setIsLoad(!isLoad));
    setStates((state) => ({ ...state, isLoadingList: true }));
    try {
      /*const response = await userServices.getAllRecordsByHttpRequest(
                {
                    baseURL: config.urlApi,
                    url: '/users',
                    params: { enterpriseId: user.enterpriseId },
                    token: token,
                },
                user.role
            )*/

      if (response.length == 0) {
        return;
      }
      let list: UserSelectionList[] = [];
      response.forEach((item) => {
        if (item.role != UserRoles.ADMIN) {
          list.push({ key: item.id, value: item.name });
        }
      });
      setBDUsers(response);
      setUsersSelectList(list);

      const allEquipemnts =
        await workEquipmentServices.loadAllWorkEquipmentByEnterpriseIdAndServerIdValidFromLocalDatabase(
          work.id,
          user.enterpriseId
        );
      let equipemnts: WorkEquipmentDto[] = [];
      allEquipemnts.forEach((item) => {
        const i = ids.findIndex((i) => i == item.id);
        if (i == -1 && !item.equipment.isEquipment) {
          equipemnts.push(item);
        }
      });
      setWorkEquipments(equipemnts);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao tentar carregar lista", error);
      errorVibration();
    } finally {
      setStates((state) => ({ ...state, isLoadingList: false }));
    }
  }

  useEffect(() => {
    loadAll();
  }, [isLoad]);

  async function handleSubmitButton() {
    try {
      setStates((state) => ({ ...state, isLoading: true }));

      const maintenanceTruckDto = StrictBuilder<MaintenanceTruckDto>()
        .capacity(states.capacity)
        .nameProprietary(workEquipment.equipment.nameProprietary)
        .operatorMotorist(workEquipment.operatorMotorist)
        .modelOrPlate(workEquipment.equipment.modelOrPlate)
        .usersList(states.usersList)
        .workEquipmentId(workEquipment.id)
        .workId(work.id)
        .serverId(0)
        .userId(user.id)
        .userAction(UserAction.CREATE)
        .enterpriseId(user.enterpriseId)
        .isValid(true)
        .build();
      const createdEntity =
        await maintenanceTruckServices.createMaintenanceTruckInLocalDatabase(
          maintenanceTruckDto,
          changeErrorFields
        );
      if (createdEntity) {
        successVibration();
        Alert.alert("Equipamento(s) Cadastrado(s) na obra");
        navigation.goBack();
      }
    } catch (error) {
      const { cause } = error;
      console.log(cause[0]);
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar criar cadastro", error);
      errorVibration();
    } finally {
      setStates((state) => ({ ...state, isLoading: false }));
    }
  }

  function changeErrorFields(name: string) {
    return (value: string) => {
      setErrors((state) => ({ ...state, [name]: value }));
    };
  }

  function onChange(name: any) {
    return (value: any) => {
      setStates((state) => ({ ...state, [name]: value }));
      setErrors((state) => ({ ...state, [name]: null }));
    };
  }
  function handleSelectionConfirmation() {
    setWorkEquipment(selectedWorkEquipment);
  }

  function onSelect() {
    let userId = "";
    setErrors((state) => ({ ...state, userList: null }));
    selected.forEach((item) => {
      bdUsers.forEach((user) => {
        if (user.id == item) {
          userId = userId + user.username + "-" + user.id + "-";
        }
      });
    });

    setStates((state) => ({ ...state, usersList: userId }));
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
    workEquipments,
    workEquipment,
    selectedWorkEquipment,
    errors,
    usersSelectList,
    onSelect,
    setWorkEquipment,
    setSelected,
    setStates,
    setSelectedWorkEquipment,
    handleSubmitButton,
    onChange,
    handleSelectionConfirmation,
  };
}
