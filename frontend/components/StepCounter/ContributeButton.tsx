// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "./StepCounterStyles";
import { Foundation, FontAwesome } from "@expo/vector-icons";
import { UserDataContext } from "../UserDataProvider";

export default function ContributeButton({
  isLoadingStepCounter,
  newSteps,
  resetStepsAfterContribution,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData, updated, setUpdated } = useContext(UserDataContext);
  const disabled = newSteps === 0 || isLoading || isLoadingStepCounter;
  const [error, setError] = useState("");

  return (
    <TouchableOpacity
      disabled={disabled}
      style={
        disabled
          ? stepCounterStyles.contributeStepsButtonDisabled
          : stepCounterStyles.contributeStepsButton
      }
      onPress={() => {
        if (!isLoading) {
          setIsLoading(true);
          dataManager.pushSteps(userData.id, newSteps).then((worked) => {
            if (worked) {
              resetStepsAfterContribution();
              setUpdated(updated!);
            } else setError("true");
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
