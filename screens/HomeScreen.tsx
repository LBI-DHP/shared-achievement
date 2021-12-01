import "react-native-gesture-handler";
import * as React from "react";
import StepCounter from "../components/StepCounter";

import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { style } from "../constants/Styles";

import { useEffect, useState } from 'react';

import configJSON from "../config.json";

export default function HomeScreen() {
  const [username, setName] = React.useState(""); // TODO replace with active username

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const setUserNameRequest = async () => {
     try {
      const response = await fetch(configJSON.serverConfig.root + '/person/add', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: '123456789',
          name: username,
          teamName: 'LBI'
        })
      });
      const ok = await response.status;
      console.log("server response: " + ok);
      setData([ok.toString()]);
    } catch (error) {
      console.log("error on set name:" + error);
    } finally {
      setLoading(false);
      console.log("done with set name request");
    }
  }

  // TODO replace with implemented functions
  const setUserName = () => {
    console.log("setting user name...");
    setUserNameRequest();
    console.log("savce username: " + username);
  };

  return (
    <View style={style.container}>
      <Text style={style.heading}>Set a user name to face the challenge</Text>
      <View style={{ flexDirection: "row" }}>
        <Text>User Name:</Text>
        <View>
          <TextInput
            value={username}
            multiline={false}
            placeholder="Enter a user name"
            autoComplete={false}
            onChangeText={(text) => setName(text)}
          />
          <Button mode="contained" onPress={setUserName}>
            Set user name
          </Button>
        </View>
      </View>
      <StepCounter />
    </View>
  );
}
