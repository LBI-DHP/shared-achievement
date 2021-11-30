import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';

const MusicRoute = () => <Text>Albums</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const SABottomNavigation = ( navigation : any ) => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'music', title: 'Home', icon: 'home' },
    { key: 'albums', title: 'Group', icon: 'account-group' },
    { key: 'recents', title: 'Profile', icon: 'account-details' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: MusicRoute,
    albums: AlbumsRoute,
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

export default SABottomNavigation;