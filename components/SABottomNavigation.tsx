import * as React from "react";
import TeamScreen from "../screens/Team";
import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import { BottomNavigation } from "react-native-paper";

export default function SABottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "team", title: "Team", icon: "account-group" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    team: TeamScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
