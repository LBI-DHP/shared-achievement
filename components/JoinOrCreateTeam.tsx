import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Button, TextInput, Surface } from "react-native-paper";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";

export default function JoinOrCreateTeam() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [teamName, setTeamName] = React.useState("");
  const [error, setError] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [teamExists, setTeamExists] = useState(false);

  useEffect(() => {
    let mounted = true;
    dataManager.getAllTeams().then((response) => {
      if (mounted) setAllTeams(response);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setTeamExists(false);
    allTeams.forEach((element) => {
      if (element.name === teamName) setTeamExists(true);
    });
  }, [teamName]);

  return (
    <Surface style={styles.surface}>
      <Text style={styles.header}>Create/Join a team</Text>
      <TextInput
        style={{
          margin: 10,
          marginBottom: 0,
        }}
        label={"Team name"}
        value={teamName}
        multiline={false}
        autoComplete={false}
        onChangeText={(text) => setTeamName(text)}
      />
      <Button
        mode="contained"
        style={{
          margin: 10,
        }}
        onPress={() => {
          const updatedUserData = {
            id: userData.id,
            name: userData.name,
            teamName: teamName,
          };
          if (teamExists) {
            dataManager.updateUser(updatedUserData).then((responseStatus) => {
              if (responseStatus === 201 || responseStatus === 200)
                setUserData(updatedUserData);
              else setError(true);
            });
          } else {
            const newTeamData = {
              challengeName: "Untersberg Hike",
              name: teamName,
            };
            dataManager.addTeam(newTeamData).then((responseStatus) => {
              if (responseStatus === 201) {
                dataManager
                  .updateUser(updatedUserData)
                  .then((responseStatus) => {
                    if (responseStatus === 201 || responseStatus === 200)
                      setUserData(updatedUserData);
                    else setError(true);
                  });
              } else setError(true);
            });
          }
          setError(false);
        }}
        disabled={teamName.length === 0}
      >
        {teamExists ? "Join team" : "Create and join team"}
      </Button>
      {error && <Text>Error!</Text>}
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
