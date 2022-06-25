import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  containerPaddingTop: {
    padding: 20,
    marginTop: 20,
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
  header: {
    color: "white",
    textTransform: "uppercase",
    padding: 20,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    textAlign: "center",
  },

  surface: {
    elevation: 4,
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: "#3f5c7c",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
  },
  selectButtonInactive: {
    backgroundColor: "#b3b7bb",
    borderRadius: 3,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 10,
  },
  selectButtonText: {
    color: "white",
  },
  selectButtonGroup: {
    flexDirection: "row",
  },
});
