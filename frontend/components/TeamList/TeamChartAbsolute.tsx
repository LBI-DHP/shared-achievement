import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { style as TeamListStyle } from "./TeamListStyles";

export default function TeamChartAbsolute({
  member,
  showDialog,
  setSelectedUser,
  currentUserName,
}) {
  return (
    <View style={TeamListStyle.surfaceAbs} key={member.username}>
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
        <Text style={{ color: member.color, fontSize: 15, fontWeight: "bold" }}>
          {member.sumSteps} steps
        </Text>
      </View>
      {member.username !== currentUserName && (
        <Button
          style={{ backgroundColor: member.color }}
          onPress={() => {
            setSelectedUser({
              username: member.username,
              expoToken: member.expoToken,
            });
            showDialog();
          }}
          mode="contained"
        >
          motivate
        </Button>
      )}
    </View>
  );
}
