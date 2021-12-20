import "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import Untersberg from "./Untersberg";
import Clouds from "./Clouds";
import FlagTop from "./FlagTop";
import { useWindowDimensions } from "react-native";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import { Text } from "react-native";

export default function Challenge() {
  const { userData } = useContext(UserDataContext);
  const [teamRelativeStepCountToday, setTeamRelativeStepCountToday] =
    useState(0);

  useEffect(() => {
    let mounted = true;
    dataManager
      .getRelativeTeamStepCountOfToday(userData.teamName)
      .then((relativeStepCount) => {
        if (mounted) setTeamRelativeStepCountToday(relativeStepCount / 100);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const progress = teamRelativeStepCountToday;
  const { height, width } = useWindowDimensions();
  const windowHeight = height;
  const windowWidth = width - 40;

  let untersbergSvgWidth;
  let untersbergSvgHeight;
  let flagSvgHeight;

  const untersbergSvgViewBoxWidth = 547;
  const untersbergSvgViewBoxHeight = 247;
  const flagSvgViewBoxHeight = 33;

  const untersbergRelation =
    untersbergSvgViewBoxWidth / untersbergSvgViewBoxHeight;
  const flagRelation = untersbergSvgViewBoxWidth / flagSvgViewBoxHeight;

  if (windowWidth > windowHeight) {
    untersbergSvgWidth = windowHeight / 1.5;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  } else {
    untersbergSvgWidth = windowWidth;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  }

  const progressPosition =
    untersbergSvgViewBoxHeight - untersbergSvgViewBoxHeight * progress;

  return (
    <View style={style.container}>
      <Clouds
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight / 3.5}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight / 3.5}
      />
      <FlagTop
        svgWidth={untersbergSvgWidth}
        svgHeight={flagSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={flagSvgViewBoxHeight}
      />
      <Untersberg
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight}
        progressPosition={progressPosition}
        progressPercent={progress}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#bce0f0",
    marginBottom: 10,
    justifyContent: "flex-end",
  },
});
