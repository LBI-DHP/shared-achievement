import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  surfaceAbs: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 10,
  },
  surfaceRel: {
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 10,
  },
  viewRel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
