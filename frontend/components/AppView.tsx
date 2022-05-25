import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import NavigationSettingsON from "./SABottomNavigationSettingsON";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "../screens/Welcome";
import ConnectToGoogleFit from "./ConnectToGoogleFit";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import { Platform } from "react-native";
import CenteredActivityIndicator from "./CenteredActivityIndicator";
import NoInternetConnection from "../screens/NoInternetConnection";

export default function AppView() {
  const {
    userData,
    updated,
    isUserDataLoading,
    userDataLoadingError,
    useGoogleFit,
  } = useContext(UserDataContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  const [isConnectedToGoogleFit, setIsConnectedToGoogleFit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    dataManager
      .getGoogleAuthInfo()
      .then((authInfo) => {
        if (authInfo != null && mounted) setIsConnectedToGoogleFit(true);
      })
      .finally(() => setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [updated]);

  useEffect(() => {
    if (userData && userData.username !== null) {
      setIsUserNameSet(true);
    }
  }, [userData]);

  if (isUserDataLoading || isLoading) return <CenteredActivityIndicator />;
  if (userDataLoadingError) return <NoInternetConnection />;

  if (!isUserNameSet) return <WelcomeScreen />;
  else if (
    (Platform.OS === "android" || useGoogleFit) &&
    !isConnectedToGoogleFit
  )
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
      {userData.showDeveloperSettings ? (
        <NavigationSettingsON />
      ) : (
        <Navigation />
      )}
      <StatusBar />
    </>
  );
}
