import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

function HomeScreen() {
  return (
    <View style={style.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

const style = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });