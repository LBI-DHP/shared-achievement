// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext, useEffect } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "./StepCounterStyles";
import { LinearGradient } from "expo-linear-gradient";

import { UserDataContext } from "../../provider/UserDataProvider";
import { UpdateContext } from "../../provider/UpdateProvider";

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
    <>
      <LinearGradient
        colors={isDisabled ? ["#6d6d6d", "#6d6d6d"] : ["#3f5c7c", "#558dad"]}
        style={stepCounterStyles.contributeStepsButtonColor}
      >
        <TouchableOpacity
          disabled={isDisabled}
          style={stepCounterStyles.contributeStepsButton}
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
          <View>
            <Text style={stepCounterStyles.buttonText}>Contribute</Text>
            <Text style={stepCounterStyles.buttonStepsNumberText}>
              {newSteps !== 0 ? newSteps : 0}
            </Text>
            <Text style={stepCounterStyles.buttonText}>new steps</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}
