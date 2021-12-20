import * as React from "react";
import Svg, { Circle, Polyline } from "react-native-svg";

export default function PathUp(props) {
  const {
    svgWidth,
    svgHeight,
    svgViewBoxWidth,
    svgViewBoxHeight,
    progressPosition,
  } = props;

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight}
    >
      <Polyline points="237.5 246.5 336.5 184.5 179.5 123.5 256.5 61.5 207.99 0" />
      <Circle fill="red" cx="336.5" cy="184.5" r="5.5" />
      <Circle fill="red" cx="179.5" cy="123.5" r="5.5" />
      <Circle fill="red" cx="237.5" cy="246.5" r="5.5" />
      <Circle fill="red" cx="256.5" cy="61.5" r="5.5" />
    </Svg>
  );
}
