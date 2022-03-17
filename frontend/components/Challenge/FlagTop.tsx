import * as React from "react";
import Svg, { Polygon, Circle, Rect } from "react-native-svg";

export default function FlagTop(props) {
  const {
    svgWidth,
    svgHeight,
    svgViewBoxWidth,
    svgViewBoxHeight,
    progressPercent,
  } = props;

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight}
    >
      <Rect fill="black" x="207.63" y="1.27" width="1.27" height="31.73" />
      <Polygon
        fill={progressPercent === 1 ? "#1300bd" : "#a12b2b"}
        points="219.13 11.12 224.33 6.9 229.53 2.68 209.22 2.68 209.22 19.55 229.53 19.55 224.33 15.33 219.13 11.12"
      />
      <Circle fill="black" cx="208.27" cy="1.27" r="1.27" />
    </Svg>
  );
}
