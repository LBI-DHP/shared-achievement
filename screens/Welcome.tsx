import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { AppStateContext } from "../components/AppStateProvider";

export default function Welcome() {
  const { userData, setUserData } = useContext(AppStateContext);
  const [userName, setUserName] = React.useState("");
  const [error, setError] = React.useState(false);

  return (
    <View style={style.container}>
      <Text style={style.heading}>Hey there! 👋</Text>
      <Text style={style.subheading}>
        We are excited that you want to face the Untersberg challenge. But
        first, please set a user name:{" "}
      </Text>
      <TextInput
        value={userName}
        multiline={false}
        placeholder="user name"
        autoComplete={false}
        onChangeText={(text) => setUserName(text)}
      />
      <Button
        mode="contained"
        onPress={() => {
          setError(false);
          const newUserData = {
            id: userData.id,
            name: userName,
            teamName: null,
          };

          dataManager.addUser(newUserData).then((responseStatus) => {
            console.log("responseStatus:", responseStatus);
            if (responseStatus === 201) {
              console.log("set");
              setUserData(newUserData);
            } else {
              setError(true);
            }
          });
        }}
      >
        Set user name
      </Button>
      {error && <Text>Error!</Text>}
    </View>
  );
}
