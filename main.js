'use strict';

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
} from 'react-native';

var Main = React.createClass({
  render() {
    return <View style={styles.container}>
             <View style={styles.tile}>
               <Text style={styles.letter}>A</Text>
             </View>
           </View>;
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#644B62',
  },
  tile: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BEE1D2',
  },
  letter: {
    color: '#333',
    fontSize: 80,
  },
});

module.exports = Main;