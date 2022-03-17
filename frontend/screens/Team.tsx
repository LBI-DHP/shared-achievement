import React, { useState, useContext, useEffect } from "react";
import { BackHandler, ScrollView, Text } from "react-native";
import { Button } from "react-native-paper";
import JoinOrCreateTeam from "../components/JoinTeam";
import { UserDataContext } from "../components/UserDataProvider";
import TeamList from "../components/TeamList";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";

export default function Team() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData, setUserData, mode, setMode } = useContext(UserDataContext);
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
      {isUserInATeam ? (
        <>
          <Text style={style.heading}>Team {teamName}</Text>
          <Text>{mode}</Text>
          <TeamList />
          <Button
            disabled={!isUserInATeam}
            mode="contained"
            onPress={() => {
              setError(false);
              const newUserData = {
                ...userData,
                team: null,
              };
              dataManager.updateUserData(newUserData).then((data) => {
                if (data !== null) {
                  setUserData(newUserData);
                  setMode(null);
                } else {
                  setError(true);
                }
              });
            }}
          >
            Leave Team
          </Button>
        </>
      ) : (
        <JoinOrCreateTeam />
      )}
    </ScrollView>
  );
}
