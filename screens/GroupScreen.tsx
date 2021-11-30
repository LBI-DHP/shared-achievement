import "react-native-gesture-handler";
import * as React from "react";

import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";

import { style } from "../constants/Styles";

export default function GroupScreen() {
  const [groupname, setText] = React.useState("");
  const [btnJoin, setbtnJoin] = React.useState(true);
  const [btnCreate, setbtnCreate] = React.useState(true);

  // TODO replace with implemented functions
  const checkIfGroupNameExists = (name) => {
    return name == "exists";
  };
  const joinGroup = () => {
    console.log("Join: group " + groupname);
  };
  const createGroup = () => {
    console.log("Create group: " + groupname);
  };

  const changeText = (text) => {
    setText(text.toLowerCase()); // TODO allows only lowercase
    if (text.length == 0) {
      setbtnCreate(true);
      setbtnJoin(true);
    } else {
      if (checkIfGroupNameExists(text)) {
        setbtnJoin(false);
        setbtnCreate(true);
      } else {
        setbtnJoin(true);
        setbtnCreate(false);
      }
    }
  };
  return (
    <View style={style.container}>
      <Text style={style.heading}>
        Join/create a team to face the challenge
      </Text>
      <View style={{ flexDirection: "row" }}>
        <Text>Team Name:</Text>
        <View>
          <TextInput
            value={groupname}
            multiline={false}
            placeholder="Enter a team name"
            onChangeText={changeText}
            autoComplete={false}
          />
          <View style={{ flexDirection: "row" }}>
            <Button mode="contained" disabled={btnJoin} onPress={joinGroup}>
              Join Group
            </Button>
            <Button mode="contained" disabled={btnCreate} onPress={createGroup}>
              Create Group
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}
