import React from "react";
import { View, useWindowDimensions, Text } from "react-native";
import Svg, { Rect, Mask } from "react-native-svg";

export default function StepsBarChart({
  goalSteps,
  contributedSteps,
  newSteps,
}) {
  const { width } = useWindowDimensions();
  const windowWidth = width - 60;

  const colorStepsGoal = "#bebdbd";
  const colorStepsContributed = "#7ebdd8";
  const colorNewSteps = "#ffbb00";

  const height = 20;
  let stepsLeft = goalSteps - newSteps - contributedSteps;

  if (stepsLeft < 0) stepsLeft = 0;

  let contributedProgress = 0;
  let newProgress = 0;

  if (contributedSteps > 0) {
    contributedProgress = contributedSteps / goalSteps;
  }

  if (newSteps > 0) {
    newProgress = newSteps / goalSteps;
    newProgress += contributedProgress;
  }

  return (
    <View>
      <Svg
        style={{ margin: 10 }}
        height={height}
        width={windowWidth}
        viewBox={"0 0 " + windowWidth + " " + height}
      >
        <Mask id="Mask" x="0" y="0" width={windowWidth} height={height}>
          <Rect
            x="0"
            y="0"
            ry={height / 2}
            rx={height / 2}
            width={windowWidth}
            height={height}
            fill={"white"}
          />
        </Mask>
        <Rect
          mask="url(#Mask)"
          x="0"
          y="0"
          width={windowWidth}
          height={height}
          fill={colorStepsGoal}
        />
        <Rect
          mask="url(#Mask)"
          x="0"
          y="0"
          width={windowWidth * newProgress}
          height={height}
          fill={colorNewSteps}
        />
        <Rect
          mask="url(#Mask)"
          x="0"
          y="0"
          width={windowWidth * contributedProgress}
          height={height}
          fill={colorStepsContributed}
        />
      </Svg>
      <View style={{ margin: 5, flexDirection: "row" }}>
        <View style={{ margin: 5, flexDirection: "column" }}>
          <Text style={{ color: colorStepsContributed, fontWeight: "bold" }}>
            &#9679; {contributedSteps}
          </Text>
          <Text style={{ color: colorNewSteps, fontWeight: "bold" }}>
            &#9679; {newSteps}
          </Text>
          <Text style={{ color: colorStepsGoal, fontWeight: "bold" }}>
            &#9679;{" "}
            <Text style={{ color: "#757575", fontWeight: "bold" }}>
              {stepsLeft}
            </Text>
          </Text>
        </View>
        <View style={{ margin: 5, flexDirection: "column" }}>
          <Text>steps already contributed</Text>
          <Text>new steps since last contribution</Text>
          <Text>steps left to reach your daily goal</Text>
        </View>
      </View>
    </View>
  );
}
