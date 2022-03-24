import React from "react";
import { useWindowDimensions } from "react-native";
import Svg, { Rect, Mask } from "react-native-svg";

export default function TeamMemberBarChartRelative({
  goalSteps,
  contributedSteps,
}) {
  const { width } = useWindowDimensions();
  const windowWidth = width - 60;

  const colorStepsGoal = "#bebdbd";
  const colorStepsContributed = "#ffbb00";

  let progress = 0;

  if (contributedSteps > 0) {
    progress = contributedSteps / goalSteps;
  }

  return (
    <Svg
      height={10}
      width={windowWidth}
      viewBox={"0 0 " + windowWidth + " " + 10}
    >
      <Mask id="Mask" x="0" y="0" width={windowWidth} height="10">
        <Rect
          rx="5"
          ry="5"
          x="0"
          y="0"
          width={windowWidth}
          height="10"
          fill={"white"}
        />
      </Mask>
      <Rect
        mask="url(#Mask)"
        x="0"
        y="0"
        width={windowWidth}
        height="10"
        fill={colorStepsGoal}
      />
      <Rect
        mask="url(#Mask)"
        x="0"
        y="0"
        width={windowWidth * progress}
        height="10"
        fill={colorStepsContributed}
      />
    </Svg>
  );
}
