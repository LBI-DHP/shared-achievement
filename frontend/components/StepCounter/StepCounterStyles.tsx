import { StyleSheet } from "react-native";

export const colorStepsContributed = "#7ebdd8";
export const colorNewSteps = "#ffbb00";

export const style = StyleSheet.create({
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
  stepsNew: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorNewSteps,
  },
  stepsContributed: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorStepsContributed,
  },
  absoluteView: {
    padding: 10,
    flexDirection: "row",
  },
});
