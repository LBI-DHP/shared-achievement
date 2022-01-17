import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import { Button } from "react-native-paper";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";

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
      <Text style={style.subheading}>Go team {userData.teamName}!</Text>
      <Text style={{ paddingBottom: 10 }}>
        Total steps taken today:{" "}
        <Text style={style.subheading}>{teamStepCountToday}</Text>
      </Text>
      <Text style={{ paddingBottom: 10 }}>
        You have already completed{" "}
        <Text style={style.subheading}>{teamRelativeStepCountToday + "%"}</Text>{" "}
        of the "Untersberg Hike" challenge. Keep it up! 🥾👣⛰️
      </Text>
      <Button mode="contained" onPress={() => setUpdated(!updated)}>
        🔄 Refresh
      </Button>
    </>
  );
}
