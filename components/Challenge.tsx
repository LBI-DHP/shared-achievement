import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import configJSON from "../config.json";
import { redA700 } from "react-native-paper/lib/typescript/styles/colors";
import Untersberg from "./Untersberg";
import { useWindowDimensions } from "react-native";

export default function Challenge() {
  const { height, width } = useWindowDimensions();
  const windowHeight = height;
  const windowWidth = width - 60;

  let svgWidth;
  let svgHeight;

  const relation = 547 / 247;

  if (windowWidth > windowHeight) {
    svgWidth = windowHeight / 1.5;
    svgHeight = svgWidth / relation;
  } else {
    svgWidth = windowWidth;
    svgHeight = svgWidth / relation;
  }

  return (
    <View style={style.container}>
      <Untersberg svgWidth={svgWidth} svgHeight={svgHeight} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    width: "100%",
    // height: 300,
    alignItems: "center",
    backgroundColor: "#bce0f0",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
});
