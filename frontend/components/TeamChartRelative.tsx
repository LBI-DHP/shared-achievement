import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import TeamMemberBarChart from "./TeamMemberBarChartRelative";

export default function TeamChartRelative({
  member,
  showDialog,
  setSelectedUser,
  currentUserName,
}) {
  return (
    <View style={{ paddingBottom: 20 }} key={member.username}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingBottom: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {member.username + " "}
          {member.username === currentUserName && "(you) "}
          <Text style={{ color: "#ffae00" }}>{member.userProgress * 100}%</Text>
        </Text>
        {member.username !== currentUserName && (
          <Button
            onPress={() => {
              setSelectedUser(member);
              showDialog();
            }}
            mode="contained"
          >
            motivate
          </Button>
        )}
      </View>
      <TeamMemberBarChart
        goalSteps={member.targetGoal}
        contributedSteps={member.sumSteps}
      />
    </View>
  );
}
