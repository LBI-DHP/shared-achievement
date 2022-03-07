import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "../screens/Welcome";
import ConnectToGoogleFit from "./ConnectToGoogleFit";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import { Platform } from "react-native";

export default function AppView() {
  const { userData, setUserData, updated } = useContext(UserDataContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  const [isConnectedToGoogleFit, setIsConnectedToGoogleFit] = useState(false);

  useEffect(() => {
    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null) setIsConnectedToGoogleFit(true);
    });
  }, [updated]);

  useEffect(() => {
    if (userData && userData.username !== null) {
      setIsUserNameSet(true);
    }
  }, [userData]);

  if (!isUserNameSet) return <WelcomeScreen />;
  else if (Platform.OS === "android" && !isConnectedToGoogleFit)
    return (
      <ConnectToGoogleFit
        setIsConnectedToGoogleFit={(data) => {
          setIsConnectedToGoogleFit(data);
        }}
      />
    );

  return (
    <>
      <Header />
      <Navigation />
      <StatusBar />
    </>
  );
}
