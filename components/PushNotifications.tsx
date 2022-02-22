import Constants from 'expo-constants';
// import Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import {UserDataContext} from './UserDataProvider';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  


  export default function PushNotifications() {
    // const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef(null);
    const responseListener = useRef(null);
    const { userData, setUserData } = useContext(UserDataContext);
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => {
        //   setExpoPushToken(token);
          setUserData({...userData, expoToken: token}); // TODO: update copy object syntax
      });
  
      notificationListener.current = Notifications.addNotificationReceivedListener( (notification) => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {/* <Text>Your expo push token: {expoPushToken}</Text> */}
        <Text>Your expo push token: {userData.expoToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          {/* <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text> */}
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
    );
  }
  
  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log(token);

    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }