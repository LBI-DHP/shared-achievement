import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../components/UserDataProvider";
import JoinOrCreateTeam from "../components/JoinOrCreateTeam";
import TeamStatistics from "../components/TeamStatistics";
import Challenge from "../components/Challenge";
import { View } from "react-native";
import { style } from "../constants/Styles";

export default function Team() {
  const { userData } = useContext(UserDataContext);
  const [isUserInATeam, setIsUserInATeam] = useState(false);

  useEffect(() => {
    if (userData.teamName === null) setIsUserInATeam(false);
    else setIsUserInATeam(true);
  }, [userData]);

  return (
    <View style={style.container}>
      <Challenge />
      {isUserInATeam ? <TeamStatistics /> : <JoinOrCreateTeam />}
    </View>
  );
}
