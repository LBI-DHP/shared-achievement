import React, { useContext } from "react";
import { View, Text } from "react-native";
import { style } from "../constants/Styles";
import { Button } from "react-native-paper";
import { Restart } from "fiction-expo-restart";

export default function NoInternetConnection() {
  return (
    <View style={style.containerPaddingTop}>
      <Text style={style.heading}>Error 🚨</Text>
      <Text style={style.subheading}>
        It seems that you are not connected to the internet. Please check your
        connection. 🌐
      </Text>
      <Button
        mode="contained"
        style={{
          marginTop: 10,
        }}
        onPress={() => {
          Restart();
        }}
      >
        🔄 Restart App
      </Button>
    </View>
  );
}
