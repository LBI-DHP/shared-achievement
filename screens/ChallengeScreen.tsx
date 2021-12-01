import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, Image } from "react-native";
import configJSON from "../config.json";

export default function ChallengeScreen() {
  const [Progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    getTeamStepsRequest();
  }, []);

  const getTeamStepsRequest = async () => {
    try {
      const response = await fetch(
        configJSON.serverConfig.root +
          "/team/relativeStepCountOfTeamTodayOfChallengeInPercent?name=LBI",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      console.log(
        "server response relative team steps request: " + json.relativeSteps
      );
      setProgress(json.relativeSteps / 100);
    } catch (error) {
      console.log("server response relative team steps request:" + error);
    } finally {
      console.log("server response relative team steps request.");
    }
  };

  return (
    <View style={style.container}>
      <View style={style.backgroundContainer}>
        <Image
          source={require("../assets/images/Untersberg.png")}
          resizeMode="cover"
          style={style.backgroundImage}
        />
      </View>
      <View style={style.overlayContainer}>
        <Image
          resizeMode="cover"
          style={{
            marginLeft: 110,
            width: 200,
            height: 325 * Progress,
            bottom: 0,
          }}
          source={require("../assets/images/UntersbergPath.png")}
        />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height: 350,
  },
  backgroundContainer: {
    position: "absolute",
    height: 350,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  overlayContainer: {
    position: "absolute",
    height: 350,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "column",
  },
});
