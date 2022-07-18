import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import NavigationSettingsON from "./SABottomNavigationSettingsON";
import SingleChallenge from "../screens/SingleChallenge";
import WelcomeScreen from "../screens/Welcome";
import ConnectToGoogleFit from "./ConnectToGoogleFit";
import { UserDataContext } from "../providers/UserDataProvider";
import { Platform } from "react-native";
import CenteredActivityIndicator from "./CenteredActivityIndicator";
import NoInternetConnection from "../screens/NoInternetConnection";

export default function AppView() {
  const {
    userData,
    isUserDataLoading,
    userDataLoadingError,
    useGoogleFit,
    isConnectedToGoogleFit,
    setIsConnectedToGoogleFit,
  } = useContext(UserDataContext);

  const isSingleUser = true;

  if (isUserDataLoading) return <CenteredActivityIndicator />;
  if (userDataLoadingError) return <NoInternetConnection />;

  if (!userData.username) return <WelcomeScreen isSingleUser={isSingleUser} />;
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
  else if (userData.showDeveloperSettings) {
    return (
      <>
        <Header />
        <NavigationSettingsON />
      </>
    );
  } else if (isSingleUser) {
    return (
      <>
        <Header />
        <SingleChallenge />
      </>
    );
  } else
    return (
      <>
        <Header />
        <Navigation />
      </>
    );
}
