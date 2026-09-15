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

import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { Button } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
import TeamContributions from "../components/Challenge/TeamContributions";
import Trophy from "../components/Challenge/Trophy";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../providers/UserDataProvider";
import { TeamDataContext } from "../providers/TeamDataProvider";
import YesterdaysProgressPopUp from "../components/YesterdaysProgressPopUp";
import TodaysPopUp from "../components/TodaysPopUp";
import { getDateStringYesterday } from "../constants/Functions";
import ContributeButton from "../components/Challenge/ContributeButton";

export default function ChallengeScreen() {
  const {
    userData,
    setNavigationIndex,
    isUserDataLoading,
    navigationIndex,
  } = useContext(UserDataContext);

  const { mode, teamName, teamChallengeData } = useContext(TeamDataContext);

  const [teamReachedSummit, setTeamReachedSummit] = useState(false);
  const [isTodaysPopUpVisible, setIsTodaysPopUpVisible] = useState(false);
  const [showConfettiCannon, setShowConfettiCannon] = useState(false);
  const [
    isYesterdaysProgressPopUpVisible,
    setIsYesterdaysProgressPopUpVisible,
  ] = useState(false);
  const [yesterdaysProgress, setYesterdaysProgress] = useState(null);
  const [yesterdaysSteps, setYesterdaysSteps] = useState(null);
  const [didChallengeExistYesterday, setDidChallengeExistYesterday] =
    useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isUserDataLoading && userData.team) {
      dataManager.getShowYesterdaysProgressPopUp().then((showPopUp) => {
        if (showPopUp) {
          const dateStringYesterday = getDateStringYesterday();

          dataManager
            .getTeamChallengeData(userData.team, dateStringYesterday)
            .then((data) => {
              if (mounted && data === -1) {
                setDidChallengeExistYesterday(false);
              } else if (mounted && data && data.progress) {
                setYesterdaysProgress(data.progress);
                setYesterdaysSteps(data.total_steps);
                setDidChallengeExistYesterday(true);
                setIsYesterdaysProgressPopUpVisible(showPopUp);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else setIsYesterdaysProgressPopUpVisible(showPopUp);
      });
    }
    return () => {
      mounted = false;
    };
  }, [userData.team, isUserDataLoading]);

  useEffect(() => {
    if (userData.team && teamChallengeData.progress) {
      setTeamReachedSummit(teamChallengeData.progress >= 100);
      setShowConfettiCannon(teamChallengeData.progress >= 100);
    } else {
      setTeamReachedSummit(false);
      setShowConfettiCannon(false);
    }
  }, [teamChallengeData.progress, userData.team]);

  useEffect(() => {
    let mounted = true;
    if (teamReachedSummit && navigationIndex === 0) {
      dataManager.getShowReachedSummitPopUp().then((showPopUp) => {
        if (mounted) setIsTodaysPopUpVisible(showPopUp);
      });
    }
    return () => {
      mounted = false;
    };
  }, [teamReachedSummit]);

  return (
    <>
      <Text style={style.header}>Progress of Team {teamName}</Text>
      <ScrollView>
        <View
          style={{
            paddingBottom: 35,
          }}
        >
          {teamReachedSummit && <Trophy />}
          <Challenge />
          {userData.team && <TeamContributions />}
          {userData.team ? (
            <ContributeButton></ContributeButton>
          ) : (
            <Button
              mode="outlined"
              style={{
                margin: 10,
              }}
              onPress={() => {
                setNavigationIndex(1);
              }}
            >
              Select a team
            </Button>
          )}
        </View>
        {isTodaysPopUpVisible && navigationIndex === 0 && (
          <TodaysPopUp
            isTodaysPopUpVisible={isTodaysPopUpVisible}
            setIsTodaysPopUpVisible={setIsTodaysPopUpVisible}
          />
        )}
        {isYesterdaysProgressPopUpVisible && didChallengeExistYesterday && (
          <YesterdaysProgressPopUp
            isYesterdaysProgressPopUpVisible={isYesterdaysProgressPopUpVisible}
            setIsYesterdaysProgressPopUpVisible={
              setIsYesterdaysProgressPopUpVisible
            }
            yesterdaysProgress={yesterdaysProgress}
            mode={mode}
            yesterdaysSteps={yesterdaysSteps}
          />
        )}
      </ScrollView>
      {showConfettiCannon && (
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      )}
    </>
  );
}
