import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, useWindowDimensions } from "react-native";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import { Foundation } from "@expo/vector-icons";

export default function TeamContributions() {
  const { userData } = useContext(UserDataContext);
  const { mode, teamMembersAndStepCountOfToday } = useContext(TeamDataContext);
  const [elementWidth, setElementWidth] = useState(0);

  const { width } = useWindowDimensions();
  const windowWidth = width;
  const parentPadding = 1;
  const elementPadding = 5;
  const elementBoarder = 1;
  const elementMargin = 5;
  let elementSpaces = (elementBoarder + elementMargin) * 2;
  const colors = ["#CC6677", "#332288", "#DDCC77", "#44AA99"];

  function hexToRgba(hex, alpha) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  useEffect(() => {
    if (teamMembersAndStepCountOfToday.length !== 0) {
      let elementMinInnerWidth = 75;
      let numOfElements = teamMembersAndStepCountOfToday.length;
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
  }, [teamMembersAndStepCountOfToday]);

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
      {teamMembersAndStepCountOfToday.map((member) => {
        return (
          <View
            style={
              {
                margin: elementMargin,
                flexDirection: "column",
                padding: elementPadding - 1,
                paddingBottom: 0,
                borderWidth: elementBoarder + 1,
                borderColor: member.color,
                backgroundColor: hexToRgba(member.color, 0.1),
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
                <Text style={{ fontWeight: "bold", }}>
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
                  {member.username}
                </Text>
              </ScrollView>
            </View>
          </View>
        );
      })}
    </View>
  );
}
