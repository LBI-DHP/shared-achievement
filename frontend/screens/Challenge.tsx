import React, { useState, useEffect, useContext } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
// @ts-ignore
import StepCounterAbsolute from "../components/StepCounter/StepCounterAbsolute";
// @ts-ignore
import StepCounterRelative from "../components/StepCounter/StepCounterRelative";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";

export default function ChallengeScreen() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData, mode, setMode, setNavigationIndex } =
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
      <Surface style={styles.surface}>
        {isUserInATeam && (
          <Text style={style.cardHeader}>Progress of Team {teamName}</Text>
        )}
        <Challenge isUserInATeam={isUserInATeam} />
      </Surface>
      {isUserInATeam ? (
        <>
          {mode === "RELATIVE" ? (
            <StepCounterRelative />
          ) : (
            <StepCounterAbsolute />
          )}
        </>
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

const styles = StyleSheet.create({
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
  },
});
