import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../components/UserDataProvider";
import JoinOrCreateTeam from "../components/JoinOrCreateTeam";
import TeamStatistics from "../components/TeamStatistics";

export default function Team() {
  const { userData } = useContext(UserDataContext);
  const [isUserInATeam, setIsUserInATeam] = useState(false);

  useEffect(() => {
    if (userData.teamName === null) setIsUserInATeam(false);
    else setIsUserInATeam(true);
  }, [userData]);

  if (isUserInATeam) {
    return <TeamStatistics />;
  }
  return <JoinOrCreateTeam />;
}
