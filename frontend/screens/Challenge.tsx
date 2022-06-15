import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, Platform } from "react-native";
import { Button } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
import TeamContributions from "../components/Challenge/TeamContributions";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../providers/UserDataProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import StepCounterPedometerIOS from "../components/StepCounter/StepCounterPedometerIOS";
import StepCounterGoogleFit from "../components/StepCounter/StepCounterGoogleFit";
import { UpdateContext } from "../providers/UpdateProvider";
import YesterdaysProgressPopUp from "../components/YesterdaysProgressPopUp";
import TodaysPopUp from "../components/TodaysPopUp";

export default function ChallengeScreen() {
  const {
    userData,
    setMode,
    setNavigationIndex,
    isUserDataLoading,
    navigationIndex,
    mode,
    useGoogleFit,
  } = useContext(UserDataContext);
  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);

  const [teamName, setTeamName] = useState("");
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
    if (teamReachedSummit && navigationIndex === 0) {
      dataManager.getShowReachedSummitPopUp().then((showPopUp) => {
        if (mounted) setIsTodaysPopUpVisible(showPopUp);
      });
    }
    if (teamReachedSummit && navigationIndex === 0) {
      if (mounted) setShowConfettiCannon(true);
    }
    return () => {
      mounted = false;
    };
  }, [
    teamReachedSummit,
    apiReloadIndicator,
    stepsPushedIndicator,
    midnightIndicator,
  ]);

  useEffect(() => {
    let mounted = true;
    if (!isUserDataLoading && userData.team) {
      dataManager.getShowYesterdaysProgressPopUp().then((showPopUp) => {
        if (mounted) setIsYesterdaysProgressPopUpVisible(showPopUp);
      });
    }
    return () => {
      mounted = false;
    };
  }, [userData.team]);

  useEffect(() => {
    let mounted = true;
    if (!isUserDataLoading && userData.team) {
      dataManager.getTeamData(userData.team).then((data) => {
        if (data !== null) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
      dataManager
        .getTeamChallengeData(userData.team)
        .then((data) => {
          if (mounted && data.progress) {
            setTeamReachedSummit(data.progress >= 100);
            setShowConfettiCannon(data.progress >= 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      const newDate = new Date();
      newDate.setDate(newDate.getDate() - 1);
      const date = newDate.getDate();
      const month = newDate.getMonth() + 1;
      const year = newDate.getFullYear();
      let dateString = date.toString();
      if (dateString.length === 1) dateString = "0" + dateString;
      let monthString = month.toString();
      if (monthString.length === 1) monthString = "0" + monthString;
      const dateStringYesterday = year + "-" + monthString + "-" + dateString;

      dataManager
        .getTeamChallengeData(userData.team, dateStringYesterday)
        .then((data) => {
          if (mounted && data === -1) {
            setDidChallengeExistYesterday(false);
          } else if (mounted && data && data.progress) {
            setYesterdaysProgress(data.progress);
            setYesterdaysSteps(data.total_steps);
            setDidChallengeExistYesterday(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTeamName(null);
      setTeamReachedSummit(false);
      setShowConfettiCannon(false);
    }

    return () => {
      mounted = false;
    };
  }, [apiReloadIndicator, stepsPushedIndicator, midnightIndicator, userData]);

  return (
    <>
      <Text style={style.header}>Progress of Team {teamName}</Text>
      <ScrollView>
        <View
          style={{
            paddingBottom: 35,
          }}
        >
          <>
            {teamReachedSummit && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#99bfcf",
                  borderRadius: 15,
                  backgroundColor: "white",
                  width: 32,
                  padding: 5,
                  marginLeft: 18,
                  marginTop: 17,
                  marginBottom: -50,
                  zIndex: 100,
                }}
              >
                <MaterialCommunityIcons
                  name="trophy"
                  size={20}
                  color="#ffae00"
                />
              </View>
            )}
            <Challenge />
            {userData.team && <TeamContributions />}
          </>
          {userData.team ? (
            Platform.OS === "android" || useGoogleFit ? (
              <StepCounterGoogleFit />
            ) : (
              <StepCounterPedometerIOS />
            )
          ) : (
            <Button
              mode="contained"
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
