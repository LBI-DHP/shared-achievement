import React from "react";
import { Text } from "react-native";
import { Button, Surface } from "react-native-paper";
import { style as TeamListStyle } from "./TeamListStyles";

export default function TeamChartAbsolute({
  member,
  showDialog,
  setSelectedUser,
  currentUserName,
}) {
  return (
    <Surface style={TeamListStyle.surfaceAbs} key={member.username}>
      <Text style={{ fontSize: 15, fontWeight: "bold" }}>
        {member.username + " "}
        {member.username === currentUserName && (
          <Text style={{ fontWeight: "normal" }}>(you) </Text>
        )}
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
    </Surface>
  );
}
