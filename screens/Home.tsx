import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text } from "react-native";
import { style } from "../constants/Styles";
import { AppStateContext } from "../components/AppStateProvider";

export default function Home() {
  const { userData, setUserData } = useContext(AppStateContext);

  return (
    <View style={style.container}>
      <Text style={style.subheading}>Hey {userData.name}!</Text>
      <StepCounter />
    </View>
  );
}
