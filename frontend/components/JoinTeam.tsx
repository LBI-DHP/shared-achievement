import React, { useContext, useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { UserDataContext } from "./UserDataProvider";
import dataManager from "./DataManager";
import { Picker } from "@react-native-picker/picker";
import CenteredActivityIndicator from "./CenteredActivityIndicator";

export default function JoinOrCreateTeam() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorOnLoadTeams, setErrorOnLoadTeams] = useState("");
  const [errorOnJoinTeam, setErrorOnJoinTeam] = useState("");

  useEffect(() => {
    let mounted = true;
    dataManager.getAllTeams().then((response) => {
      if (mounted) {
        if (response === -1)
          setErrorOnLoadTeams(
            "🚨 Error: Please check your internet connection."
          );
        else if (response === null)
          setErrorOnLoadTeams(
            "🚨 Internal Server Error: Please try again or contact the administrator."
          );
        else setAllTeams(response);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) return <CenteredActivityIndicator height={50} />;

  return (
    <Surface style={styles.surface}>
      <Text style={styles.header}>Select your Team</Text>
      {errorOnLoadTeams.length > 0 && (
        <Text style={{ marginTop: 2, marginBottom: 2, textAlign: "center" }}>
          {errorOnLoadTeams}
        </Text>
      )}
      {isLoading ? (
        <CenteredActivityIndicator height={65} />
      ) : (
        <Picker
          selectedValue={selectedTeam}
          onValueChange={(itemValue) => setSelectedTeam(itemValue)}
        >
          <Picker.Item enabled={false} label="=== select a team ===" value="" />
          {allTeams.map((team) => {
            return (
              <Picker.Item label={team.name} value={team.id} key={team.id} />
            );
          })}
        </Picker>
      )}
      <Button
        mode="contained"
        style={{
          margin: 10,
        }}
        onPress={() => {
          const updatedUserData = { ...userData, team: selectedTeam };
          dataManager.updateUserData(updatedUserData).then((data) => {
            if (data === -1)
              setErrorOnJoinTeam(
                "🚨 Error: Please check your internet connection."
              );
            else if (data === null)
              setErrorOnJoinTeam(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            else setUserData(data);
          });
        }}
        disabled={selectedTeam.length === 0 || isLoading}
      >
        {"Join team"}
      </Button>
      {errorOnJoinTeam.length > 0 && (
        <Text style={{ marginTop: 2, marginBottom: 10, textAlign: "center" }}>
          {errorOnJoinTeam}
        </Text>
      )}
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
