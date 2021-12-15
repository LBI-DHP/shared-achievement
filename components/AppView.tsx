import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import { StatusBar } from "expo-status-bar";
import ChallengeScreen from "../screens/Challenge";
import WelcomeScreen from "../screens/Welcome";
import { UserDataContext } from "./UserDataProvider";

export default function AppView() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);

  useEffect(() => {
    if (userData.name !== null) {
      setIsUserNameSet(true);
    }
  }, [userData]);

  if (isUserNameSet) {
    return (
      <>
        <Header />
        <ChallengeScreen />
        <Navigation />
        <StatusBar />
      </>
    );
  }
  return <WelcomeScreen />;
}
