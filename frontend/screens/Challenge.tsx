import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Surface, Paragraph, Dialog, Portal } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
import TeamContributions from "../components/Challenge/TeamContributions";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";
// @ts-ignore
import StepCounter from "../components/StepCounter/StepCounter";

export default function ChallengeScreen() {
  const {
    userData,
    setMode,
    setNavigationIndex,
    updated,
    isUserDataLoading,
    navigationIndex,
  } = useContext(UserDataContext);
  const [teamName, setTeamName] = useState("");
  const [teamReachedSummit, setTeamReachedSummit] = useState(false);
  const [isTodaysPopUpVisible, setIsTodaysPopUpVisible] = useState(false);
  const [showConfettiCannon, setShowConfettiCannon] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (teamReachedSummit) {
      dataManager.getShowTodaysPopUp().then((showPopUp) => {
        if (mounted) setIsTodaysPopUpVisible(showPopUp);
      });
    }
    if (teamReachedSummit && navigationIndex === 0) {
      if (mounted) setShowConfettiCannon(true);
    }
    return () => {
      mounted = false;
    };
  }, [teamReachedSummit]);

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
        {isTodaysPopUpVisible && navigationIndex === 0 && (
          <Portal>
            <Dialog visible={isTodaysPopUpVisible}>
              <Dialog.Content>
                <Paragraph style={{ paddingBottom: 10 }}>
                  Well done!👏 Your team made it to the summit of the Untersberg
                  today. 🥳🎉 Keep collecting and contributing steps.
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setIsTodaysPopUpVisible(false)}>
                  Okay
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </ScrollView>
      {showConfettiCannon && (
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
