import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";

export default function Welcome() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(false);

  return (
    <View style={style.containerPaddingTop}>
      <Text style={style.heading}>Hey there! 👋</Text>
      <Text style={style.subheading}>
        We are excited that you want to face the Untersberg challenge. But
        first, please set a user name:{" "}
      </Text>
      <TextInput
        value={userName}
        multiline={false}
        placeholder="user name"
        autoComplete={false}
        onChangeText={(text) => setUserName(text)}
      />
      <Button
        mode="contained"
        onPress={() => {
          setError(false);
          const newUserData = {
            id: userData.id,
            name: userName,
            teamName: null,
            expoToken: null
          };

          dataManager.addUser(newUserData).then((responseStatus) => {
            if (responseStatus === 201) {
              setUserData(newUserData);
            } else {
              setError(true);
            }
          });
        }}
      >
        Set user name
      </Button>
      {error && <Text>Error!</Text>}
    </View>
  );
}
