import * as React from "react";
import Svg, { Polygon, Path, Polyline, Circle, Text } from "react-native-svg";
import Trees from "./Trees";

export default function Untersberg(props) {
  const {
    svgWidth,
    svgHeight,
    svgViewBoxWidth,
    svgViewBoxHeight,
    progressPosition,
    progressPercent,
    mode,
    teamAbsoluteStepCountToday,
  } = props;

  const startPoint = { x: 217, y: 237 };
  const pointFirstQuarter = { x: 140, y: 179.6 };
  const pointSecondQuarter = { x: 164.2, y: 122.25 };
  const pointThirdQuarter = { x: 255, y: 64.9 };
  const pointFourthQuarter = { x: 209.5, y: 7.5 };

  const lineFirstQuarter = {
    x1: startPoint.x,
    y1: startPoint.y,
    x2: pointFirstQuarter.x,
    y2: pointFirstQuarter.y,
  };
  const lineSecondQuarter = {
    x1: pointFirstQuarter.x,
    y1: pointFirstQuarter.y,
    x2: pointSecondQuarter.x,
    y2: pointSecondQuarter.y,
  };
  const lineThirdQuarter = {
    x1: pointSecondQuarter.x,
    y1: pointSecondQuarter.y,
    x2: pointThirdQuarter.x,
    y2: pointThirdQuarter.y,
  };
  const lineFourthQuarter = {
    x1: pointThirdQuarter.x,
    y1: pointThirdQuarter.y,
    x2: pointFourthQuarter.x,
    y2: pointFourthQuarter.y,
  };

  const lineProgress = {
    x1: 0,
    y1: progressPosition,
    x2: svgViewBoxWidth,
    y2: progressPosition,
  };

  let point;
  let lineStart;

  if (progressPercent <= 0.25) {
    point = lineIntersect(lineFirstQuarter, lineProgress);
    lineStart = { x: lineFirstQuarter.x1, y: lineFirstQuarter.y1 };
  } else if (progressPercent <= 0.5) {
    point = lineIntersect(lineSecondQuarter, lineProgress);
    lineStart = { x: lineSecondQuarter.x1, y: lineSecondQuarter.y1 };
  } else if (progressPercent <= 0.75) {
    point = lineIntersect(lineThirdQuarter, lineProgress);
    lineStart = { x: lineThirdQuarter.x1, y: lineThirdQuarter.y1 };
  } else {
    point = lineIntersect(lineFourthQuarter, lineProgress);
    lineStart = { x: lineFourthQuarter.x1, y: lineFourthQuarter.y1 };
  }

  if (point.y < pointFourthQuarter.y) point = pointFourthQuarter;

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
      <Path
        fill="#7e7e7e"
        d="M531.45,224.49,439.26,91l-4.21-.79L429.64,128,398,96l3.21,20.5,16.05,38.9L419,176l-25.59-20.6L373,125l-7,3v23L315,78l-9-14-7,17-5.1,12.5L298,130,256.36,91.53l-9.72,1.83L230,57l-16,51L198,96H182.92L171,116l-5-25s-14-22-15.31-25.76L145.59,77,133.11,88,91.82,144.5,87.35,154,77,150,0,247H547Z"
      />
      <Polygon
        fill="#666666"
        points="0 247 54 178 73 212 115.05 173 142 146 156 185 166 218 177.87 139.5 215 179 236 176 246.64 144 257.67 128 273.5 144 296 158.5 332 168.57 373.69 187.5 413.24 187.5 478 212 531.45 224.49 547 247 0 247"
      />
      <Polygon
        fill="#e0e0e0"
        points="283 55 287 73 299 81 306 64 315 78 332.88 88 345.92 88 352 79 365.9 88 388 84 402 93 409 91 426 96 435.05 90.21 412.64 86 404.32 71 314.06 53 299.08 61 283 55"
      />
      <Path
        fill="#e0e0e0"
        d="M198,31s9,6,11,7,6-13,6-13l14.54,6.53L237,34l9.64,2.8L250,29l6.36,1.2-6-4.2-5.82,5L208,0Z"
      />
      <Polyline
        stroke={"black"}
        strokeDasharray={progressPercent >= 1 ? "" : "10, 10"}
        strokeWidth={2.5}
        points={
          lineFourthQuarter.x1 +
          " " +
          lineFourthQuarter.y1 +
          " " +
          lineFourthQuarter.x2 +
          " " +
          lineFourthQuarter.y2
        }
      />
      <Polyline
        stroke={"black"}
        strokeDasharray={progressPercent >= 0.75 ? "" : "10, 10"}
        strokeWidth={2.5}
        points={
          lineThirdQuarter.x1 +
          " " +
          lineThirdQuarter.y1 +
          " " +
          lineThirdQuarter.x2 +
          " " +
          lineThirdQuarter.y2
        }
      />
      <Polyline
        stroke={"black"}
        strokeDasharray={progressPercent >= 0.5 ? "" : "10, 10"}
        strokeWidth={2.5}
        points={
          lineSecondQuarter.x1 +
          " " +
          lineSecondQuarter.y1 +
          " " +
          lineSecondQuarter.x2 +
          " " +
          lineSecondQuarter.y2
        }
      />
      <Polyline
        stroke={"black"}
        strokeDasharray={progressPercent >= 0.25 ? "" : "10, 10"}
        strokeWidth={2.5}
        points={
          lineFirstQuarter.x1 +
          " " +
          lineFirstQuarter.y1 +
          " " +
          lineFirstQuarter.x2 +
          " " +
          lineFirstQuarter.y2
        }
      />
      <Polyline
        stroke={"black"}
        strokeWidth={2.5}
        points={lineStart.x + " " + lineStart.y + " " + point.x + " " + point.y}
      />
      <Circle
        fill={progressPercent >= 1 ? "black" : "#e0e0e0"}
        stroke={"black"}
        strokeWidth="2.5"
        cx={pointFourthQuarter.x}
        cy={pointFourthQuarter.y}
        r="5.5"
      />
      <Circle
        fill={progressPercent >= 0.75 ? "black" : "#979797"}
        stroke={"black"}
        strokeWidth="2.5"
        cx={pointThirdQuarter.x}
        cy={pointThirdQuarter.y}
        r="5.5"
      />
      <Circle
        fill={progressPercent >= 0.5 ? "black" : "#7e7e7e"}
        stroke={"black"}
        strokeWidth="2.5"
        cx={pointSecondQuarter.x}
        cy={pointSecondQuarter.y}
        r="5.5"
      />
      <Circle
        fill={progressPercent >= 0.25 ? "black" : "#666666"}
        stroke={"black"}
        strokeWidth="2.5"
        cx={pointFirstQuarter.x}
        cy={pointFirstQuarter.y}
        r="5.5"
      />
      <Circle
        fill="black"
        stroke={"black"}
        strokeWidth="2.5"
        cx={startPoint.x}
        cy={startPoint.y}
        r="5.5"
      />
      <Polyline
        stroke={progressPercent != 1 ? "white" : "none"}
        strokeWidth={1}
        points={
          lineProgress.x1 +
          " " +
          lineProgress.y1 +
          " " +
          lineProgress.x2 +
          " " +
          lineProgress.y2
        }
      />
      <Trees />
      <Text
        fontSize={20}
        fontWeight="bold"
        fill={progressPercent === 1 ? "none" : "white"}
        x={25}
        y={
          progressPercent <= 0.85
            ? progressPosition - 10
            : progressPosition + 25
        }
      >
        {mode === "RELATIVE" && Math.round(progressPercent * 100) + "%"}
        {mode === "ABSOLUTE" && teamAbsoluteStepCountToday + " steps"}
      </Text>
      <Circle
        fill={progressPercent != 1 ? "#004A99" : "none"}
        stroke={progressPercent != 1 ? "white" : "none"}
        strokeWidth="2.5"
        cx={point.x}
        cy={point.y}
        r="6"
      />
    </Svg>
  );
}

function lineIntersect(line1, line2) {
  return lineIntersectPoints(
    line1.x1,
    line1.y1,
    line1.x2,
    line1.y2,
    line2.x1,
    line2.y1,
    line2.x2,
    line2.y2
  );
}

function lineIntersectPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
  var ua,
    ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
  };
}
