import * as React from "react";
import Svg, { Polygon, Path, Polyline, Circle, Mask } from "react-native-svg";
import Trees from "./Trees";

export default function Untersberg(props) {
  const {
    svgWidth,
    svgHeight,
    svgViewBoxWidth,
    svgViewBoxHeight,
    progressPosition,
    progressPercent,
  } = props;

  return (
    <Svg
      height={svgHeight}
      width={svgWidth}
      viewBox={"0 0 " + svgViewBoxWidth + " " + svgViewBoxHeight}
    >
      <Polygon
        fill="#979797"
        points="547 247 439.26 91 412.64 86 404.32 71 314.06 53 299.08 61 277.24 53 271.63 41 250.41 26 244.59 31 207.99 0 198 31 173.04 65 155.57 54 150.69 65.24 145.59 77 133.11 88 91.82 144.5 87.35 154 76.95 150 0 247 547 247"
      />
      <Polygon
        fill="#e0e0e0"
        points="283 55 287 73 299 81 306 64 315 78 332.88 88 345.92 88 352 79 365.9 88 388 84 402 93 409 91 426 96 435.05 90.21 412.64 86 404.32 71 314.06 53 299.08 61 283 55"
      />
      <Path
        fill="#e0e0e0"
        d="M198,31s9,6,11,7,6-13,6-13l14.54,6.53L237,34l9.64,2.8L250,29l6.36,1.2-6-4.2-5.82,5L208,0Z"
      />
      <Path
        fill="#7e7e7e"
        d="M150.69,65.24C152,69,166,91,166,91l5,25,11.92-20H198l16,12,16-51,16.64,36.36,9.72-1.83L298,130l-4.1-36.5L299,81l7-17,9,14,51,73V128l7-3,20.41,30.4L419,176l-1.74-20.6-16.05-38.9L398,96l31.64,32,5.41-37.79,4.21.79,92.19,133.49L547,247H0l77-97,10.4,4,58.24-77Z"
      />
      <Polygon
        fill="#666666"
        points="0 247 54 178 73 212 115.05 173 142 146 156 185 166 218 177.87 139.5 215 179 236 176 246.64 144 257.67 128 273.5 144 296 158.5 332 168.57 373.69 187.5 413.24 187.5 478 212 531.45 224.49 547 247 0 247"
      />
      <Path
        d={
          "M0 " +
          progressPosition +
          "H " +
          svgViewBoxWidth +
          " V " +
          svgViewBoxWidth +
          " H 0 L 0 " +
          progressPosition
        }
        fill="rgb(255, 255, 255, 0.2)"
      />
      <Path
        d={
          "M0 " +
          progressPosition +
          " " +
          svgViewBoxWidth +
          " " +
          progressPosition
        }
        strokeWidth="3"
        stroke="black"
      ></Path>
      <Trees />
      <Polyline
        stroke="black"
        strokeDasharray="10, 10"
        strokeWidth={2}
        points="256.5 61.5 207.99 0"
      />
      <Polyline
        stroke="black"
        strokeDasharray="10, 10"
        strokeWidth={2}
        points="179.5 123.5 256.5 61.5"
      />
      <Polyline
        stroke="black"
        strokeDasharray="10, 10"
        strokeWidth={2}
        points="336.5 184.5 179.5 123.5"
      />
      <Polyline
        stroke="black"
        strokeDasharray="10, 10"
        strokeWidth={2}
        points="237.5 246.5 336.5 184.5"
      />
      <Circle fill="black" cx="210.27" cy="5.5" r="5.5" />
      <Circle fill="black" cx="336.5" cy="184.5" r="5.5" />
      <Circle fill="black" cx="256.5" cy="61.5" r="5.5" />
      <Circle fill="black" cx="179.5" cy="123.5" r="5.5" />
      <Circle fill="black" cx="240" cy="241" r="5.5" />
    </Svg>
  );
}
