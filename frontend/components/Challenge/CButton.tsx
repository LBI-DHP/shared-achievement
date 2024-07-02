// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "../StepCounter/StepCounterStyles";
import { LinearGradient } from "expo-linear-gradient";

import { UserDataContext } from "../../providers/UserDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";

import useHealthData from "../../hooks/useHealthData";

export default function CButton({
    //   isLoadingStepCounter,
    //   isErrorStepCounter,
    //   newSteps,
    //   resetStepsAfterContribution,
}) {
    const { steps } = useHealthData();
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useContext(UserDataContext);
    const { stepsPushedIndicator, setStepsPushedIndicator } =
        useContext(UpdateContext);

    const [isDisabled, setIsDisabled] = useState(true);
    const [error, setError] = useState("");

    //   useEffect(() => {
    //     setIsDisabled(
    //       newSteps === 0 || isLoading || isLoadingStepCounter || isErrorStepCounter
    //     );
    //   }, [newSteps, isLoading, isLoadingStepCounter]);

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
                            dataManager.pushSteps(userData.id, 0).then((worked) => { // 0 = newSteps
                                if (worked) {
                                    //   resetStepsAfterContribution();
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
                            {steps}
                            {/* {newSteps !== 0 ? newSteps : 0} */}
                        </Text>
                        <Text style={stepCounterStyles.buttonText}>new steps</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </>
    );
}
