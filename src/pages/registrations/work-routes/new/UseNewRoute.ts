import { useEffect, useState } from "react";
import { WorkRoutesServices } from "../../../../domin/services/interfaces/WorkRoutesServices";
import { DepositServices } from "../../../../domin/services/interfaces/DepositServices";
import { StrictBuilder } from "../../../../services/StrictBuilder";
import { Alert, ToastAndroid } from "react-native";
import {
  errorVibration,
  successVibration,
} from "../../../../services/VibrationService";
import WorkDto from "../../../../domin/entity/work/WorkDto";
import DepositDto from "../../../../domin/entity/deposit/DepositDto";
import WorkRoutesDto from "../../../../domin/entity/work-routes/WorkRoutesDto";
import { UserAction } from "../../../../types";
import { useAuth } from "../../../../contexts/AuthContext";

type NewRouteProps = {
  workRoutesServices: WorkRoutesServices;
  depositServices: DepositServices;
  work: WorkDto;
  navigation: any;
};

export default function useNewRoute({
  navigation,
  work,
  workRoutesServices,
  depositServices,
}: NewRouteProps) {
  const [states, setStates] = useState({
    arrivalLocation: "",
    departureLocation: "",
    km: 0,
    initialPicket: 0,
    value: 0,
    isFixedValue: false,
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
  const [selected, setSelected] = useState<string>(null);
  const [depositsSelectedList, setDepositsSelectedList] = useState([]);
  const [deposits, setDeposits] = useState<DepositDto[]>([]);
  const [deposit, setDeposit] = useState<DepositDto>();

  async function getAllDeposits() {
    const result =
      await depositServices.loadAllDepositByEnterpriseIdFromLocalDatabase(
        user.enterpriseId
      );
    let deposits = [];
    result.forEach((item: DepositDto) => {
      deposits.push({ key: item.id, value: item.name });
    });
    setDepositsSelectedList(deposits);
    setDeposits(result);
  }

  useEffect(() => {
    getAllDeposits();
  }, []);

  async function handleButtonSubmit() {
    try {
      setStates((state) => ({ ...state, isLoading: true }));

      const workRoute = StrictBuilder<WorkRoutesDto>()
        .serverId(0)
        .arrivalLocation(states.arrivalLocation)
        .departureLocation(states.departureLocation)
        .km(states.km)
        .initialPicket(states.initialPicket)
        .value(states.value)
        .isFixedValue(states.isFixedValue)
        .work(work)
        .deposit(deposit)
        .userId(user.id)
        .userAction(UserAction.CREATE)
        .enterpriseId(user.enterpriseId)
        .isValid(true)
        .build();

      const result = await workRoutesServices.createWorkRoutesInLocalDatabase(
        workRoute,
        changeErrorFields
      );

      if (result.id) {
        Alert.alert("Rota Cadastrada");
        //sincronizar()
        successVibration();
        navigation.goBack();
      }
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
      Alert.alert("Erro ao tentar salvar a rota", "Menssagem: " + error);
      errorVibration();
    }
  }

  function changeErrorFields(name: string) {
    return (value: string) => {
      setErros((state) => ({ ...state, [name]: value }));
    };
  }

  function onChange(name: any) {
    return (value: any) => {
      setStates((state) => ({ ...state, [name]: value }));
      setErros((state) => ({ ...state, [name]: null }));
    };
  }

  function onSelect() {
    setDeposit(
      deposits.find((item) => {
        if (item.id === selected) {
          setStates((state) => ({ ...state, arrivalLocation: item.name }));
          return item;
        }
      })
    );
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
    depositsSelectedList,
    states,
    selected,
    erros,
    setSelected,
    handleButtonSubmit,
    onSelect,
    onChange,
  };
}
