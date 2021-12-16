import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text } from "react-native";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";

export default function Home() {
  const { userData } = useContext(UserDataContext);

  return (
    <View style={style.container}>
      <Text style={style.subheading}>Hey {userData.name}!</Text>
      <StepCounter />
    </View>
  );
}
