import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { style } from "../constants/Styles";
import dataManager from "../components/DataManager";
import { UserDataContext } from "../components/UserDataProvider";

export default function Welcome() {
  const { userData, setUserData } = useContext(UserDataContext);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

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
        placeholder="username"
        autoComplete={false}
        onChangeText={(text) => setUserName(text)}
      />
      <Button
        mode="contained"
        disabled={userName.length < 2}
        onPress={() => {
          const newUserData = {
            ...userData,
            username: userName,
          };
          setError("");
          dataManager.registerUser(newUserData).then((data) => {
            if (data === -1) {
              setError("🚨 Error: Please check your internet connection.");
            } else if (data === -2) {
              setError(
                "Sorry, this username is already taken. Please try another name."
              );
            } else if (data === null) {
              setError(
                "🚨 Internal Server Error: Please try again or contact the administrator."
              );
            } else {
              setUserData(data);
            }
          });
        }}
      >
        Set user name
      </Button>
      {error.length > 0 && <Text style={{ marginTop: 2 }}>{error}</Text>}
    </View>
  );
}
