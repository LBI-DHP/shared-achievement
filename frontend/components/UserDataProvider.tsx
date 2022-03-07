import React, { useEffect, useState, useRef } from "react";
import dataManager from "../components/DataManager";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export const UserDataContext = React.createContext({
  userData: {
    id: null,
    username: null,
    team: null,
    expoToken: null,
    password: null,
  },
  setUserData: ({}) => {},
  updated: false,
  setUpdated: ({}) => {},
});

export const UserDataProvider = (props) => {
  const [userData, setUserData] = useState({
    id: null,
    username: null,
    team: null,
    expoToken: null,
    password: null,
  });

  const [updated, setUpdated] = useState(false);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const createNewUser = (mounted) => {
    dataManager.getUserPassword().then((password) => {
      registerForPushNotificationsAsync()
        .then((token) => {
          if (mounted)
            setUserData({
              ...userData,
              expoToken: token,
              password: password,
            });
        })
        .catch((e) => {
          console.log("Could not register for push notifications", e);
          setUserData({
            ...userData,
            password: password,
          });
        });
    });
  };

  useEffect(() => {
    let mounted = true;
    dataManager
      .getUserId()
      .then((id) => {
        if (id) {
          dataManager.getUserData(id).then((data) => {
            if (data === null) {
              createNewUser(mounted);
            } else {
              if (mounted) setUserData(data);
            }
          });
        } else {
          createNewUser(mounted);
        }
      })
      .catch((e) => console.log("Error:", e));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
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
  }, []);

  return (
    <UserDataContext.Provider
      value={{ userData, setUserData, updated, setUpdated }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
