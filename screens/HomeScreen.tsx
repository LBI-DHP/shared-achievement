import "react-native-gesture-handler";
import * as React from "react";
import StepCounter from "../components/StepCounter";

import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { style } from "../constants/Styles";

export default function HomeScreen() {
  const [username, setName] = React.useState(""); // TODO replace with active username

  // TODO replace with implemented functions
  const setUserName = () => {
    console.log("savce username: " + username);
  };

  return (
    <View style={style.container}>
      <Text style={style.heading}>Set a user name to face the challenge</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>User Name:</Text>
        <View>
          <TextInput
            value={username}
            multiline={false}
            placeholder="Enter a user name"
            autoComplete={false}
            onChangeText={(text) => setName(text)}
          />
          <Button mode="contained" onPress={setUserName}>
            Set user name
          </Button>
        </View>
      </View>
      <StepCounter />
    </View>
  );
}
