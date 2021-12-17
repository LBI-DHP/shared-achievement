import * as React from "react";
import Svg, { Polygon } from "react-native-svg";

export default function SvgComponent(props) {
  return (
    <Svg
      height="247"
      width="547"
      viewBox="0 0 547 247"
      style={{ backgroundColor: "red", aspectRatio: 2.3238 }}
    >
      <Polygon
        fill="grey"
        stroke="none"
        strokeWidth="1"
        points="547 247 439.26 91 412.64 86 404.32 71 314.06 53 299.08 61 277.24 53 271.63 41 250.41 26 244.59 31 207.99 0 198 31 173.04 65 155.57 54 150.69 65.24 145.59 77 133.11 88 91.82 144.5 87.35 154 76.95 150 0 247 547 247"
      />
    </Svg>
  );
}
