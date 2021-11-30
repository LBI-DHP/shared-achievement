import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import ChallengeScreen from "../screens/ChallengeScreen";
import DetailsScreen from "../screens/DetailsScreen";
import SABottomNavigation from "./SABottomNavigation";
import CustomNavigationBar from "./CustomNavigationBar";

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Shared Achievements"
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}
      >
        <Stack.Screen name="Challenge" component={ChallengeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
      <SABottomNavigation />
    </NavigationContainer>
  );
}
