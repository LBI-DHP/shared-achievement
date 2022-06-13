import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserDataContext } from "../UserDataProvider";
import dataManager from "../DataManager";
import { Foundation } from "@expo/vector-icons";
import { UpdateContext } from "../UpdateProvider";

export default function TeamContributions() {
  const { userData, mode } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState([]);
  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);

  useEffect(() => {
    let mounted = true;
    if (mode) {
      dataManager
        .getTeamMembersAndStepCountOfToday(userData.team)
        .then((teamMembersStepCountOfToday) => {
          if (mounted && teamMembersStepCountOfToday !== null)
            if (mode === "ABSOLUTE") {
              teamMembersStepCountOfToday.sort((a, b) =>
                a.sumSteps < b.sumSteps ? 1 : b.sumSteps < a.sumSteps ? -1 : 0
              );
            } else {
              teamMembersStepCountOfToday.sort((a, b) =>
                a.userProgress < b.userProgress
                  ? 1
                  : b.userProgress < a.userProgress
                  ? -1
                  : 0
              );
            }
          console.log(teamMembersStepCountOfToday);
          setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
        });
    }
    return () => {
      mounted = false;
    };
  }, [apiReloadIndicator, stepsPushedIndicator, midnightIndicator, mode]);

  return (
    <View
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
        paddingBottom: 5,
      }}
    >
      {teamMembersAndStepCountsOfToday.map((member) => {
        if (mode === "RELATIVE") {
          return (
            <View
              style={
                member.username !== userData.username
                  ? style.viewMember
                  : style.viewMe
              }
              key={member.username}
            >
              <View style={style.viewContribution}>
                <Text style={style.textContribution}>
                  {Math.round(member.userProgress * 100)}
                </Text>
                <Text style={style.unitContribution}> %</Text>
              </View>
              <Text style={style.name}>
                {member.username === userData.username
                  ? "me"
                  : truncateString(member.username, 4)}
              </Text>
            </View>
          );
        } else if (mode === "ABSOLUTE") {
          return (
            <View
              style={
                member.username !== userData.username
                  ? style.viewMember
                  : style.viewMe
              }
              key={member.username}
            >
              <View style={style.viewContribution}>
                <Text style={style.textContribution}>{member.sumSteps}</Text>
                <Text style={style.unitContribution}>
                  {" "}
                  <Foundation name="foot" size={15} color="black" />
                </Text>
              </View>
              <Text style={style.name}>
                {member.username === userData.username
                  ? "me"
                  : truncateString(member.username, 4)}
              </Text>
            </View>
          );
        }
      })}
    </View>
  );
}

function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "…";
  }
  return str;
}

export const style = StyleSheet.create({
  name: {
    marginTop: -3,
    color: "black",
  },
  textContribution: {
    fontWeight: "bold",
    color: "black",
  },
  unitContribution: { color: "black" },
  viewContribution: {
    flexDirection: "row",
  },
  viewMember: {
    flexDirection: "column",
    padding: 5,
    borderWidth: 1,
    borderColor: "#7ebdd8",
    borderRadius: 5,
    width: 70,
    marginRight: 5,
    marginBottom: 5,
  },
  viewMe: {
    flexDirection: "column",
    padding: 4,
    borderWidth: 2,
    borderColor: "#ffbb00",
    backgroundColor: "#fff8e3",
    borderRadius: 5,
    width: 70,
    marginRight: 5,
    marginBottom: 5,
    fontWeight: "normal",
  },
});
