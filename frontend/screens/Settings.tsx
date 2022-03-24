import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { useEffect, useState } from "react";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const { userData, setUserData, updated, setUpdated } =
    useContext(UserDataContext);
  const [error, setError] = useState("");
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [newUserName, setNewUserName] = useState(userData.username);

  useEffect(() => {
    if (newUserName === userData.username) setIsUserNameChanged(false);
    else setIsUserNameChanged(true);
  }, [userData]);

  useEffect(() => {
    if (newUserName === userData.username) setIsUserNameChanged(false);
    else setIsUserNameChanged(true);
  }, [newUserName]);

  return (
    <View style={style.container}>
      <Text style={style.subheading}>Settings</Text>
      <TextInput
        autoComplete={false}
        value={newUserName}
        multiline={false}
        placeholder="user name"
        onChangeText={(text) => setNewUserName(text)}
      />
      <Button
        disabled={!isUserNameChanged}
        mode="contained"
        onPress={() => {
          setError("");
          const newUserData = {
            ...userData,
            username: newUserName,
          };
          dataManager.updateUserData(newUserData).then((data) => {
            if (data === -1)
              setError("🚨 Error: Please check your internet connection.");
            else if (data === null)
              setError(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            else setUserData(data);
          });
        }}
      >
        Update user name
      </Button>
      {error.length > 0 && <Text style={{ marginTop: 2 }}>{error}</Text>}
      <Button
        style={{ marginTop: 10 }}
        mode="contained"
        onPress={() => {
          dataManager.deleteGoogleAuthInfo();
        }}
      >
        Disconnect App from Google Fit
      </Button>
      <Button
        style={{ marginTop: 10 }}
        mode="contained"
        onPress={() => {
          AsyncStorage.clear();
        }}
      >
        Clear local storage
      </Button>
    </View>
  );
}
