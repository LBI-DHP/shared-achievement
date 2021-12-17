import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import configJSON from "../config.json";
import { redA700 } from "react-native-paper/lib/typescript/styles/colors";
import Untersberg from "./Untersberg";

export default function Challenge() {
  return (
    <View style={style.container}>
      <Untersberg />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    alignItems: "center",
    backgroundColor: "#bce0f0",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
});
