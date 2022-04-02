import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Surface } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
import TeamContributions from "../components/Challenge/TeamContributions";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";
// @ts-ignore
import StepCounter from "../components/StepCounter/StepCounter";

export default function ChallengeScreen() {
  const { userData, setMode, setNavigationIndex, updated, isUserDataLoading } =
    useContext(UserDataContext);
  const [teamName, setTeamName] = useState("");
  const [teamReachedSummit, setTeamReachedSummit] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isUserDataLoading && userData.team) {
      dataManager.getTeamData(userData.team).then((data) => {
        if (data !== null) {
          setTeamName(data.name);
          setMode(data.progressCalculationMode);
        }
      });
      dataManager
        .getTeamChallengeData(userData.team)
        .then((data) => {
          if (mounted && data.progress) {
            console.log(data.progress);
            setTeamReachedSummit(data.progress >= 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return () => {
      mounted = false;
    };
  }, [updated, userData.team]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            paddingBottom: 35,
          }}
        >
          <Surface style={styles.surface}>
            {userData.team && (
              <Text style={style.cardHeader}>Progress of Team {teamName}</Text>
            )}
            <Challenge />
            {userData.team && <TeamContributions />}
          </Surface>
          {userData.team ? (
            <StepCounter />
          ) : (
            <Button
              mode="contained"
              style={{
                marginTop: 10,
              }}
              onPress={() => {
                setNavigationIndex(1);
              }}
            >
              Select a team
            </Button>
          )}
        </View>
      </ScrollView>
      {teamReachedSummit && (
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  surface: {
    elevation: 4,
    borderRadius: 5,
    marginBottom: 10,
  },
  container: {
    padding: 20,
    flex: 1,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
  },
});
