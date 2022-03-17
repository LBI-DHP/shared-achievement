import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import Untersberg from "./Untersberg";
import UntersbergHidden from "./UntersbergHidden";
import Clouds from "./Clouds";
import FlagTop from "./FlagTop";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";

export default function Challenge({ isUserInATeam }) {
  const { userData, updated, setMode, mode } = useContext(UserDataContext);
  const [teamRelativeStepCountToday, setTeamRelativeStepCountToday] =
    useState(0);
  const [teamAbsoluteStepCountToday, setTeamAbsoluteStepCountToday] =
    useState(0);

  useEffect(() => {
    let mounted = true;
    if (isUserInATeam) {
      dataManager
        .getTeamChallengeData(userData.team)
        .then((data) => {
          if (userData.team != null && mounted) console.log("Team data", data);
          setTeamRelativeStepCountToday(data.progress / 100);
          setTeamAbsoluteStepCountToday(data.total_steps);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => {
      mounted = false;
    };
  }, [updated, userData.team, mode]);

  const progress = teamRelativeStepCountToday;
  const { height, width } = useWindowDimensions();
  const windowHeight = height;
  const windowWidth = width - 60;

  let untersbergSvgWidth;
  let untersbergSvgHeight;
  let flagSvgHeight;

  const untersbergSvgViewBoxWidth = 547;
  const untersbergSvgViewBoxHeight = 247;
  const flagSvgViewBoxHeight = 33;

  const untersbergRelation =
    untersbergSvgViewBoxWidth / untersbergSvgViewBoxHeight;
  const flagRelation = untersbergSvgViewBoxWidth / flagSvgViewBoxHeight;

  if (windowWidth > windowHeight) {
    untersbergSvgWidth = windowHeight / 1.5;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  } else {
    untersbergSvgWidth = windowWidth;
    untersbergSvgHeight = untersbergSvgWidth / untersbergRelation;
    flagSvgHeight = untersbergSvgWidth / flagRelation;
  }

  const progressPosition =
    untersbergSvgViewBoxHeight -
    10 -
    (untersbergSvgViewBoxHeight - 10 - 7.5) * progress;

  if (!isUserInATeam) {
    return (
      <View
        style={{
          paddingTop: 10,
          height:
            untersbergSvgHeight +
            untersbergSvgHeight / 3.5 +
            flagSvgHeight +
            10,
          margin: 10,
          backgroundColor: "#99bfcf",
          justifyContent: "flex-end",
        }}
      >
        <UntersbergHidden
          svgWidth={untersbergSvgWidth}
          svgHeight={untersbergSvgHeight}
          svgViewBoxWidth={untersbergSvgViewBoxWidth}
          svgViewBoxHeight={untersbergSvgViewBoxHeight}
        />
        <View style={style.containerAbsolute}>
          <Text style={style.bigText}>?</Text>
          <Text style={style.smallText}>
            Join a team to reveal the challenge.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Clouds
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight / 3.5}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight / 3.5}
      />
      <FlagTop
        svgWidth={untersbergSvgWidth}
        svgHeight={flagSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={flagSvgViewBoxHeight}
        progressPercent={progress}
      />
      <Untersberg
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight}
        progressPosition={progressPosition}
        progressPercent={progress}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#99bfcf",
    margin: 10,
    justifyContent: "flex-end",
  },
  containerAbsolute: {
    width: "100%",

    paddingBottom: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bigText: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  smallText: {
    color: "white",
    fontWeight: "bold",
  },
});
