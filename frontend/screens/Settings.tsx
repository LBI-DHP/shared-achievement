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
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const [error, setError] = useState(false);
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [newUserName, setNewUserName] = useState(userData.username);

  useEffect(() => {
    if (userData.team === null) setIsUserInATeam(false);
    else setIsUserInATeam(true);

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
          setError(false);
          const newUserData = {
            ...userData,
            name: newUserName,
          };

          dataManager.updateUser(newUserData).then((responseStatus) => {
            if (responseStatus === 200) {
              setUserData(newUserData);
            } else {
              setError(true);
            }
          });
        }}
      >
        Update user name
      </Button>
      {isUserInATeam ? (
        <Text style={{ padding: 10 }}>You are in Team {userData.team}</Text>
      ) : (
        <Text style={{ padding: 10 }}>Currently you're not part of a team</Text>
      )}
      <Button
        disabled={!isUserInATeam}
        mode="contained"
        onPress={() => {
          setError(false);
          const newUserData = {
            ...userData,
            teamName: null,
          };

          dataManager.updateUser(newUserData).then((responseStatus) => {
            if (responseStatus === 200) {
              setUserData(newUserData);
            } else {
              setError(true);
            }
          });
        }}
      >
        Leave Team
      </Button>
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
