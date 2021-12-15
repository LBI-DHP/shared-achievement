import "react-native-gesture-handler";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import { UserDataContext } from "../components/UserDataProvider";
import dataManager from "../components/DataManager";

export default function Team() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [teamName, setTeamName] = React.useState("");
  const [error, setError] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [teamExists, setTeamExists] = useState(false);

  useEffect(() => {
    dataManager.getAllTeams().then((response) => {
      response;
      setAllTeams(response);
    });
  }, []);

  useEffect(() => {
    setTeamExists(false);
    allTeams.forEach((element) => {
      console.log(element.name, teamName);
      console.log(element.name === teamName);
      if (element.name === teamName) setTeamExists(true);
    });
    console.log(teamExists);
  }, [teamName]);

  return (
    <View style={style.container}>
      <Text style={style.subheading}>
        Great challenges are easier to accomplish when you tackle them as a
        team. 💪
      </Text>
      <Text style={{ paddingBottom: 10 }}>
        Join an existing team or create a new one:
      </Text>
      <TextInput
        value={teamName}
        multiline={false}
        placeholder="team name"
        autoComplete={false}
        onChangeText={(text) => setTeamName(text)}
      />
      <Button
        mode="contained"
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
    </View>
  );
}
