import React, { useContext, useState, useEffect } from "react";
import StepCounterIOS from "../components/StepCounterIOS";
import { ScrollView, Keyboard, Platform } from "react-native";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import Challenge from "../components/Challenge";
import GoogleAuth from "../components/GoogleAuth";
import JoinOrCreateTeam from "../components/JoinOrCreateTeam";
import TeamStatistics from "../components/TeamStatistics";
import StepCounterAndroid from "../components/StepCounterAndroid";

export default function Home() {
  const { userData } = useContext(UserDataContext);
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const [isKeyboardOpen, setIsKeyBoardOpen] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    setIsUserInATeam(userData.teamName !== null);
  }, [userData.teamName]);

  return (
    <ScrollView style={style.container}>
      {!(Platform.OS === "ios" && isKeyboardOpen) && <Challenge />}
      {isUserInATeam && Platform.OS === "ios" && <StepCounterIOS />}
      {isUserInATeam && Platform.OS === "android" && <StepCounterAndroid />}
      {isUserInATeam ? <TeamStatistics /> : <JoinOrCreateTeam />}
    </ScrollView>
  );
}
