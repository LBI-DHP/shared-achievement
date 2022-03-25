import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { UserDataContext } from "../UserDataProvider";
import dataManager from "../DataManager";
import { Foundation } from "@expo/vector-icons";

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
            <View style={style.viewMember} key={member.username}>
              <View style={style.viewContribution}>
                <Text style={style.textContribution}>
                  {Math.floor(member.userProgress * 100)}
                </Text>
                <Text style={style.unitContribution}> %</Text>
              </View>
              <Text style={style.name}>
                {member.username === userData.username ? (
                  <>
                    {truncateString(member.username, 1)}
                    <Text style={{ fontWeight: "normal" }}> (me)</Text>
                  </>
                ) : (
                  truncateString(member.username, 4)
                )}
              </Text>
            </View>
          );
        } else {
          return (
            <View style={style.viewMember} key={member.username}>
              <View style={style.viewContribution}>
                <Text style={style.textContribution}>10000</Text>
                <Text style={style.unitContribution}>
                  {" "}
                  <Foundation name="foot" size={15} color="black" />
                </Text>
              </View>
              <Text style={style.name}>
                {member.username === userData.username ? (
                  <>
                    {truncateString(member.username, 1)}
                    <Text style={{ fontWeight: "normal" }}> (me)</Text>
                  </>
                ) : (
                  truncateString(member.username, 4)
                )}
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
    fontWeight: "bold",
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
    // backgroundColor: "#dae7ec",
    borderWidth: 1,
    borderColor: "#dae7ec",
    borderRadius: 5,
    width: 70,
    marginRight: 5,
    marginBottom: 5,
  },
});
