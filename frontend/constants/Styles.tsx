import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  containerPaddingTop: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
  },
  heading: {
    fontSize: 40,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
  cardHeader: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  surface: {
    elevation: 4,
    borderRadius: 5,
  },
});
