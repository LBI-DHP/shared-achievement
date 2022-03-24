// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "./StepCounterStyles";
import { Foundation, FontAwesome } from "@expo/vector-icons";

export default function ContributeButton({
  newSteps,
  userData,
  resetStepsAfterContribution,
  setError,
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <TouchableOpacity
      disabled={newSteps === 0 || isLoading}
      style={
        newSteps === 0
          ? stepCounterStyles.contributeStepsButtonDisabled
          : stepCounterStyles.contributeStepsButton
      }
      onPress={() => {
        if (!isLoading) {
          setIsLoading(true);
          dataManager.pushSteps(userData.id, newSteps).then((worked) => {
            if (worked) resetStepsAfterContribution();
            else setError(true);
            setIsLoading(false);
          });
        }
      }}
    >
      <View style={stepCounterStyles.icons}>
        <FontAwesome
          style={{ marginRight: 5 }}
          name="plus"
          size={15}
          color="white"
        />
        <Foundation name="foot" size={30} color="white" />
      </View>
      <Text style={stepCounterStyles.buttonText}>Contribute new steps</Text>
    </TouchableOpacity>
  );
}
TouchableOpacity;
