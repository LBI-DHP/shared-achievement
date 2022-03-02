import * as React from "react";
import HomeScreen from "../screens/Home";
import TeamScreen from "../screens/Team";
import SettingsScreen from "../screens/Settings";
import { BottomNavigation } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";

export default function SABottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "home", title: "Home", icon: "image-filter-hdr" },
    { key: "team", title: "Team", icon: "account-group" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);
  const { updated, setUpdated } = React.useContext(UserDataContext);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    team: TeamScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex) => {
        setUpdated(!updated);
        setIndex(newIndex);
      }}
      renderScene={renderScene}
    />
  );
}
