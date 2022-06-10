import React, { useEffect } from "react";
import ChallengeScreen from "../screens/Challenge";
import TeamScreen from "../screens/Team";
import SettingsScreen from "../screens/Settings";
import { BottomNavigation } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";

export default function SABottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "challenge", title: "Challenge", icon: "image-filter-hdr" },
    { key: "team", title: "Team", icon: "account-group" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);
  const { navigationIndex, setNavigationIndex } =
    React.useContext(UserDataContext);

  useEffect(() => {
    if (navigationIndex) {
      setIndex(navigationIndex);
    }
  }, [navigationIndex]);

  const renderScene = BottomNavigation.SceneMap({
    challenge: ChallengeScreen,
    team: TeamScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex) => {
        setIndex(newIndex);
        setNavigationIndex(newIndex);
      }}
      renderScene={renderScene}
    />
  );
}
