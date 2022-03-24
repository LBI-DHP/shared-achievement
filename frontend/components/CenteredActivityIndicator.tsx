import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function CenteredActivityIndicator({ height = null }) {
  if (height === null) height = "100%";
  return (
    <View
      style={{
        height: height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#3f5c7c" />
    </View>
  );
}
