import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Button, TextInput, Surface } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import { Picker } from "@react-native-picker/picker";
import { style } from "../constants/Styles";

export default function JoinOrCreateTeam() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    let mounted = true;
    dataManager.getAllTeams().then((response) => {
      if (response !== null && mounted) setAllTeams(response);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Surface style={styles.surface}>
      <Text style={styles.header}>Select your Team</Text>
      <Picker
        selectedValue={selectedTeam}
        onValueChange={(itemValue, itemIndex) => setSelectedTeam(itemValue)}
      >
        <Picker.Item enabled={false} label="=== select a team ===" value="" />
        {allTeams.map((team) => {
          return (
            <Picker.Item label={team.name} value={team.id} key={team.id} />
          );
        })}
      </Picker>
      {/* <Text style={styles.header}>Create/Join a team</Text> */}
      {/* <TextInput
        style={{
          margin: 10,
          marginBottom: 0,
        }}
        label={"Team name"}
        value={teamName}
        multiline={false}
        autoComplete={false}
        onChangeText={(text) => setTeamName(text)}
      /> */}
      <Button
        mode="contained"
        style={{
          margin: 10,
        }}
        onPress={() => {
          const updatedUserData = { ...userData, team: selectedTeam };
          dataManager.updateUser(updatedUserData).then((data) => {
            if (data) {
              setUserData(data);
            }
          });
        }}
        disabled={selectedTeam.length === 0}
      >
        {"Join team"}
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  wrapper: {
    padding: 15,
    alignItems: "center",
    width: "33.33%",
  },
  header: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#3f5c7c",
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  headerText: { fontSize: 20, fontWeight: "bold" },
  labelText: { textAlign: "center" },
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
});
