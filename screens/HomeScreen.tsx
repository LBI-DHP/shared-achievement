import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { AppStateContext } from "../components/AppStateProvider";

export default function HomeScreen() {
  const { userData, setUserData } = useContext(AppStateContext);
  const [isUserNameSet, setIsUserNameSet] = useState(false);

  useEffect(() => {
    if (userData.name !== null) {
      setIsUserNameSet(true);
    }
  }, []);

  const [username, setName] = React.useState(""); // TODO replace with active username
  const [userteam, setUserTeam] = React.useState("");
  const [teamSteps, setTeamSteps] = React.useState("");

  const [userid, setUserID] = React.useState("123456789");
  dataManager
    .getUserId()
    .then((id) => {
      setUserID(id);
      // console.log("UserId is: " + id);
    })
    .catch((e) => console.log("error"));

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // getUserName();
  }, []);

  useEffect(() => {
    // console.log("fechting team steps...");
    // getTeamStepsRequest();
  }, [userteam]);

  useEffect(() => {
    // console.log("fechting team steps...");
    // getTeamStepsRequest();
  }, [username]);

  // TODO replace with implemented functions
  const setUserName = () => {
    console.log("setting user name...");
    // setUserNameRequest();
    console.log("savce username: " + username);
  };

  return (
    <View style={style.container}>
      <Text style={style.heading}>Hey there!</Text>
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
      <Text>Team: {userteam}</Text>
      <Text>Team steps today: {teamSteps}</Text>
      <StepCounter />
    </View>
  );
}
