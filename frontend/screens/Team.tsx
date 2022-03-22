import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { Button, Surface } from "react-native-paper";
import JoinOrCreateTeam from "../components/JoinTeam";
import { UserDataContext } from "../components/UserDataProvider";
import TeamList from "../components/TeamList/TeamList";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";

export default function Team() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData, setUserData, mode, setMode } = useContext(UserDataContext);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    setIsUserInATeam(userData.team !== null);
  }, [userData.team]);

  useEffect(() => {
    let mounted = true;
    if (isUserInATeam && mounted)
      dataManager.getTeamData(userData.team).then((data) => {
        if (mounted && data !== null) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
    return () => {
      mounted = false;
    };
  }, [isUserInATeam]);

  return (
    <ScrollView style={style.container}>
      {isUserInATeam ? (
        <View style={{ marginBottom: 30 }}>
          <Surface style={style.surface}>
            <Text style={style.cardHeader}>Team {teamName}</Text>
            <TeamList />
            <Button
              disabled={!isUserInATeam}
              mode="contained"
              onPress={() => {
                setError("");
                const newUserData = {
                  ...userData,
                  team: null,
                };
                dataManager.updateUserData(newUserData).then((data) => {
                  if (data === -1)
                    setError(
                      "🚨 Error: Please check your internet connection."
                    );
                  else if (data === null)
                    setError(
                      "🚨 Internal Server Error: Please try again or contact the administrator."
                    );
                  else {
                    setUserData(newUserData);
                    setMode(null);
                  }
                });
              }}
            >
              Leave Team
            </Button>
            {error.length > 0 && (
              <Text
                style={{ marginTop: 2, marginBottom: 10, textAlign: "center" }}
              >
                {error}
              </Text>
            )}
          </Surface>
        </View>
      ) : (
        <JoinOrCreateTeam />
      )}
    </ScrollView>
  );
}
