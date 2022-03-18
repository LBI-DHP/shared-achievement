import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserDataContext } from "../UserDataProvider";
import dataManager from "../DataManager";

export default function TeamContributions() {
  const { userData, updated, mode } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState([]);

  useEffect(() => {
    let mounted = true;
    dataManager
      .getTeamMembersAndStepCountOfToday(userData.team)
      .then((teamMembersStepCountOfToday) => {
        if (mounted && teamMembersStepCountOfToday !== null)
          teamMembersStepCountOfToday.sort((a, b) =>
            a.userProgress < b.userProgress
              ? 1
              : b.userProgress < a.userProgress
              ? -1
              : 0
          );
        setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
      });
    return () => {
      mounted = false;
    };
  }, [updated]);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {teamMembersAndStepCountsOfToday.map((member) => {
        if (mode === "RELATIVE") {
          return (
            <View style={style.viewMember}>
              <Text>
                {member.username}
                {member.username === userData.username && (
                  <Text style={{ fontWeight: "normal" }}> (me)</Text>
                )}
              </Text>
              <Text>{member.userProgress * 100} %</Text>
            </View>
          );
        } else {
          return (
            <View style={style.viewMember}>
              <Text>{member.username}</Text>
              <Text>{member.sumSteps} 👣</Text>
            </View>
          );
        }
      })}
    </View>
  );
}

export const style = StyleSheet.create({
  viewMember: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    height: 40,
    width: 50,
    // elevation: 4,
    // borderRadius: 5,
    // marginBottom: 10,
  },
});
