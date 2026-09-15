/*
 * Copyright (c) 2021-2024 Ludwig Boltzmann Institute for Digital Health and Prevention
 *
 * Licensed under the Apache License, Version 2.0 with the Commons Clause License
 * Condition v1.0 (the "License"); you may not use this file except in compliance
 * with the License. A copy of the License is distributed in the LICENSE file at
 * the root of this repository; the Apache License is also available at
 * http://www.apache.org/licenses/LICENSE-2.0 and the Commons Clause condition at
 * https://commonsclause.com/
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * SPDX-License-Identifier: LicenseRef-Apache-2.0-WITH-Commons-Clause
 */

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import { AppRegistry } from "react-native";
import appJson from "./app.json";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { UserDataProvider } from "./providers/UserDataProvider";
import { UpdateProvider } from "./providers/UpdateProvider";
import { TeamDataProvider } from "./providers/TeamDataProvider";
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
        <UpdateProvider>
          <TeamDataProvider>
            <SafeAreaProvider>
              <PaperProvider theme={theme}>
                <AppView />
              </PaperProvider>
            </SafeAreaProvider>
          </TeamDataProvider>
        </UpdateProvider>
      </UserDataProvider>
    );
  }
}

AppRegistry.registerComponent(appJson.expo.name, () => App);
