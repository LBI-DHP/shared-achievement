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
    <View style={TeamListStyle.surfaceRel} key={member.username}>
      <View style={TeamListStyle.viewRel}>
        <View
          style={{
            flexDirection: "column",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {member.username + " "}
            {member.username === currentUserName && (
              <Text style={{ fontWeight: "normal" }}>(me) </Text>
            )}
          </Text>
          <Text style={{ color: "#ffae00", fontSize: 15, fontWeight: "bold" }}>
            {userProgress}%
          </Text>
        </View>
        {member.username !== currentUserName && (
          <Button
            style={{ margin: 5 }}
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
