import "react-native-gesture-handler";
import * as React from "react";

import { View, Text, Platform } from "react-native";
import { Button } from "react-native-paper";

import { style } from "../constants/Styles";

import { useEffect, useState } from 'react'; 

import configJSON from "../config.json";
import HomeScreen from "./HomeScreen";

export default function ProfileScreen() {

  const [username, setName] = React.useState(""); // TODO replace with active username
  const [stepcount, setStepCount] = React.useState(100); //TODO
  const [verticalcount] = React.useState("30"); //TODO

  const [teamname] = React.useState("A"); //TODO
  const [teamverticalcount] = React.useState("1130"); //TODO
  const [teampercent] = React.useState("80"); //TODO

  const [userid, setUserID] = React.useState("123456789");
  const [userteam, setUserTeam] = React.useState("");
  const [teamSteps, setTeamSteps] = React.useState(0);
  const [userSteps, setUserSteps] = React.useState(0);

  const addSteps = () => {
    //TODO donate steps
    console.log("add my steps pressed")
  };

  useEffect(() => {
    getUserName();
  }, []);

  useEffect(() => {
    console.log("fechting team steps...");
    getTeamStepsRequest();
    getUserStepsRequest();
  }, [userteam]);

  useEffect(() => {
    console.log("fechting team steps...");
    getTeamStepsRequest();
  }, [stepcount]);

  const getUserName = async () => {
    try {
     const response = await fetch(configJSON.serverConfig.root + '/person/find?id=' + userid.toString(), {
       method: 'GET',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
       }
     });
     const json = await response.json();
     console.log("server response on get user name: " + json);
     setName(json.name);
     setUserTeam(json.teamName);
    } catch (error) {
      console.log("error on get name:" + error);
    } finally {

      console.log("done with get name request");
    }
  }

  const getTeamStepsRequest = async () => {
    try {
     const response = await fetch(configJSON.serverConfig.root + '/team/stepCountToday?name=' + userteam.toString(), {
       method: 'GET',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
       }
     });
     const json = await response.json();
     console.log("server response to team steps request: " + json.steps);
     setTeamSteps(json.steps);
    } catch (error) {
      console.log("error on get team steps:" + error);
    } finally {
      console.log("done with get team steps request");
    }
  }

  const getUserStepsRequest = async () => {
    try {
     const response = await fetch(configJSON.serverConfig.root + '/stepcount/findByPersonIdForToday?personId=' + userid.toString(), {
       method: 'GET',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
       }
     });
     const json = await response.json();
     console.log("server response to team steps request: " + json.steps);
     setStepCount(json.steps);
    } catch (error) {
      console.log("error on get team steps:" + error);
    } finally {
      console.log("done with get team steps request");
    }
  }

  const addSomeSteps = async () => {
    try {
     const response = await fetch(configJSON.serverConfig.root + '/stepcount/push', {
       method: 'PUT',
       headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         personId: "123456789",
         steps: stepcount + 100
       })
     });
     const ok = await response.status;
     console.log("server response: " + ok);
     setStepCount( stepcount + 100);
   } catch (error) {
     console.log("error on set name:" + error);
   } finally {
     console.log("done with set name request");
   }
 }

  const fakeSteps = () => {
    //TODO donate steps
    addSomeSteps();
    console.log("add my steps pressed")
  };

  return (
    <View style={style.container}>
      <View style={{ flexDirection: "row", 
      justifyContent: "space-evenly",
      alignContent: "stretch" }}>
        <View>
          <Text style={style.heading}>{username}</Text>
          <Text>{stepcount} steps</Text>
          <Text>{verticalcount} vertical meters</Text>
          <Button mode="contained" onPress={addSteps} /*TODO integrate icon_add-steps.png */>
            Add my steps
          </Button>

          <Button mode="contained" onPress={fakeSteps} /*TODO remove this button once stepcount for android is implemented */>
            Fake some steps
          </Button>
          
        </View>
        <View>
          <Text /*TODO sry for that, quick fix to space the elements out*/>       </Text>
        </View>
        <View>
          <Text style={style.heading}>Team {teamname}</Text>
          <Text>{teamSteps} steps</Text>
          <Text>{teamverticalcount} vertical meters</Text>
          <Text>{teampercent}% of route</Text>
        </View>

    </View>
  </View>
  );
}
