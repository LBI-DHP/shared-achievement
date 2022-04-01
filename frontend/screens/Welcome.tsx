import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";
import * as Device from "expo-device";

export default function Welcome() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [userName, setUserName] = useState("");
  const [averageSteps, setAverageSteps] = useState(null);

  const [error, setError] = useState("");

  return (
    <View style={style.containerPaddingTop}>
      <Text style={style.heading}>Hey there! 👋</Text>
      <Text style={style.subheading}>
        We are excited that you want to face a challenge. But first, please
        enter the following information:{" "}
      </Text>
      <TextInput
        style={{ marginBottom: 10 }}
        label="username"
        value={userName}
        multiline={false}
        autoComplete={false}
        onChangeText={(text) => setUserName(text)}
        mode="outlined"
      />
      <TextInput
        label="Average steps per day"
        mode="outlined"
        value={averageSteps}
        multiline={false}
        autoComplete={false}
        onChangeText={(text) => {
          let number = text.replace(/\D/g, "");
          setAverageSteps(number);
        }}
      />
      <Button
        style={{ marginTop: 15 }}
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

          console.log(newUserData);
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
        }}
      >
        Get started
      </Button>
      {error.length > 0 && <Text style={{ marginTop: 2 }}>{error}</Text>}
    </View>
  );
}
