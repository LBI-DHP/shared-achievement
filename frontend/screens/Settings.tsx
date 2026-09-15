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

import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { useEffect, useState } from "react";
import { UserDataContext } from "../providers/UserDataProvider";
import dataManager from "../components/DataManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

export default function Settings() {
  const {
    userData,
    setUserData,
  } = useContext(UserDataContext);
  const [userNameError, setUserNameError] = useState("");
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [newUserName, setNewUserName] = useState(userData.username);

  useEffect(() => {
    if (newUserName === userData.username) setIsUserNameChanged(false);
    else setIsUserNameChanged(true);
  }, [userData.username, newUserName]);

  return (
    <View style={style.container}>
      <Text style={style.subheading}>Settings</Text>
      <TextInput
        value={newUserName}
        multiline={false}
        placeholder="user name"
        onChangeText={(text) => setNewUserName(text)}
      />
      <Button
        disabled={!isUserNameChanged}
        mode="outlined"
        onPress={() => {
          setUserNameError("");
          const newUserData = {
            ...userData,
            username: newUserName,
          };
          dataManager.updateUserData(newUserData).then((data) => {
            if (data === -1)
              setUserNameError(
                "🚨 Error: Please check your internet connection."
              );
            else if (data === null)
              setUserNameError(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            else setUserData(data);
          });
        }}
      >
        Update user name
      </Button>
      {userNameError.length > 0 && (
        <Text style={{ marginTop: 2 }}>{userNameError}</Text>
      )}
      <Button
        style={{ marginTop: 10 }}

        onPress={() => {
          SecureStore.deleteItemAsync("id");
          AsyncStorage.clear().then(() => {
            setUserData({
              id: null,
              username: null,
              team: null,
              expoToken: null,
              targetGoal: null,
              showDeveloperSettings: false,
            });
          });
        }}
      >
        Clear local storage
      </Button>
    </View>
  );
}
