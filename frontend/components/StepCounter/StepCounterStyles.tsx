import { StyleSheet } from "react-native";

export const colorStepsContributed = "#7ebdd8";
export const colorNewSteps = "#ffbb00";

export const style = StyleSheet.create({
  contributeStepsButton: {
    backgroundColor: colorNewSteps,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 10,
  },
  contributeStepsButtonDisabled: {
    backgroundColor: "#6d6d6d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 10,
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
