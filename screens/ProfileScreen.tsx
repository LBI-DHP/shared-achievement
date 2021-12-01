import "react-native-gesture-handler";
import * as React from "react";

import { View, Text, Platform } from "react-native";
import { Button } from "react-native-paper";
import "../components/StepCounter";

import { style } from "../constants/Styles";
import StepCounter from "../components/StepCounter";

export default function ProfileScreen() {

  const [username] = React.useState(""); //TODO
  const [stepcount, setStepcount] = React.useState(100); //TODO
  const [verticalcount] = React.useState(30); //TODO

  const [teamname] = React.useState("A"); //TODO
  const [teamstepcount] = React.useState(90000); //TODO
  const [teamverticalcount] = React.useState(1130); //TODO
  const [teampercent] = React.useState(80); //TODO

  const addSteps = () => {
    //TODO donate steps
    console.log("add my steps pressed")
  };

  const fakeSteps = () => {
    const delta = 100
    setStepcount(stepcount+100)
    console.log("fake steps pressed (add "+delta.toString()+" steps)")
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
          <Text>{teamstepcount} steps</Text>
          <Text>{teamverticalcount} vertical meters</Text>
          <Text>{teampercent}% of route</Text>
        </View>

    </View>
  </View>
  );
}
