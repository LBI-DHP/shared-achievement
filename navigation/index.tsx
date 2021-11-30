/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, KeyboardAvoidingView, Pressable } from 'react-native';

//import HomeScreen from '../screens/HomeScreen';
//import DetailsScreen from '../screens/DetailsScreen';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import {View, Text, StyleSheet, Image} from 'react-native';
import {Button, Appbar, Avatar, TextInput, BottomNavigation, HelperText} from "react-native-paper";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Shared Achievements"
        screenOptions={{
          header: (props) => <CustomNavigationBar {...props} />,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
      <SABottomNavigation
      />
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={style.container}>
      <Image
        style={style.titleImage}
        source={require('../assets/images/aaa-untersberg-100_1920x1080.jpg')}
     	/>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={style.container}>
      <Text>Details Screen</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    padding: 10,
  },
  titleImage:{
    alignItems: "center",
    textAlign: "center",
    resizeMode: "center",
    width: "100%",
  }, 
});

function CustomNavigationBar({ navigation, back }) {
  return (
    <Appbar.Header style={{margin: 10}}>
      <Avatar.Image
          size={40}
          source={require('../assets/images/grafik.png')}
      />
      <Appbar.Content title="Untersberg Challenge" subtitle="Shared Achievements" />
      
    </Appbar.Header>
  );
}

//const [text, setText] = React.useState('');

const text = "enter group name"

function GroupScene( ) {

  const [groupname, setText] = React.useState('');
  const [btnJoin, setbtnJoin] = React.useState(true);
  const [btnCreate, setbtnCreate] = React.useState(true);

  // TODO replace with implemented functions
  const checkIfGroupNameExists = (name) => {return name == 'exists'}
  const joinGroup = () => { console.log('Join: group ' + groupname) }
  const createGroup = () => { console.log('Create group: ' + groupname) }

  const changeText = (text) => {
    setText(text.toLowerCase()) // TODO allows only lowercase
    if (text.length == 0) {
      setbtnCreate(true);
      setbtnJoin(true)
    } else {
      if ( checkIfGroupNameExists(text) ) {
        setbtnJoin(false)
        setbtnCreate(true)
      } else {
        setbtnJoin(true)
        setbtnCreate(false)
      }
    }
  };

  return (
    <View style={style.container}>
      <Text style={style.heading}>Join/create a team to face the challenge</Text>
      <View style={{flexDirection: 'row'}}>
        <Text>Team Name:</Text>
        <View>
          <TextInput
            value={groupname}
            multiline={false}
            placeholder="Enter a team name"
            onChangeText={changeText}
            autoComplete={false}
          />
          <View style={{flexDirection: 'row'}}>
            <Button 
              mode="contained"
              disabled={btnJoin}
              onPress={joinGroup}>
              Join Group
            </Button>
            <Button 
              mode="contained" 
              disabled={btnCreate}
              onPress={createGroup}>
              Create Group
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

const MusicRoute = () => <Text>Albums</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const SABottomNavigation = ( navigation : any ) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'music', title: 'Home', icon: 'home' },
    { key: 'group', title: 'Group', icon: 'account-group' },
    { key: 'recents', title: 'Profile', icon: 'account-details' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    group: GroupScene,
    recents: RecentsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

//<Appbar.Action icon="account-details" onPress={() => navigation.navigate('Details')} />

/* export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
 */
/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
//const Stack = createNativeStackNavigator<RootStackParamList>();

/* function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
} */

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
/* const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
} */

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
/* function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
} */
