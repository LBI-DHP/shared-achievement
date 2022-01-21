import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import { AppRegistry } from "react-native";
import appJson from "./app.json";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { UserDataProvider } from "./components/UserDataProvider";
import AppView from "./components/AppView";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3f5c7c",
    accent: "#F6D960",
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UserDataProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AppView />
          </PaperProvider>
        </SafeAreaProvider>
      </UserDataProvider>
    );
  }
}

AppRegistry.registerComponent(appJson.expo.name, () => App);
