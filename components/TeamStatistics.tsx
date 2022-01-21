import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Button, Surface } from "react-native-paper";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";
import StepCounterIOS from "./StepCounterIOS";

export default function TeamStatistics() {
  const { userData, updated, setUpdated } = useContext(UserDataContext);
  const [teamStepCountToday, setTeamStepCountToday] = useState(0);
  const [teamRelativeStepCountToday, setTeamRelativeStepCountToday] =
    useState(0);

  useEffect(() => {
    let mounted = true;
    updateTeamProgress(mounted);
    return () => {
      mounted = false;
    };
  }, [updated]);

  const updateTeamProgress = (mounted) => {
    dataManager.getTeamStepCountToday(userData.teamName).then((stepCount) => {
      if (mounted) setTeamStepCountToday(stepCount);
    });
    dataManager
      .getRelativeTeamStepCountOfToday(userData.teamName)
      .then((relativeStepCount) => {
        if (mounted) setTeamRelativeStepCountToday(relativeStepCount);
      });
  };

  console.log("teamRelativeStepCountToday", teamRelativeStepCountToday / 100);

  return (
    <>
      <Surface
        style={{
          alignItems: "center",
          justifyContent: "space-around",
          elevation: 4,
          borderRadius: 5,
          marginBottom: 30,
        }}
      >
        <Text style={styles.header}>Team {userData.teamName}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={styles.view}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {teamRelativeStepCountToday}%
            </Text>
            <Text>progress</Text>
          </View>
          <View style={styles.view}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {teamStepCountToday}
            </Text>
            <Text>total steps</Text>
          </View>
        </View>
      </Surface>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
});
