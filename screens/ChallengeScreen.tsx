import "react-native-gesture-handler";
import * as React from "react";

import { View, Image } from "react-native";
import { style } from "../constants/Styles";

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
