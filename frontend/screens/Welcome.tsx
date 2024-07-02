import React, { useContext, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Platform,
  Keyboard,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../providers/UserDataProvider";
import * as Device from "expo-device";

export default function Welcome({ isSingleUser }) {
  const { userData, setUserData } =
    useContext(UserDataContext);
  const [userName, setUserName] = useState("");
  const [averageSteps, setAverageSteps] = useState(null);

  const [error, setError] = useState("");
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
        { Platform.OS === "android" ? (
          <Text style={{ margin: 5 }}>
            * please check this in Health Connect (already connected to all the
            devices you want to use for step counting)
          </Text>
        ) : (
          <Text style={{ margin: 5 }}>
            * please check this in Apple Health (already connected to all the
            devices you want to use for step counting)
          </Text>
        )}
        <Button
          style={{ marginTop: 20 }}
          mode="outlined"
          disabled={
            userName.length < 2 || averageSteps === null || averageSteps < 100
          }
          onPress={() => {
            var date = new Date();
            var offsetInHours = (date.getTimezoneOffset() * -1) / 60;
            const newUserData = {
              ...userData,
              username: userName,
              targetGoal: averageSteps * 1.1,
              device: Device.modelName,
              operatingSystem: Device.osName,
              operatingSystemVersion: Device.osVersion,
              averageSteps: averageSteps,
              timezone: "UTC",
              timezone_offset: offsetInHours,//"+2",
            };
            console.log(newUserData);
            console.log("offsetInHours", offsetInHours);
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
