import React, { useContext, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  Keyboard,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../providers/UserDataProvider";
import * as Device from "expo-device";

export default function Welcome({ isSingleUser }) {
  const { userData, setUserData, setUseGoogleFit } =
    useContext(UserDataContext);
  const [userName, setUserName] = useState("");
  const [averageSteps, setAverageSteps] = useState(null);

  const [error, setError] = useState("");
  const [isGoogleFitSelected, setIsGoogleFitSelected] = useState(false);
  const [isKeyboardOpenOnAverageSteps, setIsKeyboardOpenOnAverageSteps] =
    useState(false);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpenOnAverageSteps(false);
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

  return (
    <ScrollView style={{ marginTop: 20 }}>
      <View style={style.containerPaddingTop}>
        {!(isKeyboardOpenOnAverageSteps && Platform.OS === "ios") && (
          <>
            <Text style={style.heading}>Hey there! 👋</Text>
            <Text style={style.subheading}>
              We are excited that you want to face a challenge. But first,
              please enter the following information:{" "}
            </Text>
            <TextInput
              style={
                Platform.OS === "ios"
                  ? { marginBottom: 20 }
                  : { marginBottom: 10 }
              }
              label="username"
              value={userName}
              multiline={false}
              // autoComplete={false}
              onChangeText={(text) => setUserName(text)}
              mode="outlined"
            />
          </>
        )}
        <Text style={style.subheading}>How should we count your steps?</Text>
        <Text>
          Using the iPhone pedometer does not require any setup, but if you want
          to connect other devices for step counting (e.g. a smartwatch), you
          need to connect them via Google Fit.
        </Text>
        <View style={style.selectButtonGroup}>
          <TouchableOpacity
            onPress={() => {
              setIsGoogleFitSelected(false);
            }}
            style={
              isGoogleFitSelected
                ? style.selectButtonInactive
                : style.selectButton
            }
          >
            <Text style={style.selectButtonText}>iPhone Pedometer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsGoogleFitSelected(true);
            }}
            style={
              isGoogleFitSelected
                ? style.selectButton
                : style.selectButtonInactive
            }
          >
            <Text style={style.selectButtonText}>Google Fit</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          label="Average steps per day*"
          mode="outlined"
          value={averageSteps}
          multiline={false}
          // autoComplete={false}
          onFocus={() => {
            setIsKeyboardOpenOnAverageSteps(true);
          }}
          onChangeText={(text) => {
            let number = text.replace(/\D/g, "");
            setAverageSteps(number);
          }}
        />
        {isGoogleFitSelected || Platform.OS === "android" ? (
          <Text style={{ margin: 5 }}>
            * please check this in Google Fit (already connected to all the
            devices you want to use for step counting)
          </Text>
        ) : (
          <Text style={{ margin: 5 }}>
            * please check this in Apple Health (without other devices connected
            for step counting)
          </Text>
        )}
        <Button
          style={{ marginTop: 20 }}
          mode="contained"
          disabled={
            userName.length < 2 || averageSteps === null || averageSteps < 100
          }
          onPress={() => {
            const newUserData = {
              ...userData,
              username: userName,
              targetGoal: averageSteps * 1.1,
              device: Device.modelName,
              operatingSystem: Device.osName,
              operatingSystemVersion: Device.osVersion,
              averageSteps: averageSteps,
            };

            setError("");

            dataManager.registerUser(newUserData).then((data) => {
              if (data === -1) {
                setError("🚨 Error: Please check your internet connection.");
              } else if (data === -2) {
                setError(
                  "Sorry, this username is already taken. Please try another name."
                );
              } else if (data === null) {
                setError(
                  "🚨 Internal Server Error: Please try again or contact the administrator."
                );
              } else {
                setUserData(data);
                setUseGoogleFit(
                  isGoogleFitSelected || Platform.OS === "android"
                );
                dataManager.setUseGoogleFit(
                  isGoogleFitSelected || Platform.OS === "android"
                );
              }
            });

            // if (isSingleUser) {
            //   dataManager.createNewTeam({
            //     name: newUserData.username + "_team",
            //     progressCalculationMode: "ABSOLUTE",
            //   });
            //   // TODO/To-do/TO-DO create and join that team
            // }
          }}
        >
          Get started
        </Button>
        {error.length > 0 && <Text style={{ marginTop: 2 }}>{error}</Text>}
      </View>
    </ScrollView>
  );
}
