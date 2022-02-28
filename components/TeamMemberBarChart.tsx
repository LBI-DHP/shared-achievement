import React from "react";
import { View, useWindowDimensions, Text } from "react-native";
import Svg, { Rect } from "react-native-svg";

export default function TeamMemberBarChart({ goalSteps, contributedSteps }) {
  const { width } = useWindowDimensions();
  const windowWidth = width - 40;

  const colorStepsGoal = "#bebdbd";
  const colorStepsContributed = "#ffbb00";

  let progress = 0;
  const offset = 5.5;

  if (contributedSteps > 0) {
    progress = contributedSteps / goalSteps;
    if (windowWidth * progress < offset) {
      progress = offset / windowWidth;
    }
  }

  return (
    <Svg
      height={10}
      width={windowWidth}
      viewBox={"0 0 " + windowWidth + " " + 10}
    >
      <Rect
        rx="5"
        ry="5"
        x="0"
        y="0"
        width={windowWidth}
        height="10"
        fill={colorStepsGoal}
      />
      <Rect
        rx="5"
        ry="5"
        x="0"
        y="0"
        width={windowWidth * progress}
        height="10"
        fill={colorStepsContributed}
      />
    </Svg>
  );
}
