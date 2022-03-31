import React from "react";
import { Surface } from "react-native-paper";
import { Text } from "../Themed";
import { style as stepCounterStyles } from "./StepCounterStyles";

export default function StepCounter() {
  return (
    <Surface style={stepCounterStyles.surface}>
      <Text>Sorry, no step counter available.</Text>
    </Surface>
  );
}
