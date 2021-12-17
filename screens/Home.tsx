import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text } from "react-native";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import Challenge from "../components/Challenge";

export default function Home() {
  const { userData } = useContext(UserDataContext);

  return (
    <View style={style.container}>
      <Challenge />
      <Text style={style.subheading}>Hey {userData.name}!</Text>
      <StepCounter />
    </View>
  );
}
