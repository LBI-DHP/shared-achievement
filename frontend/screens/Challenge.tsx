import React, { useState, useEffect, useContext } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Button, Surface, Paragraph, Dialog, Portal } from "react-native-paper";
import { style } from "../constants/Styles";
import Challenge from "../components/Challenge/Challenge";
import TeamContributions from "../components/Challenge/TeamContributions";
import ConfettiCannon from "react-native-confetti-cannon";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
    mode,
  } = useContext(UserDataContext);
  const [teamName, setTeamName] = useState("");
  const [teamReachedSummit, setTeamReachedSummit] = useState(false);
  const [isTodaysPopUpVisible, setIsTodaysPopUpVisible] = useState(false);
  const [showConfettiCannon, setShowConfettiCannon] = useState(false);
  const [
    isYesterdaysProgressPopUpVisible,
    setIsYesterdaysProgressPopUpVisible,
  ] = useState(false);
  const [yesterdaysProgress, setYesterdaysProgress] = useState(null);
  const [yesterdaysSteps, setYesterdaysSteps] = useState(null);
  const [didChallengeExistYesterday, setDidChallengeExistYesterday] =
    useState(false);

  useEffect(() => {
    let mounted = true;
    if (teamReachedSummit && navigationIndex === 0) {
      dataManager.getShowReachedSummitPopUp().then((showPopUp) => {
        if (mounted) setIsTodaysPopUpVisible(showPopUp);
      });
    }
    if (teamReachedSummit && navigationIndex === 0) {
      if (mounted) setShowConfettiCannon(true);
    }
    return () => {
      mounted = false;
    };
  }, [teamReachedSummit, updated]);

  useEffect(() => {
    let mounted = true;
    if (!isUserDataLoading && userData.team) {
      dataManager.getShowYesterdaysProgressPopUp().then((showPopUp) => {
        if (mounted) setIsYesterdaysProgressPopUpVisible(showPopUp);
      });
    }
    return () => {
      mounted = false;
    };
  }, [userData.team]);

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
            setTeamReachedSummit(data.progress >= 100);
            setShowConfettiCannon(data.progress >= 100);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      const newDate = new Date();
      newDate.setDate(newDate.getDate() - 1);
      const date = newDate.getDate();
      const month = newDate.getMonth() + 1;
      const year = newDate.getFullYear();
      let dateString = date.toString();
      if (dateString.length === 1) dateString = "0" + dateString;
      let monthString = month.toString();
      if (monthString.length === 1) monthString = "0" + monthString;
      const dateStringYesterday = year + "-" + monthString + "-" + dateString;

      dataManager
        .getTeamChallengeData(userData.team, dateStringYesterday)
        .then((data) => {
          if (mounted && data === -1) {
            setDidChallengeExistYesterday(false);
          } else if (mounted && data && data.progress) {
            setYesterdaysProgress(data.progress);
            setYesterdaysSteps(data.total_steps);
            setDidChallengeExistYesterday(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setTeamReachedSummit(false);
      setShowConfettiCannon(false);
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
            {teamReachedSummit && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#99bfcf",
                  borderRadius: 15,
                  backgroundColor: "white",
                  width: 32,
                  padding: 5,
                  marginLeft: 18,
                  marginTop: 17,
                  marginBottom: -50,
                  zIndex: 100,
                }}
              >
                <MaterialCommunityIcons
                  name="trophy"
                  size={20}
                  color="#ffae00"
                />
              </View>
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
                  Well done!👏 Your team made it to the summit today. 🥳🎉 Keep
                  collecting and contributing steps.
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
        {isYesterdaysProgressPopUpVisible && didChallengeExistYesterday && (
          <Portal>
            <Dialog visible={isYesterdaysProgressPopUpVisible}>
              <Dialog.Content>
                <Paragraph style={{ paddingBottom: 10 }}>
                  {yesterdaysProgress >= 100 ? (
                    <>
                      Well done!👏Your team made it to the summit yesterday.🥳🎉{" "}
                    </>
                  ) : (
                    <>
                      Unfortunately, your team did not make it to the summit
                      yesterday.{" "}
                    </>
                  )}
                  {mode === "ABSOLUTE" ? (
                    <>
                      You made it up {yesterdaysProgress}% and collected{" "}
                      {yesterdaysSteps} steps. ⛰️
                    </>
                  ) : (
                    <>You made it up {yesterdaysProgress}%. ⛰️</>
                  )}
                  {yesterdaysProgress < 100 && (
                    <> Try it again today. You can do it. 💪</>
                  )}
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setIsYesterdaysProgressPopUpVisible(false)}
                >
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
