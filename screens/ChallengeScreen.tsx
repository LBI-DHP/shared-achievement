import "react-native-gesture-handler";
import * as React from "react";

import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

export default function ChallengeScreen({ navigation }) {
  return (
    <View style={style.container}>
      <Image
        style={style.titleImage}
        source={require("../assets/images/aaa-untersberg-100_1920x1080.jpg")}
      />
      {/* <Text>Challenge Screen</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => navigation.navigate("Details")}
      >
        Details
      </Button> */}
    </View>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontWeight: "bold",
    padding: 10,
  },
  titleImage: {
    alignItems: "center",
    textAlign: "center",
    resizeMode: "center",
    width: "100%",
  },
});
