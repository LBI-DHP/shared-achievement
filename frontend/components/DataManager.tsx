import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import configJSON from "../config.json";
import base64 from "react-native-base64";

export default class dataManager {
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
      targetGoal: responseUserData.targetGoal,
      showDeveloperSettings: responseUserData.showDeveloperSettings,
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

  static setUseGoogleFit = async (useGoogleFit) => {
    try {
      await AsyncStorage.setItem("useGoogleFit", useGoogleFit.toString());
    } catch (e) {
      console.log(e);
    } finally {
      console.log("Use Google Fit ", useGoogleFit, " was set in local storage");
    }
  };

  static getUseGoogleFit = async () => {
    let useGoogleFit = await AsyncStorage.getItem("useGoogleFit");
    console.log("useGoogleFit", useGoogleFit);
    return useGoogleFit === "true";
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

  static getShowReachedSummitPopUp = async () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dateStringToday = date + "." + month + "." + year;

    let datePopUpLastSeen = await AsyncStorage.getItem(
      "dateShowReachedSummitPopUpLastSeen"
    );

    if (!datePopUpLastSeen) {
      this.setShowReachedSummitPopUp(dateStringToday);
      return true;
    } else if (datePopUpLastSeen === dateStringToday) {
      return false;
    } else {
      this.setShowReachedSummitPopUp(dateStringToday);
      return true;
    }
  };

  static setShowReachedSummitPopUp = async (dateString) => {
    try {
      await AsyncStorage.setItem(
        "dateShowReachedSummitPopUpLastSeen",
        dateString
      );
    } catch (e) {
      console.log(e);
    }
  };

  static getShowYesterdaysProgressPopUp = async () => {
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dateStringToday = date + "." + month + "." + year;

    let datePopUpLastSeen = await AsyncStorage.getItem(
      "dateShowYesterdaysProgressPopUpLastSeen"
    );

    if (!datePopUpLastSeen) {
      this.setShowYesterdaysProgressPopUp(dateStringToday);
      return true;
    } else if (datePopUpLastSeen === dateStringToday) {
      return false;
    } else {
      this.setShowYesterdaysProgressPopUp(dateStringToday);
      return true;
    }
  };

  static setShowYesterdaysProgressPopUp = async (dateString) => {
    try {
      await AsyncStorage.setItem(
        "dateShowYesterdaysProgressPopUpLastSeen",
        dateString
      );
    } catch (e) {
      console.log(e);
    }
  };

  static getUserData = async (userid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/api/user/" + userid + "/",
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
      return -1;
    } finally {
      console.log("done with get user request");
    }
  };

  static registerUser = async (userData) => {
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
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          if (responseJSON && responseJSON.id) {
            this.setUserId(responseJSON.id);
          }
          return await this.mapResponseUserDataToUserData(responseJSON);
        }
      }
      if (response.status === 409) return -2;
      return null;
    } catch (error) {
      console.log("error on register user:" + error);
      return -1;
    } finally {
      console.log("done with register user request");
    }
  };

  static updateUserData = async (userData) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/api/user/" + userData.id + "/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + base64.encode("admin" + ":" + "admin"),
            // base64.encode(userData.username + ":" + userData.password),
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        console.log("response ok");
        const contentType = await response.headers.get("content-type");
        console.log(contentType);
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          console.log("responseJSON", responseJSON);
          if (responseJSON && responseJSON.id) {
            this.setUserId(responseJSON.id);
          }
          console.log("responseJSON", responseJSON);
          return await this.mapResponseUserDataToUserData(responseJSON);
        }
      }
      return null;
    } catch (error) {
      console.log("error on update user:" + error);
      return -1;
    } finally {
      console.log("done with update user request");
    }
  };

  static getUserChallengeData = async (id) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/challenge/user/" + id,
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
          return responseJSON;
        }
      }
      return null;
    } catch (error) {
      console.log("error on get user step count data:" + error);
    } finally {
      console.log("done with get team step count request");
    }
  };

  static pushSteps = async (userid, newSteps) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/push_steps",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userid,
            steps: newSteps,
          }),
        }
      );

      if (response.ok) {
        console.log("response ok");
        const contentType = await response.headers.get("content-type");
        console.log(contentType);
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.log("error on push new steps:" + error);
    } finally {
      console.log("done with push new steps request");
    }
  };

  static getAllTeams = async () => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/api/team/",
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
          if (responseJSON.objects !== undefined) return responseJSON.objects;
        }
      }
      return null;
    } catch (error) {
      console.log("error on get all teams:" + error);
      return -1;
    } finally {
      console.log("done with get all teams request");
    }
  };

  static getTeamMembersAndStepCountOfToday = async (teamid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/teamstepstoday/" + teamid,
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
          return responseJSON;
        }
      }
      return null;
    } catch (error) {
      console.log("error on get team members and steps:" + error);
    } finally {
      console.log("done with get team members and steps request");
    }
  };

  static getTeamData = async (teamid) => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root + "/api/team/" + teamid + "/",
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
          return responseJSON;
        }
      }
      return null;
    } catch (error) {
      console.log("error on get team name:" + error);
    } finally {
      console.log("done with get team name request");
    }
  };
  static getTeamChallengeData = async (teamid, date = "") => {
    let completeRequestString = teamid;
    if (date.length !== 0) completeRequestString += "?date=" + date;

    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/challenge/team/" +
          completeRequestString,
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
          return responseJSON;
        }
      } else if (response.status === 400) {
        return -1;
      }
      return null;
    } catch (error) {
      console.log("error on get team name:" + error);
    } finally {
      console.log("done with get team name request");
    }
  };

  static sendPushNotification = async (expoToken, message, from) => {
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoToken,
          title: "New message from " + from,
          body: message,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          if (responseJSON.data.status === "ok") {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.log("error on send push message:" + error);
    } finally {
      console.log("done with send push message request");
    }
  };
}
