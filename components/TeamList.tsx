import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button, Surface } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import TeamMemberBarChart from "./TeamMemberBarChart";
import { style } from "../constants/Styles";

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
    <View
      style={{
        marginBottom: 30,
      }}
    >
      {teamMembersAndStepCountsOfToday.persons.map((person) => {
        return (
          <View style={{ paddingBottom: 20 }} key={person.name}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {person.name}{" "}
                <Text style={{ color: "#ffae00" }}>{(500 / 1000) * 100}%</Text>
              </Text>
              <Button mode="contained">motivate</Button>
            </View>
            <TeamMemberBarChart goalSteps={1000} contributedSteps={500} />
          </View>
        );
      })}
    </View>
  );
}
