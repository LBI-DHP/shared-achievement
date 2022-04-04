import React from "react";
import { View, Text } from "react-native";
import { style } from "../constants/Styles";

export default function NoInternetConnection() {
  return (
    <View style={style.containerPaddingTop}>
      <Text style={style.heading}>Error 🚨</Text>
      <Text style={style.subheading}>
        It seems that you are not connected to the internet. Please check your
        connection. And restart the app. 🌐
      </Text>
    </View>
  );
}
