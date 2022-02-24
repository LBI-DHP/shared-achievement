import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Surface } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";

export default function TeamStatistics() {
  const { userData, updated } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState({ challenge: {}, name: "", persons: [] });

  useEffect(() => {
    let mounted = true;
    getTeamMembersStepCountOfToday(mounted);
    return () => {
      mounted = false;
    };
  }, [updated]);

  const getTeamMembersStepCountOfToday = (mounted) => {
    dataManager
      .getTeamMembersStepCountOfToday(userData.teamName)
      .then((teamMembersStepCountOfToday) => {
        if (mounted)
          setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
      });
  };

  return (
    <Surface
      style={{
        elevation: 4,
        borderRadius: 5,
        marginBottom: 30,
      }}
    >
      {teamMembersAndStepCountsOfToday.persons.map((person) => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 5,
            }}
          >
            <Text>{person.name}</Text>
            <Button mode="contained">motivate</Button>
          </View>
        );
      })}
    </Surface>
  );
}
