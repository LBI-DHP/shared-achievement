// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useEffect, useContext } from "react";
import { Pedometer } from "expo-sensors";
import dataManager from "../DataManager";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";
import { Text, View } from "react-native";
import StepsBarChart from "./StepsBarChartRelative";
import ContributeButton from "./ContributeButton";
import { MaterialIcons } from "@expo/vector-icons";

export default function StepCounterPedometerIOS({ singleUser = false }) {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCountToday, setStepCountToday] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentStepCountAdded, setCurrentStepCountAdded] = useState(0);
  const [contributedSteps, setContributedSteps] = useState(0);
  const [newSteps, setNewSteps] = useState(null);
  const [goalSteps, setGoalSteps] = useState(0);
  const { userData } = useContext(UserDataContext);
  const { mode } = useContext(TeamDataContext);
  const {
    stepsPushedIndicator,
    setStepsPushedIndicator,
    midnightIndicator,
    appHasComeToForeground,
  } = useContext(UpdateContext);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isPedometerLoading, setIsPedometerLoading] = useState(true);

  useEffect(() => {
    setStepCountToday(dataManager.currentPlayerSteps + dataManager.currentPlayerNewSteps);
    setCurrentStepCountAdded(0);
    setNewSteps(dataManager.currentPlayerNewSteps);
    setIsApiLoading(false);
  }, [])

  const resetStepsAfterContribution = () => {
    setStepCountToday(0);
    setContributedSteps(0);
    setNewSteps(0);
    setCurrentStepCountAdded(0);
    setStepsPushedIndicator(!stepsPushedIndicator);
  };

  // TODO/To-do/TO-DO Changes for single User here
  if (singleUser || mode === "ABSOLUTE") {
    return (
      <>
        {!isPedometerAvailable && !isPedometerLoading && (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 2,
              justifyContent: "center",
              padding: 10,
            }}
          >
            <MaterialIcons name="error-outline" size={24} color="red" />
            <Text style={{ paddingLeft: 10 }}>
              Error: Step counter is not available. Please go to phone settings
              and give this app permission to record motion and fitness data.
            </Text>
          </View>
        )}
        <ContributeButton
          isErrorStepCounter={!isPedometerAvailable && !isPedometerLoading}
          isLoadingStepCounter={isApiLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  } else if (mode === "RELATIVE") {
    return (
      <>
        <StepsBarChart
          goalSteps={goalSteps}
          contributedSteps={contributedSteps}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
        />
        <ContributeButton
          isErrorStepCounter={!isPedometerAvailable && !isPedometerLoading}
          isLoadingStepCounter={isApiLoading || isPedometerLoading}
          newSteps={newSteps + (currentStepCount - currentStepCountAdded)}
          resetStepsAfterContribution={() => resetStepsAfterContribution()}
        />
      </>
    );
  }
  return null;
}
