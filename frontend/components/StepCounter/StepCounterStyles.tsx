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
  contributeStepsButton: {
    backgroundColor: colorNewSteps,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  contributeStepsButtonDisabled: {
    backgroundColor: "#6d6d6d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  icons: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 15,
    fontWeight: "bold",
    padding: 25,
  },
});
