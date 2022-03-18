import React from "react";
import { Text, View } from "react-native";
import { Button, Surface } from "react-native-paper";
import TeamMemberBarChart from "./TeamMemberBarChart";
import { style as TeamListStyle } from "./TeamListStyles";

export default function TeamChartRelative({
  member,
  showDialog,
  setSelectedUser,
  currentUserName,
}) {
  let userProgress = Math.floor(member.userProgress * 100);
  return (
    <Surface style={TeamListStyle.surfaceRel} key={member.username}>
      <View style={TeamListStyle.viewRel}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          {member.username + " "}
          {member.username === currentUserName && (
            <Text style={{ fontWeight: "normal" }}>(you) </Text>
          )}
          <Text style={{ color: "#ffae00" }}>{userProgress}%</Text>
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
    </Surface>
  );
}
