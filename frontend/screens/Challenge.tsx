import React, { useState, useEffect, useContext } from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge";
// @ts-ignore
import StepCounter from "../components/StepCounter";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";
import JoinOrCreateTeam from "../components/JoinTeam";

export default function ChallengeScreen() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData, setUserData, setMode, setNavigationIndex } =
    useContext(UserDataContext);
  const [error, setError] = useState(false);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    setIsUserInATeam(userData.team !== null);
  }, [userData.team]);

  useEffect(() => {
    if (isUserInATeam)
      dataManager.getTeamData(userData.team).then((data) => {
        if (data !== null) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
  }, [isUserInATeam]);

  return (
    <ScrollView style={style.container}>
      <Challenge isUserInATeam={isUserInATeam} />
      {isUserInATeam ? (
        <StepCounter />
      ) : (
        <Button
          mode="contained"
          style={{
            marginTop: 10,
          }}
          onPress={() => {
            setNavigationIndex(1);
          }}
        >
          Select a team
        </Button>
      )}
    </ScrollView>
  );
}
