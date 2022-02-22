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

  return (
    <View>
      <Svg
        style={{ margin: 10 }}
        height={50}
        width={windowWidth}
        viewBox={"0 0 " + windowWidth + " " + 50}
      >
        <Rect
          x="0"
          y="0"
          width={windowWidth}
          height="50"
          fill={colorStepsGoal}
        />
        <Rect
          x="0"
          y="0"
          width={windowWidth * (contributedSteps / goalSteps)}
          height="50"
          fill={colorStepsContributed}
        />
        <Rect
          x={windowWidth * (contributedSteps / goalSteps)}
          y="0"
          width={windowWidth * (newSteps / goalSteps)}
          height="50"
          fill={colorNewSteps}
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
          <Text>steps left to reach your goal</Text>
        </View>
      </View>
    </View>
  );
}
