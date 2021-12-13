import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import { AppRegistry } from "react-native";
import appJson from "./app.json";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AppStateProvider } from "./components/AppStateProvider";
import AppView from "./components/AppView";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#004A99",
    accent: "#F6D960",
  },
};

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AppStateProvider>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <AppView />
          </PaperProvider>
        </SafeAreaProvider>
      </AppStateProvider>
    );
  }
}

AppRegistry.registerComponent(appJson.expo.name, () => App);
