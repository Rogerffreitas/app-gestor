import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useConfig } from "../../../../contexts/ConfigContext";
import { Alert, ToastAndroid } from "react-native";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import { WorkServices } from "../../../../domin/services/interfaces/WorkServices";
import { UserServices } from "../../../../domin/services/interfaces/UserServices";
import WorkDto from "../../../../domin/entity/work/WorkDto";
import { UserRoles } from "../../../../types";
import UserDto from "../../../../domin/entity/user/UserDto";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { UserAction } from "../../../../types";

type UserSelectionList = {
  key: string;
  value: string;
};

type UseCreateWorkProps = {
  navigation: any;
  workServices: WorkServices;
  userServices: UserServices;
};

export default function useNewWork({
  navigation,
  workServices,
  userServices,
}: UseCreateWorkProps) {
  const [states, setStates] = useState({
    name: "",
    description: "",
    pickets: 0,
    usersList: "",
    isLoading: false,
    sync: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    pickets: "",
    usersList: "",
  });
  const [usersSelectList, setUsersSelectList] = useState<UserSelectionList[]>();
  const [bdUser, setBDUser] = useState<UserDto[]>([]);
  const [selected, setSelected] = useState([]);
  const { user, token } = useAuth();
  const config = useConfig();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
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

    let list: UserSelectionList[] = [];

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

      response.forEach((item) => {
        if (item.role != UserRoles.ADMIN) {
          list.push({ key: item.id, value: item.name });
        }
      });
      setBDUser(response);
      setUsersSelectList(list);
    } catch (error) {
      ToastAndroid.show("Erro a buscar usuários", ToastAndroid.LONG);
    }
  }
  async function handlerSubmitButton() {
    if (user.id == null || user.enterpriseId == null) {
      Alert.alert("Error");
      navigation.goBack();
    }

    try {
      setStates((state) => ({ ...state, isLoading: true }));

      const work = StrictBuilder<WorkDto>()
        .serverId(0)
        .name(states.name)
        .description(states.description)
        .pickets(states.pickets)
        .enterpriseId(user.enterpriseId)
        .userId(user.id)
        .userAction(UserAction.CREATE)
        .usersList(states.usersList)
        .isValid(true)
        .build();
      await workServices.createWorkInLocalDatabase(work, changeErrorFields);
      successVibration();
      Alert.alert("Obra Cadastrada");
      navigation.goBack();
    } catch (error) {
      if (error.message == "Entity validation failed") {
        errorVibration();
        ToastAndroid.show(
          "Preencha todos os campos obrigatórios",
          ToastAndroid.LONG
        );
        return;
      }
      Alert.alert("Erro ao tentar salvar a obra", "Menssagem: " + error);
      errorVibration();
    } finally {
      setStates((state) => ({ ...state, isLoading: false }));
    }
  }

  function onChange(name: any) {
    return (value: any) => {
      setStates((state) => ({ ...state, [name]: value }));
      setErrors((state) => ({ ...state, [name]: null }));
    };
  }

  function changeErrorFields(name: string) {
    return (value: string) => {
      setErrors((state) => ({ ...state, [name]: value }));
    };
  }

  function onSelect() {
    let userId = "";
    //setErros((state) => ({ ...state, userList: null }))
    selected.forEach((item) => {
      bdUser.forEach((user) => {
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
    errors,
    usersSelectList,
    selected,
    bdUser,
    setSelected,
    handlerSubmitButton,
    onSelect,
    onChange,
  };
}
