import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../database";
import Token from "../interfaces/Token";
import axios from "axios";

import { Alert } from "react-native";

export async function sync(token: Token, url: string, signOut) {
  let latestVersionOfSession = 0;

  await synchronize({
    database,
    sendCreatedAsUpdated: true,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      console.log("Last Pull: " + lastPulledAt);
      try {
        const urlParams =
          "last_pulled_at=" +
          lastPulledAt +
          "&schema_version=" +
          schemaVersion +
          "&migration=" +
          encodeURIComponent(JSON.stringify(migration));
        //console.log(token)
        //console.log(url)

        const response = await axios.get(url + "/syncs" + "?" + urlParams, {
          headers: {
            Authorization: token ? `Bearer ${token.token}` : "",
          },
        });

        if (response.status == 200) {
          console.log(response.data);
          const { changes, latestVersion } = await response.data;

          latestVersionOfSession = latestVersion;

          return { changes, timestamp: latestVersion };
        }
      } catch (err) {
        console.log(err.message);
        if (err.response.status == 401) {
          console.log(err.response.status);
          Alert.alert("Faça login novamente", "", [
            {
              text: "Sair",
              onPress: () => {
                signOut();
                Alert.alert("Você está desconectado");
              },
              style: "default",
            },
          ]);
        }
        throw Error("Error pulling data: " + err.message);
      }
    },

    pushChanges: async ({ changes, lastPulledAt }) => {
      console.log("push latestVersion: " + lastPulledAt);

      try {
        const response = await axios.post(
          url + "/syncs" + "?last_pulled_at=" + lastPulledAt,
          {
            changes,
          },

          {
            headers: {
              Authorization: token ? `Bearer ${token.token}` : "",
            },
          }
        );

        const {
          latestVersion,
          transportes,
          abastecimentos,
          descontos,
          materiais,
          obras,
          rotas,
          veiculos,
          equipamentos,
          horimetros,
          melosas,
          obra_equipamentos,
          jazidas,
        } = await response.data;
      } catch (err) {
        if (err.response.status == 401) {
          Alert.alert("Faça login novamente", "", [
            {
              text: "Sair",
              onPress: () => {
                signOut();
                Alert.alert("Você está desconectado");
              },
              style: "default",
            },
          ]);
        }
        throw Error("Error pushing data: " + err.message);
      }
    },
    migrationsEnabledAtVersion: 1,
  });
}
