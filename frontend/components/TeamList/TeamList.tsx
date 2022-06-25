import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { UserDataContext } from "../../providers/UserDataProvider";
import { TeamDataContext } from "../../providers/TeamDataProvider";
import SendMotivationMessageDialog from "./SendMotivationMessageDialog";
import TeamChartRelative from "./TeamChartRelative";
import TeamChartAbsolute from "./TeamChartAbsolute";
import CenteredActivityIndicator from "../CenteredActivityIndicator";

export default function TeamList() {
  const { userData, isUserDataLoading } = useContext(UserDataContext);
  const {
    mode,
    teamMembersAndStepCountOfToday,
    isTeamMembersAndStepCountOfTodayLoading,
  } = useContext(TeamDataContext);
  const [expoTokenListTeamMembers, setExpoTokenListTeamMembers] = useState([]);
  const [isMessageDialogVisible, setIsMessageDialogVisible] = useState(false);

  const showDialog = () => setIsMessageDialogVisible(true);
  const hideDialog = () => {
    setIsMessageDialogVisible(false);
    setSelectedUser({
      expoToken: null,
      username: null,
    });
  };

  const [selectedUser, setSelectedUser] = useState({
    expoToken: null,
    username: null,
  });

  useEffect(() => {
    let expoTokens = [];
    teamMembersAndStepCountOfToday.forEach((member) => {
      if (member.expoToken !== userData.expoToken)
        expoTokens.push(member.expoToken);
    });
    setExpoTokenListTeamMembers(expoTokens);
  }, [teamMembersAndStepCountOfToday]);

  if (isTeamMembersAndStepCountOfTodayLoading || isUserDataLoading)
    return <CenteredActivityIndicator height={100} />;

  return (
    <View style={{ paddingTop: 10 }}>
      {teamMembersAndStepCountOfToday.map((member) => {
        if (mode === "RELATIVE") {
          return (
            <TeamChartRelative
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              key={member.username}
              currentUserName={userData.username}
            />
          );
        } else if (mode === "ABSOLUTE") {
          return (
            <TeamChartAbsolute
              member={member}
              showDialog={showDialog}
              setSelectedUser={setSelectedUser}
              key={member.username}
              currentUserName={userData.username}
            />
          );
        }
      })}
      <Button
        style={{ margin: 10, marginBottom: 0 }}
        onPress={() => {
          showDialog();
        }}
        mode="contained"
      >
        motivate all team members
      </Button>
      {isMessageDialogVisible && selectedUser.expoToken ? (
        <SendMotivationMessageDialog
          isVisible={isMessageDialogVisible}
          hideDialog={hideDialog}
          nameTo={selectedUser.username}
          expoTokenList={[selectedUser.expoToken]}
          nameFrom={userData.username}
        />
      ) : (
        <SendMotivationMessageDialog
          isVisible={isMessageDialogVisible}
          hideDialog={hideDialog}
          nameTo={"all team members"}
          expoTokenList={expoTokenListTeamMembers}
          nameFrom={userData.username}
        />
      )}
    </View>
  );
}
