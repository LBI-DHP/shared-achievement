import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import Navigation from "./SABottomNavigation";
import { StatusBar } from "expo-status-bar";
import WelcomeScreen from "../screens/Welcome";
import { UserDataContext } from "./UserDataProvider";
import { Keyboard } from "react-native";

export default function AppView() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  useEffect(() => {
    _subscribe();
    return _unsubscribe();
  }, []);

  let _subscription;

  const _subscribe = () => {
    // this.keyboardDidShowListener = Keyboard.addListener(
    //   "keyboardDidShow",
    //   this._keyboardDidShow
    // );
  };
  const _unsubscribe = () => {
    // this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener.remove();
  };

  useEffect(() => {
    if (userData.name !== null) {
      setIsUserNameSet(true);
    }
  }, [userData]);

  if (isUserNameSet) {
    return (
      <>
        <Header />
        <Navigation />
        <StatusBar />
      </>
    );
  }
  return <WelcomeScreen />;
}
