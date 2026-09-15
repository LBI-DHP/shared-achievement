/*
 * Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
 *
 * Licensed under the Apache License, Version 2.0 with the Commons Clause License
 * Condition v1.0 (the "License"); you may not use this file except in compliance
 * with the License. A copy of the License is distributed in the LICENSE file at
 * the root of this repository; the Apache License is also available at
 * http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
 * https://commonsclause.com/
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause
 */

// https://snack.expo.dev/@yoobit0616/pedometer-functional

import React, { useState, useContext, useEffect } from "react";
import dataManager from "../DataManager";
import { Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { UserDataContext } from "../../providers/UserDataProvider";
import { UpdateContext } from "../../providers/UpdateProvider";

import useHealthData from "../../hooks/useHealthData";

export default function ContributeButton({
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
            newSteps === 0 || isLoading || isApiLoading
        );
    }, [newSteps, isLoading, isApiLoading]);


    const resetStepsAfterContribution = () => {
        setContributedSteps(steps);
        setNewSteps(0);
        setStepsPushedIndicator(!stepsPushedIndicator);
    };

    return (
        <>
            <LinearGradient
                colors={isDisabled ? ["#6d6d6d", "#6d6d6d"] : ["#3f5c7c", "#558dad"]}
                style={style.contributeStepsButtonColor}
            >
                <TouchableOpacity
                    disabled={isDisabled}
                    style={style.contributeStepsButton}
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
                        <Text style={style.buttonText}>Contribute</Text>
                        <Text style={style.buttonStepsNumberText}>
                            {newSteps !== 0 ? newSteps : 0}
                        </Text>
                        <Text style={style.buttonText}>new steps</Text>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </>
    );
}


const style = StyleSheet.create({
    contributeStepsButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    contributeStepsButtonColor: {
      borderRadius: 5,
      margin: 10,
      padding: 10,
    },
    icons: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 10,
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: 15,
      fontWeight: "bold",
    },
    buttonStepsNumberText: {
      color: "white",
      textAlign: "center",
      textTransform: "uppercase",
      fontSize: 30,
      fontWeight: "bold",
    },
  });
  