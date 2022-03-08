import React from "react";
import { ScrollView } from "react-native";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge";
// @ts-ignore
import StepCounter from "../components/StepCounter";

export default function Home() {
  return (
    <ScrollView style={style.container}>
      <Challenge />
      <StepCounter />
    </ScrollView>
  );
}
