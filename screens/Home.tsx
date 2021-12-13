import "react-native-gesture-handler";
import React, { useContext, useState, useEffect } from "react";
import StepCounter from "../components/StepCounter";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { AppStateContext } from "../components/AppStateProvider";

export default function Home() {
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
      <Text style={style.heading}>Hey {userData.name}!</Text>
      <Text>Team: {userteam}</Text>
      <Text>Team steps today: {teamSteps}</Text>
      <StepCounter />
    </View>
  );
}
