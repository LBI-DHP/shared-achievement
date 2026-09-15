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

import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import {
  initialize,
  requestPermission,
  readRecords,
} from 'react-native-health-connect';
import { Permission } from 'react-native-health-connect/lib/typescript/types';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';

import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
} from "react-native-health";

import { AppState } from "react-native";

const useHealthData = () => {
  const [steps, setSteps] = useState(0);
  const appState = useRef(AppState.currentState);
  const [appHasComeToForeground, setAppHasComeToForeground] = useState(true);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setAppHasComeToForeground(true);

      } else {
        setAppHasComeToForeground(false);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // ============== android ============== 

  const [androidPermissions, setAndroidPermissions] = useState<Permission[]>([]);

  const hasAndroidPermission = (recordType: string) => {
    return androidPermissions.some((perm) => perm.recordType === recordType);
  };

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const init = async () => {
      // initialize the client
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.log('Failed to initialize Health Connect');
        return;
      }

      // request permissions
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' }
      ]);

      setAndroidPermissions(grantedPermissions);
    };

    init();
  }, []);

  useEffect(() => {
    if (!hasAndroidPermission('Steps')) {
      return;
    }
    const getHealthData = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date (00:00:00.000)

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: today.toISOString(),
        endTime: tomorrow.toISOString(),
      };

      // Steps
      const steps = await readRecords('Steps', { timeRangeFilter });
      const totalSteps = steps.reduce((sum, cur) => sum + cur.count, 0);
      setSteps(totalSteps);
    };

    getHealthData();
  }, [androidPermissions, appHasComeToForeground]);

  // ============== ios ============== 

  const { Permissions } = AppleHealthKit.Constants;

  const permissions: HealthKitPermissions = {
    permissions: {
      read: [
        Permissions.Steps
      ],
      write: [],
    },
  };

  const [hasPermissions, setHasPermission] = useState(false);

  useEffect(() => {

    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.initHealthKit(permissions, (err) => {
      if (err) {
        console.log('Error getting permissions (AppleHealthKit): ' + err);
        return;
      }
      setHasPermission(true);
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    // Query Health data
    const options: HealthInputOptions = {
      date: new Date().toISOString(),
    };

    AppleHealthKit.getStepCount(options, async (err, results) => {
      if (err) {
        console.log('Error getting steps (AppleHealthKit): ' + err);
        return;
      }
      setSteps(results.value);
    });
  }, [hasPermissions, appHasComeToForeground]);

  return { steps };

}

export default useHealthData;