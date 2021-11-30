import "react-native-gesture-handler";
import * as React from "react";
import { Appbar, Avatar } from "react-native-paper";

export default function Header() {
  return (
    <Appbar.Header style={{ margin: 10 }}>
      <Avatar.Image size={40} source={require("../assets/images/grafik.png")} />
      <Appbar.Content
        title="Untersberg Challenge"
        subtitle="Shared Achievements"
      />
    </Appbar.Header>
  );
}
