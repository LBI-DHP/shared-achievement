import React from "react";
import { View, useWindowDimensions, Text } from "react-native";
import Svg, { Rect } from "react-native-svg";

export default function StepsBarChart({
  goalSteps,
  contributedSteps,
  newSteps,
}) {
  const { width } = useWindowDimensions();
  const windowWidth = width - 60;

  const colorStepsGoal = "#bebdbd";
  const colorStepsContributed = "#40d2ff";
  const colorNewSteps = "#167ef5";

  const height = 20;
  const offset = 15;

  let contributedProgress = 0;
  let newProgress = 0;

  if (contributedSteps > 0) {
    contributedProgress = contributedSteps / goalSteps;
    console.log(contributedProgress);
    if (windowWidth * contributedProgress < offset) {
      contributedProgress = offset / windowWidth;
      console.log(contributedProgress);
    }
  }

  if (newSteps > 0) {
    newProgress = newSteps / goalSteps;
    newProgress += contributedProgress;
    if (contributedSteps === 0 && windowWidth * newProgress < offset) {
      newProgress = offset / windowWidth;
    }
  }

  return (
    <View>
      <Svg
        style={{ margin: 10 }}
        height={height}
        width={windowWidth}
        viewBox={"0 0 " + windowWidth + " " + height}
      >
        <Rect
          x="0"
          y="0"
          ry={height / 2}
          rx={height / 2}
          width={windowWidth}
          height={height}
          fill={colorStepsGoal}
        />
        <Rect
          ry={height / 2}
          rx={height / 2}
          x="0"
          y="0"
          width={windowWidth * newProgress}
          height={height}
          fill={colorNewSteps}
        />
        <Rect
          x="0"
          y="0"
          ry={height / 2}
          rx={height / 2}
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
              {goalSteps - newSteps - contributedSteps}
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
