/*
 * Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
 *
 * Licensed under the Apache License, Version 2.0 with the Commons Clause License
 * Condition v1.0 (the "License"); you may not use this file except in compliance
 * with the License. A copy of the License is distributed in the LICENSE file at
 * the root of this repository; the Apache License is also available at
 * http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
 * https://commonsclause.com/
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64";
import * as SecureStore from "expo-secure-store";

export default class dataManager {
  static mapResponseUserDataToUserData = (responseUserData) => {
    return {
      uniqueDeviceId: responseUserData.uniqueDeviceId,
      id: responseUserData.id,
      username: responseUserData.username,
      team: responseUserData.team,
      expoToken: responseUserData.expoToken,
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
    console.log(process.env);
    console.log("apiUrl", process.env.EXPO_PUBLIC_API_URL);
    let id = await SecureStore.getItemAsync("id");
    console.log("userID", id);
    return id;
  };

  static setUserId = async (id) => {
    try {
      await SecureStore.setItemAsync("id", id.toString());
    } catch (e) {
      console.log(e);
    } finally {
      console.log("User ID (", id, ") was set in secure storage");
    }
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

  static getUserDataByUniqueDeviceId = async (uniqueDeviceId) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL +
        "/api/user/?uniqueDeviceId=" +
        uniqueDeviceId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          if (responseJSON && responseJSON.objects && responseJSON.objects[0])
            return this.mapResponseUserDataToUserData(responseJSON.objects[0]);
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

  static getUserData = async (userid) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/api/user/" + userid + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          return this.mapResponseUserDataToUserData(responseJSON);
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
      const response = await fetch(process.env.EXPO_PUBLIC_API_URL + "/register", {
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
          return this.mapResponseUserDataToUserData(responseJSON);
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
        process.env.EXPO_PUBLIC_API_URL + "/api/user/" + userData.id + "/",
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
            // Authorization: "Basic " + base64.encode("admin" + ":" + "admin"),
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
          return this.mapResponseUserDataToUserData(responseJSON);
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

  static getUserChallengeData = async (id, date = "") => {
    let completeRequestString = id;
    if (date.length !== 0) completeRequestString += "?date=" + date;

    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL +
        "/challenge/user/" +
        completeRequestString,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
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
      console.log("done with get user step count request");
    }
  };

  static pushSteps = async (userid, newSteps) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/push_steps",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
          },
          body: JSON.stringify({
            user_id: userid,
            steps: newSteps,
          }),
        }
      );

      console.log("push steps response status: " + response.status);

      if (response.ok) {
        const contentType = await response.headers.get("content-type");
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

  static sendUserMessage = async (
    senderUserID,
    receiverUserID,
    title,
    body,
    type = "USER_MOTIVATION_MESSAGE"
  ) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/send_user_message/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
          },
          body: JSON.stringify({
            sender: senderUserID,
            receiver: receiverUserID,
            title: title,
            body: body,
            type: type,
          }),
        }
      );

      if (response.ok) {
        return 1;
      }
      return -1;
    } catch (error) {
      console.log("error on create new team:" + error);
      return -1;
    } finally {
      console.log("done with create new team request");
    }
  };

  static createNewTeam = async ({ name, progressCalculationMode }) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/admin/team/add",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            progressCalculationMode: progressCalculationMode,
            hidden: true,
          }),
        }
      );

      if (response.ok) {
        return 1;
      }
      return -1;
    } catch (error) {
      console.log("error on create new team:" + error);
      return -1;
    } finally {
      console.log("done with create new team request");
    }
  };

  static getAllTeams = async () => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/api/team/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
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

  static getTeamMembersAndStepCountOfToday = async (teamid, mode) => {
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/teamstepstoday/" + teamid,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const responseJSON = await response.json();
          if (responseJSON !== null)
            if (mode === "ABSOLUTE") {
              responseJSON.sort((a, b) =>
                a.sumSteps < b.sumSteps ? 1 : b.sumSteps < a.sumSteps ? -1 : 0
              );
            } else {
              responseJSON.sort((a, b) =>
                a.userProgress < b.userProgress
                  ? 1
                  : b.userProgress < a.userProgress
                    ? -1
                    : 0
              );
            }
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
        process.env.EXPO_PUBLIC_API_URL + "/api/team/" + teamid + "/",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
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
      console.log("error on get team data:" + error);
    } finally {
      console.log("done with get team data request");
    }
  };
  static getTeamChallengeData = async (teamid, date = "") => {
    let completeRequestString = teamid;
    if (date.length !== 0) completeRequestString += "?date=" + date;

    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL +
        "/challenge/team/" +
        completeRequestString,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " + process.env.EXPO_PUBLIC_AUTHORIZATION,
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
      console.log("error on get team challenge data:" + error);
    } finally {
      console.log("done with get team challenge data request");
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
      } else {
        return false;
      }
    } catch (error) {
      console.log("error on send push message:" + error);
    } finally {
      console.log("done with send push message request");
    }
  };
}
