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
