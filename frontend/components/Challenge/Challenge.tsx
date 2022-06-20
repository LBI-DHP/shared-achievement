import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text, useWindowDimensions } from "react-native";
import Untersberg from "./Untersberg";
import UntersbergHidden from "./UntersbergHidden";
import Clouds from "./Clouds";
import FlagTop from "./FlagTop";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";

export default function Challenge() {
  const { userData, isUserDataLoading } = useContext(UserDataContext);
  const { isUserInATeam, mode, teamChallengeData } =
    useContext(TeamDataContext);
  const [teamRelativeStepCountToday, setTeamRelativeStepCountToday] =
    useState(0);
  const [teamAbsoluteStepCountToday, setTeamAbsoluteStepCountToday] =
    useState(0);
  const [teamAbsoluteStepGoal, setTeamAbsoluteStepGoal] = useState(0);

  useEffect(() => {
    if (!isUserDataLoading && isUserInATeam) {
      setTeamRelativeStepCountToday(teamChallengeData.progress / 100);
      setTeamAbsoluteStepCountToday(teamChallengeData.totalSteps);
      setTeamAbsoluteStepGoal(teamChallengeData.teamMembersGoal);
    }
  }, [
    teamChallengeData.totalSteps,
    teamChallengeData.progress,
    teamChallengeData.teamMembersGoal,
  ]);

  const { height, width } = useWindowDimensions();
  const windowHeight = height;
  const windowWidth = width;

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
  let progressPosition = 0;

  if (teamRelativeStepCountToday >= 1) {
    progressPosition =
      untersbergSvgViewBoxHeight - 10 - (untersbergSvgViewBoxHeight - 10 - 7.5);
  } else {
    progressPosition =
      untersbergSvgViewBoxHeight -
      10 -
      (untersbergSvgViewBoxHeight - 10 - 7.5) * teamRelativeStepCountToday;
  }

  if (!userData.team) {
    return (
      <View
        style={{
          height:
            untersbergSvgHeight +
            untersbergSvgHeight / 3.5 +
            flagSvgHeight +
            10,
          backgroundColor: "#99bfcf",
          justifyContent: "flex-end",
          alignItems: "center",
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
        progressPercent={teamRelativeStepCountToday}
        teamAbsoluteStepGoal={teamAbsoluteStepGoal}
        mode={mode}
      />
      <Untersberg
        svgWidth={untersbergSvgWidth}
        svgHeight={untersbergSvgHeight}
        svgViewBoxWidth={untersbergSvgViewBoxWidth}
        svgViewBoxHeight={untersbergSvgViewBoxHeight}
        progressPosition={progressPosition}
        progressPercent={teamRelativeStepCountToday}
        mode={mode}
        teamAbsoluteStepCountToday={teamAbsoluteStepCountToday}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: "#99bfcf",
    justifyContent: "flex-end",
    marginBottom: 10,
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
