import React, { useState, useEffect } from "react";
import { ScrollView, Keyboard, Platform } from "react-native";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge";
// @ts-ignore
import StepCounter from "../components/StepCounter";

export default function Home() {
  const [isKeyboardOpen, setIsKeyBoardOpen] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardOpen(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <ScrollView style={style.container}>
      {!(Platform.OS === "ios" && isKeyboardOpen) && <Challenge />}
      <StepCounter />
    </ScrollView>
  );
}
