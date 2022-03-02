import React, { useState, useContext, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import JoinOrCreateTeam from "../components/JoinOrCreateTeam";
import { UserDataContext } from "../components/UserDataProvider";
import TeamList from "../components/TeamList";
import { style } from "../constants/Styles";

export default function Team() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    setIsUserInATeam(userData.teamName !== null);
  }, [userData.teamName]);

  return (
    <ScrollView style={style.container}>
      {isUserInATeam ? <TeamList /> : <JoinOrCreateTeam />}
    </ScrollView>
  );
}
