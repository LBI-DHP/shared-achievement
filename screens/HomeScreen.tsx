import "react-native-gesture-handler";
import * as React from "react";
import StepCounter from "../components/StepCounter";

import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
      <StepCounter />
    </View>
  );
}
