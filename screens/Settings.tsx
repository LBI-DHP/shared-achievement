import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { useEffect, useState } from "react";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";

export default function Settings() {
  const { userData, setUserData, updated, setUpdated } =
    useContext(UserDataContext);
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const [error, setError] = useState(false);
  const [isUserNameChanged, setIsUserNameChanged] = useState(false);
  const [newUserName, setNewUserName] = useState(userData.name);

  useEffect(() => {
    if (userData.teamName === null) setIsUserInATeam(false);
    else setIsUserInATeam(true);

    if (newUserName === userData.name) setIsUserNameChanged(false);
    else setIsUserNameChanged(true);
  }, [userData]);

  useEffect(() => {
    if (newUserName === userData.name) setIsUserNameChanged(false);
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
            id: userData.id,
            name: newUserName,
            teamName: userData.teamName,
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
        <Text style={{ padding: 10 }}>You are in Team {userData.teamName}</Text>
      ) : (
        <Text style={{ padding: 10 }}>Currently you're not part of a team</Text>
      )}
      <Button
        disabled={!isUserInATeam}
        mode="contained"
        onPress={() => {
          setError(false);
          const newUserData = {
            id: userData.id,
            name: userData.name,
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
    </View>
  );
}
