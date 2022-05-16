// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext, useEffect } from "react";
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
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsDisabled(newSteps === 0 || isLoading || isLoadingStepCounter);
  }, [newSteps, isLoading, isLoadingStepCounter]);

  console.log("isLoadingStepCounter", isLoadingStepCounter);

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={
        isDisabled
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
