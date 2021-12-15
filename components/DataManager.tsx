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

  static addUser = async (userData) => {
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
      const responseStatus = await response.status;
      console.log("server response: " + responseStatus);
      return responseStatus;
    } catch (error) {
      console.log("error on add user:" + error);
    } finally {
      console.log("done with add user request");
    }
  };

  static updateUser = async (userData) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/person/update",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      const responseStatus = await response.status;
      console.log("server response: " + responseStatus);
      return responseStatus;
    } catch (error) {
      console.log("error on update user data:" + error);
    } finally {
      console.log("done with update user data request");
    }
  };

  static getUserStepCountOfToday = async (userid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/stepcount/findByPersonIdForToday?personId=" +
          userid,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const userStepCount = await response.json();
      console.log(userStepCount);
      return userStepCount.steps;
    } catch (error) {
      console.log("error on get user step count:" + error);
    } finally {
      console.log("done with get user step count request");
    }
  };

  static pushStepCountofToday = async (stepCountData) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/stepcount/push",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stepCountData),
        }
      );
      const responseStatus = await response.status;
      console.log("server response: " + responseStatus);
      return responseStatus;
    } catch (error) {
      console.log("error on push step count:" + error);
    } finally {
      console.log("done with push step count request");
    }
  };

  static updateStepCount = async (stepCountData) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/stepcount/update",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stepCountData),
        }
      );
      const responseStatus = await response.status;
      console.log("server response: " + responseStatus);
      return responseStatus;
    } catch (error) {
      console.log("error on update step count:" + error);
    } finally {
      console.log("done with update step count request");
    }
  };

  static getAllTeams = async () => {
    try {
      const response = await fetch(configJSON.serverConfig.root + "/team/all", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const allTeams = await response.json();
      return allTeams;
    } catch (error) {
      console.log("error on get all teams" + error);
    } finally {
      console.log("done with get all teams request");
    }
  };

  static addTeam = async (teamData) => {
    try {
      const response = await fetch(configJSON.serverConfig.root + "/team/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });
      const responseStatus = await response.status;
      console.log("server response: " + responseStatus);
      return responseStatus;
    } catch (error) {
      console.log("error on add team:" + error);
    } finally {
      console.log("done with add team request");
    }
  };

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
}
