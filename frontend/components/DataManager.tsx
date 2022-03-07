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

  static mapResponseUserDataToUserData = async (responseUserData) => {
    if (!responseUserData.password) {
      responseUserData.password = await this.getUserPassword();
    }
    return {
      id: responseUserData.id,
      username: responseUserData.username,
      team: responseUserData.team,
      expoToken: responseUserData.expoToken,
      password: responseUserData.password,
    };
  };

  static getGoogleAuthInfo = async () => {
    try {
      let authInfo = await AsyncStorage.getItem("authInfo");
      return authInfo != null ? JSON.parse(authInfo) : null;
    } catch (e) {
      console.log("error on get google auth info: ", e);
    }
  };

  static setGoogleAuthInfo = async (authInfo) => {
    try {
      await AsyncStorage.setItem("authInfo", JSON.stringify(authInfo));
    } catch (e) {
      console.log("error on set google auth info: ", e);
    }
  };

  static deleteGoogleAuthInfo = async () => {
    try {
      await AsyncStorage.removeItem("authInfo");
    } catch (e) {
      console.log("error on delete google auth info: ", e);
    }
  };

  static getUserId = async () => {
    let id = await AsyncStorage.getItem("id");
    console.log("userID", id);
    return id;
  };

  static setUserId = async (id) => {
    try {
      await AsyncStorage.setItem("id", id.toString());
    } catch (e) {
      console.log(e);
    } finally {
      console.log("User ID (", id, ") was set in local storage");
    }
  };

  static getUserPassword = async () => {
    let password = null;
    try {
      password = await AsyncStorage.getItem("uuid");
      if (password == null) {
        console.log("generate password");
        password = uuid.v4().toString(); // something like '11edc52b-2918-4d71-9058-f7285e29d894'
        await AsyncStorage.setItem("password", password);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Password was set/retrieved from local storage");
    }
    return password.toString();
  };

  static getUserDataOld = async (userid) => {
    fetch(configJSON.serverConfig.root + "/api/user/" + userid, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("response not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (result.stat === "fail") {
          throw new Error(result.message);
        }
        // Everything should be ok, process the result here
        return result;
        // this.mapResponseUserDataToUserData(result).then((d) => {
        //   return d;
        // });
      })
      .catch(function (e) {
        console.log(e);
        return null;
      });
    // .finally(() => console.log("done with get user data request"));
  };

  static getUserData = async (userid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/api/user/" + userid,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          return await this.mapResponseUserDataToUserData(responseJSON);
        }
      }
      return null;
    } catch (error) {
      console.log("error on get user data:" + error);
    } finally {
      console.log("done with get user request");
    }
  };

  static registerUser = async (userData) => {
    console.log("userData for register", userData);
    try {
      const response = await fetch(configJSON.serverConfig.root + "/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("response ok");
        const contentType = await response.headers.get("content-type");
        console.log(contentType);
        // if (contentType && contentType.indexOf("application/json") !== -1) {
        // console.log("contentType ok");
        const responseJSON = await response.json();
        console.log("responseJSON", responseJSON);
        if (responseJSON && responseJSON.id) {
          this.setUserId(responseJSON.id);
        }
        console.log("responseJSON", responseJSON);
        return await this.mapResponseUserDataToUserData(responseJSON);
        // }
      }
      return null;
    } catch (error) {
      console.log("error on register user:" + error);
    } finally {
      console.log("done with register user request");
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

  static getTeamStepCountToday = async (teamName) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/team/stepCountToday?name=" +
          teamName.toString(),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const stepCount = await response.json();
      return stepCount.steps;
    } catch (error) {
      console.log("error on get team step count:" + error);
    } finally {
      console.log("done with get team step count request");
    }
  };

  static getRelativeTeamStepCountOfToday = async (teamName) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/team/relativeStepCountOfTeamTodayOfChallengeInPercent?name=" +
          teamName.toString(),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const relativeSteps = await response.json();
      return relativeSteps.relativeSteps;
    } catch (error) {
      console.log("error on get team step count:" + error);
    } finally {
      console.log("done with get team step count request");
    }
  };
  static getTeamMembersStepCountOfToday = async (teamName) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/team/teamMembersStepCountOfToday?name=" +
          teamName.toString(),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const teamMembersStepCountOfToday = await response.json();
      return teamMembersStepCountOfToday;
    } catch (error) {
      console.log("error on get all teams" + error);
    } finally {
      console.log("done with get all teams request");
    }
  };
}
