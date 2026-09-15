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
import { style } from "../constants/Styles";
import SingleChallenge from "../components/Challenge/SingleChallenge";
import Trophy from "../components/Challenge/Trophy";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../providers/UserDataProvider";
import YesterdaysProgressPopUp from "../components/YesterdaysProgressPopUp";
import TodaysPopUp from "../components/TodaysPopUp";
import { getDateStringYesterday } from "../constants/Functions";
import ContributeButton from "../components/Challenge/ContributeButton";

export default function SingleChallengeScreen() {
  const {
    userData,
    isUserDataLoading,
    navigationIndex,
    userChallengeData,
  } = useContext(UserDataContext);

  const [userReachedSummit, setUserReachedSummit] = useState(false);
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
    if (!isUserDataLoading) {
      dataManager.getShowYesterdaysProgressPopUp().then((showPopUp) => {
        if (showPopUp) {
          const dateStringYesterday = getDateStringYesterday();
          dataManager
            .getUserChallengeData(userData.id, dateStringYesterday)
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
  }, [isUserDataLoading]);

  useEffect(() => {
    if (userChallengeData.progress) {
      setUserReachedSummit(userChallengeData.progress >= 100);
      setShowConfettiCannon(userChallengeData.progress >= 100);
    } else {
      setUserReachedSummit(false);
      setShowConfettiCannon(false);
    }
  }, [userChallengeData.progress]);

  useEffect(() => {
    let mounted = true;
    if (userReachedSummit) {
      dataManager.getShowReachedSummitPopUp().then((showPopUp) => {
        if (mounted) setIsTodaysPopUpVisible(showPopUp);
      });
    }
    return () => {
      mounted = false;
    };
  }, [userReachedSummit]);

  return (
    <>
      <Text style={style.header}>Progress of {userData.username}</Text>
      <ScrollView>
        <View
          style={{
            paddingBottom: 35,
          }}
        >
          {userReachedSummit && <Trophy />}
          <SingleChallenge />
          <ContributeButton></ContributeButton>
        </View>
        {isTodaysPopUpVisible && navigationIndex === 0 && (
          <TodaysPopUp
            isTodaysPopUpVisible={isTodaysPopUpVisible}
            setIsTodaysPopUpVisible={setIsTodaysPopUpVisible}
            isSingleUser={true}
          />
        )}
        {isYesterdaysProgressPopUpVisible && didChallengeExistYesterday && (
          <YesterdaysProgressPopUp
            isYesterdaysProgressPopUpVisible={isYesterdaysProgressPopUpVisible}
            setIsYesterdaysProgressPopUpVisible={
              setIsYesterdaysProgressPopUpVisible
            }
            yesterdaysProgress={yesterdaysProgress}
            mode={"ABSOLUTE"}
            yesterdaysSteps={yesterdaysSteps}
            isSingleUser={true}
          />
        )}
      </ScrollView>
      {showConfettiCannon && (
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      )}
    </>
  );
}
