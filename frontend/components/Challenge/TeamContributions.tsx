import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, useWindowDimensions } from "react-native";
import { UserDataContext } from "../UserDataProvider";
import dataManager from "../DataManager";
import { Foundation } from "@expo/vector-icons";
import { UpdateContext } from "../UpdateProvider";

export default function TeamContributions() {
  const { userData, mode } = useContext(UserDataContext);
  const [teamMembersAndStepCountsOfToday, setTeamMembersAndStepCountsOfToday] =
    useState([]);
  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);
  const [elementWidth, setElementWidth] = useState(0);

  const { width } = useWindowDimensions();
  const windowWidth = width;
  const parentPadding = 1;
  const elementPadding = 5;
  const elementBoarder = 1;
  const elementMargin = 5;
  let elementSpaces = (elementBoarder + elementMargin) * 2;

  useEffect(() => {
    if (teamMembersAndStepCountsOfToday.length !== 0) {
      let elementMinInnerWidth = 75;
      let numOfElements = teamMembersAndStepCountsOfToday.length;
      let availableSpaceInParent = windowWidth - parentPadding * 2;
      let elementsPerRow = Math.floor(
        availableSpaceInParent / (elementMinInnerWidth + elementSpaces)
      );
      let numOfRows = numOfElements / elementsPerRow;
      if (!Number.isInteger(numOfRows)) numOfRows = Math.floor(numOfRows) + 1;
      if (numOfRows > 1 && numOfElements % elementsPerRow !== 0) {
        let numOfElementsLastRow = numOfElements % elementsPerRow;
        let emptyElementsInLastRow = elementsPerRow - numOfElementsLastRow;
        let emptyElementsPerRow = Math.floor(
          emptyElementsInLastRow / numOfRows
        );
        elementsPerRow = elementsPerRow - emptyElementsPerRow;
      } else if (numOfRows === 1) elementsPerRow = numOfElements;

      let availableSpacePerElement = availableSpaceInParent / elementsPerRow;
      if (!availableSpacePerElement)
        availableSpacePerElement = elementMinInnerWidth;

      setElementWidth(availableSpacePerElement - elementSpaces);
    }
  }, [teamMembersAndStepCountsOfToday]);

  useEffect(() => {
    let mounted = true;
    if (mode) {
      dataManager
        .getTeamMembersAndStepCountOfToday(userData.team)
        .then((teamMembersStepCountOfToday) => {
          if (mounted && teamMembersStepCountOfToday !== null)
            if (mode === "ABSOLUTE") {
              teamMembersStepCountOfToday.sort((a, b) =>
                a.sumSteps < b.sumSteps ? 1 : b.sumSteps < a.sumSteps ? -1 : 0
              );
            } else {
              teamMembersStepCountOfToday.sort((a, b) =>
                a.userProgress < b.userProgress
                  ? 1
                  : b.userProgress < a.userProgress
                  ? -1
                  : 0
              );
            }
          console.log(teamMembersStepCountOfToday);
          setTeamMembersAndStepCountsOfToday(teamMembersStepCountOfToday);
        });
    }
    return () => {
      mounted = false;
    };
  }, [apiReloadIndicator, stepsPushedIndicator, midnightIndicator, mode]);

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        padding: parentPadding,
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      {teamMembersAndStepCountsOfToday.map((member) => {
        return (
          <View
            style={
              member.username !== userData.username
                ? {
                    margin: elementMargin,
                    flexDirection: "column",
                    padding: elementPadding,
                    paddingBottom: 0,
                    borderWidth: elementBoarder,
                    borderColor: "#7ebdd8",
                    borderRadius: 5,
                    width: elementWidth,
                  }
                : {
                    margin: elementMargin,
                    flexDirection: "column",
                    padding: elementPadding - 1,
                    paddingBottom: 0,
                    borderWidth: elementBoarder + 1,
                    borderColor: "#7ebdd8",
                    backgroundColor: "#e6f7ff",
                    borderRadius: 5,
                    width: elementWidth,
                  }
            }
            key={member.username}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {mode === "ABSOLUTE"
                    ? member.sumSteps
                    : Math.round(member.userProgress * 100)}
                </Text>
                <Text>
                  {" "}
                  {mode === "ABSOLUTE" ? (
                    <Foundation name="foot" size={15} color="black" />
                  ) : (
                    "%"
                  )}
                </Text>
              </View>
              <ScrollView
                horizontal={true}
                style={{ paddingBottom: elementPadding }}
              >
                <Text
                  style={{
                    marginTop: -2,
                    color: "black",
                  }}
                >
                  {member.username === userData.username
                    ? member.username + " (me)"
                    : member.username}
                </Text>
              </ScrollView>
            </View>
          </View>
        );
      })}
    </View>
  );
}
