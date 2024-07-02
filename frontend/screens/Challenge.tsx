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
