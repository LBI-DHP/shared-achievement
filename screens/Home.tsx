import React, { useContext } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text, Platform } from "react-native";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import Challenge from "../components/Challenge";
import GoogleAuth from "../components/GoogleAuth";

export default function Home() {
  const { userData } = useContext(UserDataContext);

  return (
    <View style={style.container}>
      <Challenge />
      <Text style={style.subheading}>Hey {userData.name}!</Text>
      {Platform.OS === "ios" && <StepCounter />}
      {Platform.OS !== "ios" && <GoogleAuth />}
    </View>
  );
}
