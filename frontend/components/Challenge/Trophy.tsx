import * as React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function Trophy() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#99bfcf",
        borderRadius: 15,
        backgroundColor: "white",
        width: 32,
        padding: 5,
        marginLeft: 18,
        marginTop: 17,
        marginBottom: -50,
        zIndex: 100,
      }}
    >
      <MaterialCommunityIcons name="trophy" size={20} color="#ffae00" />
    </View>
  );
}
