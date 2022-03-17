import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import TeamMemberBarChart from "./TeamMemberBarChartAbsolute";

export default function TeamChartAbsolute({
  member,
  showDialog,
  setSelectedUser,
  absoluteMostSteps,
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
          <Text style={{ color: "#ffae00" }}>{member.sumSteps} steps</Text>
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
        absoluteMostSteps={absoluteMostSteps}
        contributedSteps={member.sumSteps}
      />
    </View>
  );
}
