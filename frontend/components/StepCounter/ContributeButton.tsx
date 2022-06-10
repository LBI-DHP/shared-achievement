// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext, useEffect } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "./StepCounterStyles";
import { Foundation, FontAwesome } from "@expo/vector-icons";
import { UserDataContext } from "../UserDataProvider";
import { UpdateContext } from "../UpdateProvider";

export default function ContributeButton({
  isLoadingStepCounter,
  isErrorStepCounter,
  newSteps,
  resetStepsAfterContribution,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(UserDataContext);
  const { stepsPushedIndicator, setStepsPushedIndicator } =
    useContext(UpdateContext);

  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsDisabled(
      newSteps === 0 || isLoading || isLoadingStepCounter || isErrorStepCounter
    );
  }, [newSteps, isLoading, isLoadingStepCounter]);

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
              setStepsPushedIndicator(!stepsPushedIndicator);
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
      <Text style={stepCounterStyles.buttonText}>
        Contribute {newSteps !== 0 && newSteps} new steps
      </Text>
    </TouchableOpacity>
  );
}
TouchableOpacity;
