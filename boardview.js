'use strict'

import React from 'react'

import {
    Animated,
    Easing,
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'

var {width, height} = require('Dimensions').get('window')
var SIZE = 4 // four-by-four grid
var CELL_SIZE = Math.floor(width * 0.2) // 20% of the screen width
var CELL_PADDING = Math.floor(CELL_SIZE * 0.05) // 5% of the cell size
var BORDER_RADIUS = CELL_PADDING * 2
var TILE_SIZE = CELL_SIZE - CELL_PADDING * 2
var LETTER_SIZE = Math.floor(TILE_SIZE * 0.75)

var BoardView = React.createClass({
  getInitialState () {
    var opacities = new Array(SIZE * SIZE)
    for (var i = 0; i < opacities.length; i++) {
      opacities[i] = new Animated.Value(1)
    }
    return {opacities}
  },

  render () {
    return <View style={styles.container}>
      {this.renderTiles()}
    </View>
  },

  renderTiles () {
    var result = []
    var level = require('./levels.js')
    for (var row = 0; row < SIZE; row++) {
      for (var col = 0; col < SIZE; col++) {
        var id = row * SIZE + col
        var letter = level.letterGrid[row][col]
        var style = {
          left: col * CELL_SIZE + CELL_PADDING,
          top: row * CELL_SIZE + CELL_PADDING,
          opacity: this.state.opacities[id],
          backgroundColor: (() => {
            var greenTiles = level.endPoints[0]
            if (row === greenTiles[0][0] && col === greenTiles[0][1]) { return '#00ff00' }
            if (row === greenTiles[1][0] && col === greenTiles[1][1]) { return '#00ff00' }
            var redTiles = level.endPoints[1]
            if (row === redTiles[0][0] && col === redTiles[0][1]) { return '#ff0000' }
            if (row === redTiles[1][0] && col === redTiles[1][1]) { return '#ff0000' }
            return '#aaaeee'
          })()
        }
        result.push(this.renderTile(id, style, letter))
      }
    }
    return result
  },

  renderTile (id, style, letter) {
    return <Animated.View key={id} style={[styles.tile, style]}
      onStartShouldSetResponder={() => this.clickTile(id)}>
      <Text style={styles.letter}>{letter}</Text>
    </Animated.View>
  },

  clickTile (id) {
    var opacity = this.state.opacities[id]
    opacity.setValue(0.5) // half transparent, half opaque
    Animated.timing(opacity, {
      toValue: 1, // fully opaque
      duration: 250 // milliseconds
    }).start()
  }
})

var styles = StyleSheet.create({
  container: {
    width: CELL_SIZE * SIZE,
    height: CELL_SIZE * SIZE,
    backgroundColor: 'transparent'
  },
  tile: {
    position: 'absolute',
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    color: '#333',
    fontSize: LETTER_SIZE,
    backgroundColor: 'transparent',
    fontFamily: 'Alice-Regular'
  }
})

module.exports = BoardView
