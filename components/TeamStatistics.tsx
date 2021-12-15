import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";

export default function TeamStatistics() {
  const { userData } = useContext(UserDataContext);
  const [teamStepCountToday, setTeamStepCountToday] = useState(0);
  const [teamRelativeStepCountToday, setTeamRelativeStepCountToday] =
    useState(0);

  //TO DO: update when user pushes new steps
  useEffect(() => {
    dataManager.getTeamStepCountToday(userData.teamName).then((stepCount) => {
      setTeamStepCountToday(stepCount);
    });
    dataManager
      .getRelativeTeamStepCountOfToday(userData.teamName)
      .then((relativeStepCount) => {
        setTeamRelativeStepCountToday(relativeStepCount);
      });
  }, []);

  return (
    <View style={style.container}>
      <Text style={style.heading}>Go team {userData.teamName}!</Text>
      <Text style={{ paddingBottom: 10 }}>
        Total steps taken today:{" "}
        <Text style={style.subheading}>{teamStepCountToday}</Text>
      </Text>
      <Text style={style.subheading}>
        You have already completed{" "}
        <Text style={style.subheading}>{teamRelativeStepCountToday + "%"}</Text>{" "}
        of the "Untersberg Hike" challenge. Keep it up! 🥾👣⛰️
      </Text>
    </View>
  );
}
