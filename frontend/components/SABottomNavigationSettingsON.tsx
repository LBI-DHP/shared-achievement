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

import React, { useEffect } from "react";
import ChallengeScreen from "../screens/Challenge";
import TeamScreen from "../screens/Team";
import SettingsScreen from "../screens/Settings";
import { BottomNavigation } from "react-native-paper";
import { UserDataContext } from "../providers/UserDataProvider";

export default function SABottomNavigation() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "challenge", title: "Challenge", icon: "image-filter-hdr" },
    { key: "team", title: "Team", icon: "account-group" },
    { key: "settings", title: "Settings", icon: "cog" },
  ]);
  const { navigationIndex, setNavigationIndex } =
    React.useContext(UserDataContext);

  useEffect(() => {
    if (navigationIndex) {
      setIndex(navigationIndex);
    }
  }, [navigationIndex]);

  const renderScene = BottomNavigation.SceneMap({
    challenge: ChallengeScreen,
    team: TeamScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={(newIndex) => {
        setIndex(newIndex);
        setNavigationIndex(newIndex);
      }}
      renderScene={renderScene}
    />
  );
}
