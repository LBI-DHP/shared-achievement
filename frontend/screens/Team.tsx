import React, { useState, useContext, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { Button, Paragraph, Dialog, Portal } from "react-native-paper";
import JoinOrCreateTeam from "../components/JoinTeam";
import { UserDataContext } from "../components/UserDataProvider";
import { UpdateContext } from "../components/UpdateProvider";
import TeamList from "../components/TeamList/TeamList";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";

export default function Team() {
  const [isUserInATeam, setIsUserInATeam] = useState(false);
  const { userData, setUserData, setMode } = useContext(UserDataContext);
  const { setApiReloadIndicator, apiReloadIndicator } =
    useContext(UpdateContext);
  const [error, setError] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isLeaveTeamDialogVisible, setIsLeaveTeamDialogVisible] =
    useState(false);

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
    <>
      {isUserInATeam ? (
        <>
          <Text style={style.header}>Go, team {teamName}!</Text>
          <ScrollView style={{ marginBottom: 0 }}>
            <TeamList />
            <Button
              style={{ margin: 10 }}
              disabled={!isUserInATeam}
              mode="outlined"
              onPress={() => {
                setIsLeaveTeamDialogVisible(true);
              }}
            >
              Leave Team
            </Button>
          </ScrollView>
          {isLeaveTeamDialogVisible && (
            <Portal>
              <Dialog
                visible={isLeaveTeamDialogVisible}
                onDismiss={() => setIsLeaveTeamDialogVisible(false)}
              >
                <Dialog.Content>
                  <Paragraph style={{ paddingBottom: 10 }}>
                    Are you sure you want to leave team {teamName}?
                  </Paragraph>
                  {error.length > 0 && (
                    <Paragraph style={{ paddingBottom: 10 }}>{error}</Paragraph>
                  )}
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setIsLeaveTeamDialogVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
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
                          setIsLeaveTeamDialogVisible(false);
                          setUserData(newUserData);
                          setMode(null);
                          setApiReloadIndicator(apiReloadIndicator);
                        }
                      });
                    }}
                  >
                    Yes
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          )}
        </>
      ) : (
        <JoinOrCreateTeam />
      )}
    </>
  );
}
