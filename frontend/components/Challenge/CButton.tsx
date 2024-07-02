// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext, useEffect } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { style as stepCounterStyles } from "../StepCounter/StepCounterStyles";
import { LinearGradient } from "expo-linear-gradient";

import { UserDataContext } from "../../providers/UserDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";

import useHealthData from "../../hooks/useHealthData";

export default function CButton({
}) {
    const { steps } = useHealthData();
    const [newSteps, setNewSteps] = useState(0);
    const [goalSteps, setGoalSteps] = useState(null);
    const [contributedSteps, setContributedSteps] = useState(0);
    const [isApiLoading, setIsApiLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { userData } = useContext(UserDataContext);
    const { stepsPushedIndicator, setStepsPushedIndicator } =
        useContext(UpdateContext);

    const [isDisabled, setIsDisabled] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;
        if (steps !== null && steps !== 0) {
            setIsApiLoading(true);
            dataManager.getUserChallengeData(userData.id).then((data) => {
                if (mounted) {
                    let userStepCount = data.total_steps;
                    if (userStepCount === undefined) userStepCount = 0;
                    const stepsNew = steps - userStepCount;
                    if (stepsNew > 0) setNewSteps(steps - userStepCount);
                    setContributedSteps(userStepCount);
                    if (data.goal) setGoalSteps(data.goal);
                    setIsApiLoading(false);
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, [steps]);

    useEffect(() => {
        setIsDisabled(
            newSteps === 0 || isLoading
        );
    }, [newSteps, isLoading]);


    const resetStepsAfterContribution = () => {
        setContributedSteps(steps);
        setNewSteps(0);
        setStepsPushedIndicator(!stepsPushedIndicator);
    };

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
