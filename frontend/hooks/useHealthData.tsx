import { useEffect, useState } from 'react';
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

const useHealthData = () => {
  const [steps, setSteps] = useState(0);

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
  }, [androidPermissions]);

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
  }, [hasPermissions]);

  return { steps };

}

export default useHealthData;