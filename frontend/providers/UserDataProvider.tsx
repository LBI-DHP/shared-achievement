import React, { useEffect, useState, useRef, useContext } from "react";
import dataManager from "../components/DataManager";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { UpdateContext } from "./UpdateProvider";
import Constants from "expo-constants";

export const UserDataContext = React.createContext({
  userData: {
    id: null,
    username: null,
    team: null,
    expoToken: null,
    targetGoal: null,
    showDeveloperSettings: false,
  },
  setUserData: ({ }) => { },
  navigationIndex: 0,
  setNavigationIndex: ({ }) => { },
  isUserDataLoading: true,
  userDataLoadingError: false,
  userChallengeData: { progress: 0, totalSteps: 0, goal: 0 },
  isUserChallengeDataLoading: true,
});

export const UserDataProvider = (props) => {
  const [userData, setUserData] = useState({
    id: null,
    username: null,
    team: null,
    expoToken: null,
    targetGoal: null,
    showDeveloperSettings: false,
  });

  const [navigationIndex, setNavigationIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [userDataLoadingError, setUserDataLoadingError] = useState(false);

  const [userChallengeData, setUserChallengeData] = useState({
    progress: 0,
    totalSteps: 0,
    goal: 0,
  });

  const [isUserChallengeDataLoading, setIsUserChallengeDataLoading] =
    useState(true);

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const { apiReloadIndicator, stepsPushedIndicator, midnightIndicator } =
    useContext(UpdateContext);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const createNewUser = (mounted) => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token.data) token = token.data;
        if (mounted)
          setUserData({
            ...userData,
            expoToken: token,
          });
      })
      .catch((e) => {
        console.log("Could not register for push notifications", e);
      })
      .finally(() => {
        if (mounted) setIsUserDataLoading(false);
      });
  };

  useEffect(() => {
    let mounted = true;
    if (userData.id === null) {
      dataManager
        .getUserId()
        .then((id) => {
          if (id) {
            dataManager.getUserData(id).then((data) => {
              if (mounted) {
                if (data === -1) {
                  setUserDataLoadingError(true);
                  setIsUserDataLoading(false);
                } else if (data === null) {
                  createNewUser(mounted);
                } else {
                  if (Platform.OS === "ios") {
                    // if a newer version of the app is installed via TestFlight,
                    // the user data is saved (including the ExpoPushToken),
                    // but not the permission settings,
                    // so permission to send push notifications must be granted again
                    registerForPushNotificationsAsync();
                  }
                  setUserData(data);
                  setIsUserDataLoading(false);
                }
              }
            });
          } else {
            createNewUser(mounted);
          }
        })
        .catch((e) => console.log("Error:", e));
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        if (mounted) setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      mounted = false;
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userData.id]);

  useEffect(() => {
    setIsUserChallengeDataLoading(true);
    let mounted = true;
    dataManager
      .getUserChallengeData(userData.id)
      .then((data) => {
        if (mounted && data) {
          if (!data.progress || isNaN(data.progress) || data.progress < 0)
            data.progress = 0;

          if (
            !data.total_steps ||
            isNaN(data.total_steps) ||
            data.total_steps < 0
          )
            data.totalSteps = 0;
          else data.totalSteps = data.total_steps;

          delete data.total_steps;

          setUserChallengeData(data);
          setIsUserChallengeDataLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      mounted = false;
    };
  }, [apiReloadIndicator, stepsPushedIndicator, midnightIndicator]);

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        navigationIndex,
        setNavigationIndex,
        isUserDataLoading,
        userDataLoadingError,
        userChallengeData,
        isUserChallengeDataLoading,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log("Is device:", Device.isDevice); 

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    console.log("finalStatus:" + finalStatus, existingStatus);
    console.log("projectId:" + Constants.expoConfig.extra.eas.projectId);

    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
    
    console.log("token:" + token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
