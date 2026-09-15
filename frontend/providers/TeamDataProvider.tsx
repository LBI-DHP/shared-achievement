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

import React, { useEffect, useState, useContext } from "react";
import dataManager from "../components/DataManager";
import { UserDataContext } from "./UserDataProvider";
import { UpdateContext } from "./UpdateProvider";

export const TeamDataContext = React.createContext({
  teamName: null,
  mode: null,
  teamMembersAndStepCountOfToday: [],
  teamChallengeData: { progress: 0, totalSteps: 0, teamMembersGoal: 0 },
  isTeamMembersAndStepCountOfTodayLoading: true,
});

export const TeamDataProvider = (props) => {
  const [mode, setMode] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [teamMembersAndStepCountOfToday, setTeamMembersAndStepCountOfToday] =
    useState([]);
  const [
    isTeamMembersAndStepCountOfTodayLoading,
    setIsTeamMembersAndStepCountOfTodayLoading,
  ] = useState(true);
  const [teamChallengeData, setTeamChallengeData] = useState({
    progress: 0,
    totalSteps: 0,
    teamMembersGoal: 0,
  });

  const { userData } = useContext(UserDataContext);
  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);

  useEffect(() => {
    if (userData.team === null) setMode(null);
  }, [userData.team]);

  useEffect(() => {
    let mounted = true;
    if (userData.team && mounted) {
      dataManager.getTeamData(userData.team).then((data) => {
        if (mounted && data) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
    }
  }, [userData.team]);

  useEffect(() => {
    let mounted = true;
    if (userData.team && mode) {
      dataManager
        .getTeamMembersAndStepCountOfToday(userData.team, mode)
        .then((data) => {
          if (mounted && data) setTeamMembersAndStepCountOfToday(data);
        })
        .finally(() => setIsTeamMembersAndStepCountOfTodayLoading(false));

      dataManager
        .getTeamChallengeData(userData.team)
        .then((data) => {
          if (mounted && data) {
            if (!data.progress || isNaN(data.progress) || data.progress < 0)
              data.progress = 0;

            if (
              !data.total_steps ||
              isNaN(data.total_steps) ||
              data.total_steps < 0
            )
              data.totalSteps = 0;
            else data.totalSteps = data.total_steps;

            delete data.total_steps;

            setTeamChallengeData(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return () => {
        mounted = false;
      };
    }
    return () => {
      mounted = false;
    };
  }, [
    mode,
    apiReloadIndicator,
    stepsPushedIndicator,
    midnightIndicator,
    userData.team,
  ]);

  return (
    <TeamDataContext.Provider
      value={{
        mode,
        teamName,
        teamMembersAndStepCountOfToday,
        teamChallengeData,
        isTeamMembersAndStepCountOfTodayLoading,
      }}
    >
      {props.children}
    </TeamDataContext.Provider>
  );
};
