import React, { useContext  } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import NavigationSettingsON from "./SABottomNavigationSettingsON";
import SingleChallenge from "../screens/SingleChallenge";
import WelcomeScreen from "../screens/Welcome";
import { UserDataContext } from "../providers/UserDataProvider";
import CenteredActivityIndicator from "./CenteredActivityIndicator";
import NoInternetConnection from "../screens/NoInternetConnection";

export default function AppView() {
  const {
    userData,
    isUserDataLoading,
    userDataLoadingError,
  } = useContext(UserDataContext);

  const isSingleUser = false;

  if (isUserDataLoading) return <CenteredActivityIndicator />;
  if (userDataLoadingError) return <NoInternetConnection />;

  if (!userData.username) return <WelcomeScreen isSingleUser={isSingleUser} />;
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
