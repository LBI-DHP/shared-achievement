import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import configJSON from "../config.json";

export default class dataManager {
  /*
   * Usage:
   *  import DataManager: import dataManager from "../components/DataManager"
   *  call getUserId (returns a promise): dataManager.getUserId()
   *
   * TODO:
   *  some more error handling
   */

  static getUserId = async () => {
    let id = await AsyncStorage.getItem("uuid");
    if (id == null) {
      console.log("generate UUID");
      id = uuid.v4().toString(); // something like '11edc52b-2918-4d71-9058-f7285e29d894'
      await AsyncStorage.setItem("uuid", id);
    }
    return id.toString();
  };

  static getUserData = async (userid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/person/find?id=" + userid,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.log("error on get user data:" + error);
    } finally {
      console.log("done with get user data request");
    }
  };
  setUserNameRequest = async (userData) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/person/add",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const ok = await response.status;
      console.log("server response: " + ok);
      //   setData([ok.toString()]);
    } catch (error) {
      console.log("error on set name:" + error);
    } finally {
      //   setLoading(false);
      console.log("done with set name request");
    }
  };
}

// const getTeamStepsRequest = async () => {
//   try {
//    const response = await fetch(configJSON.serverConfig.root + '/team/stepCountToday?name=' + userteam.toString(), {
//      method: 'GET',
//      headers: {
//        Accept: 'application/json',
//        'Content-Type': 'application/json'
//      }
//    });
//    const json = await response.json();
//    console.log("server response to team steps request: " + json.steps);
//    setTeamSteps(json.steps);
//   } catch (error) {
//     console.log("error on get team steps:" + error);
//   } finally {
//     setLoading(false);
//     console.log("done with get team steps request");
//   }
// }
