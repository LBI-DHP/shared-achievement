import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import { StatusBar } from "expo-status-bar";
import ChallengeScreen from "../screens/ChallengeScreen";
import { AppStateContext } from "./AppStateProvider";

export default function AppView() {
  const { userData, setUserData } = useContext(AppStateContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);

  useEffect(() => {
    if (userData.name !== null) {
      setIsUserNameSet(true);
    }
  }, []);

  return (
    <>
      <Header />
      <ChallengeScreen />
      <Navigation />
      <StatusBar />
    </>
  );
}
