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

import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { UserDataContext } from "../providers/UserDataProvider";
import dataManager from "./DataManager";
import { Picker } from "@react-native-picker/picker";
import CenteredActivityIndicator from "./CenteredActivityIndicator";
import { style } from "../constants/Styles";

export default function JoinOrCreateTeam() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorOnLoadTeams, setErrorOnLoadTeams] = useState("");
  const [errorOnJoinTeam, setErrorOnJoinTeam] = useState("");

  useEffect(() => {
    let mounted = true;
    dataManager.getAllTeams().then((response) => {
      if (mounted) {
        if (response === -1)
          setErrorOnLoadTeams(
            "🚨 Error: Please check your internet connection."
          );
        else if (response === null)
          setErrorOnLoadTeams(
            "🚨 Internal Server Error: Please try again or contact the administrator."
          );
        else {
          const allVisibleTeams = [];
          response.forEach(team => {
            if (!team.hidden) allVisibleTeams.push(team);
          });
          setAllTeams(allVisibleTeams);

        }
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <CenteredActivityIndicator height={50} />;

  return (
    <View>
      <Text style={style.header}>Select your Team</Text>
      {errorOnLoadTeams.length > 0 && (
        <Text style={{ marginTop: 2, marginBottom: 2, textAlign: "center" }}>
          {errorOnLoadTeams}
        </Text>
      )}
      {isLoading ? (
        <CenteredActivityIndicator height={65} />
      ) : (
        <Picker
          selectedValue={selectedTeam}
          onValueChange={(itemValue) => setSelectedTeam(itemValue)}
        >
          <Picker.Item enabled={false} label="=== select a team ===" value="" />
          {allTeams.map((team) => {
            return (
              <Picker.Item
                label={"Team " + team.name}
                value={team.id}
                key={team.id}
              />
            );
          })}
        </Picker>
      )}
      <Button
        mode="outlined"
        style={{
          margin: 10,
        }}
        onPress={() => {
          const updatedUserData = { ...userData, team: selectedTeam };
          dataManager.updateUserData(updatedUserData).then((data) => {
            if (data === -1)
              setErrorOnJoinTeam(
                "🚨 Error: Please check your internet connection."
              );
            else if (data === null)
              setErrorOnJoinTeam(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            else setUserData(data);
          });
        }}
        disabled={selectedTeam.length === 0 || isLoading}
      >
        {"Join team"}
      </Button>
      {errorOnJoinTeam.length > 0 && (
        <Text style={{ marginTop: 2, marginBottom: 10, textAlign: "center" }}>
          {errorOnJoinTeam}
        </Text>
      )}
    </View>
  );
}
