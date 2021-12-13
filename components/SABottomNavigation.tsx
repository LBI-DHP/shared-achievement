import "react-native-gesture-handler";
import * as React from "react";
import GroupScreen from "../screens/Group";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import { BottomNavigation } from "react-native-paper";

export default function SABottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "group", title: "Group", icon: "account-group" },
    { key: "profile", title: "Profile", icon: "account-details" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    group: GroupScreen,
    profile: ProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
