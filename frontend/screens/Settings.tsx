import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { useEffect, useState } from "react";
import { UserDataContext } from "../providers/UserDataProvider";
import dataManager from "../components/DataManager";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const {
    userData,
    setUserData,
    isConnectedToGoogleFit,
    setIsConnectedToGoogleFit,
  } = useContext(UserDataContext);
  const [userNameError, setUserNameError] = useState("");
  const [googleFitError, setGoogleFitError] = useState(false);
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [newUserName, setNewUserName] = useState(userData.username);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);

  useEffect(() => {
    if (newUserName === userData.username) setIsUserNameChanged(false);
    else setIsUserNameChanged(true);
  }, [userData.username, newUserName]);

  useEffect(() => {
    let mounted = true;
    dataManager.getGoogleAuthInfo().then((authInfo) => {
      if (authInfo != null && authInfo.access_token) {
        if (mounted) setGoogleAccessToken(authInfo.access_token);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

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
          setUserNameError("");
          const newUserData = {
            ...userData,
            username: newUserName,
          };
          dataManager.updateUserData(newUserData).then((data) => {
            if (data === -1)
              setUserNameError(
                "🚨 Error: Please check your internet connection."
              );
            else if (data === null)
              setUserNameError(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            else setUserData(data);
          });
        }}
      >
        Update user name
      </Button>
      {userNameError.length > 0 && (
        <Text style={{ marginTop: 2 }}>{userNameError}</Text>
      )}
      {isConnectedToGoogleFit && (
        <Button
          style={{ marginTop: 10 }}
          mode="contained"
          onPress={() => {
            dataManager
              .disconnectFromGoogleFit(googleAccessToken)
              .then((worked) => {
                if (worked) setIsConnectedToGoogleFit(false);
                else setGoogleFitError(true);
              });
          }}
        >
          Disconnect App from Google Fit
        </Button>
      )}
      <Button
        style={{ marginTop: 10 }}
        mode="contained"
        onPress={() => {
          if (isConnectedToGoogleFit) {
            dataManager
              .disconnectFromGoogleFit(googleAccessToken)
              .then((worked) => {
                if (worked) {
                  AsyncStorage.clear().then(() => {
                    setUserData({
                      id: null,
                      username: null,
                      team: null,
                      expoToken: null,
                      password: null,
                      targetGoal: null,
                      showDeveloperSettings: false,
                    });
                    setIsConnectedToGoogleFit(false);
                  });
                } else setGoogleFitError(true);
              });
          } else
            AsyncStorage.clear().then(() => {
              setUserData({
                id: null,
                username: null,
                team: null,
                expoToken: null,
                password: null,
                targetGoal: null,
                showDeveloperSettings: false,
              });
            });
        }}
      >
        Clear local storage
      </Button>

      {googleFitError && (
        <Text style={{ paddingTop: 10 }}>
          🚨 Error: Could not disconnect from Google Fit. Please check the
          internet connection.
        </Text>
      )}
    </View>
  );
}
