'use strict'

import React from 'react'

import {
    Animated,
    Easing,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    PanResponder
} from 'react-native'

import _ from 'lodash'
import util from './util.js'

var {width, height} = require('Dimensions').get('window')
var SIZE = 4 // four-by-four grid
var CELL_SIZE = Math.floor(width * 0.2) // 20% of the screen width
var CELL_PADDING = Math.floor(CELL_SIZE * 0.05) // 5% of the cell size
var BORDER_RADIUS = CELL_PADDING * 2
var TILE_SIZE = CELL_SIZE - CELL_PADDING * 2
var LETTER_SIZE = Math.floor(TILE_SIZE * 0.75)

// tile colors
var COLOR_INACTIVE = "#d5d5d5"
var COLOR_RED = "#ff0000"
var COLOR_GREEN = "#00ff00"

var BoardView = React.createClass({
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        let [col, row] = this.xyToColRow(gestureState.x0, gestureState.y0)
        this.setState({
          panColor: this.getInitialTileColor(row, col)
        })
      },

      onPanResponderMove: (evt, gestureState) => {
        var currCoords = [this.currentlySwipedTile()]
        var updatedCoordsArray = _.uniqWith(currCoords.concat(this.state.pan.activeCoords), _.isEqual)
        this.setState({
          pan: {
            x0: gestureState.x0,
            y0: gestureState.y0,
            dx: gestureState.dx,
            dy: gestureState.dy,
            activeCoords: updatedCoordsArray
          }
        })
      },

      onPanResponderRelease: (e, {vx, vy}) => {
        this.setState({
          pan: {
            x0: 0,
            y0: 0,
            dx: 0,
            dy: 0,
            activeCoords: [[]]
          }
        })
      }
    })
  },

  getInitialState () {
    return {
      panColor: null,
      pan: {
        x0: 0,
        y0: 0,
        dx: 0,
        dy: 0,
        activeCoords: [[]]
      },
      board: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      }
    }
  },

  render () {
    return <View style={styles.container} {...this._panResponder.panHandlers} onLayout={this.onLayout}>
      {this.renderTiles()}
    </View>
  },

  // set absolute coords and dimensions for game board in viewport
  onLayout (e) {
    let {x, y, width, height} = e.nativeEvent.layout
    this.setState({
      board: {x, y, width, height}
    })
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
          backgroundColor: this.getTileColor(row, col)
        }
        result.push(this.renderTile(id, style, letter))
      }
    }
    return result
  },

  getTileColor (row, col) {
    if (this.getInitialTileColor(row, col) !== COLOR_INACTIVE) {
      return this.getInitialTileColor(row, col)
    }
    if (util.arrayInArray([col, row], this.state.pan.activeCoords)) {
      return this.state.panColor
    }
    return this.getInitialTileColor(row, col)
  },

  getInitialTileColor (row, col) {
    var level = require('./levels.js')
    var greenTiles = level.endPoints[0]
    if (row === greenTiles[0][0] && col === greenTiles[0][1]) { return COLOR_GREEN }
    if (row === greenTiles[1][0] && col === greenTiles[1][1]) { return COLOR_GREEN }
    var redTiles = level.endPoints[1]
    if (row === redTiles[0][0] && col === redTiles[0][1]) { return COLOR_RED }
    if (row === redTiles[1][0] && col === redTiles[1][1]) { return COLOR_RED }
    return COLOR_INACTIVE
  },

  xyToColRow (x, y) {
    let normalX = x - this.state.board.x
    let normalY = y - this.state.board.y
    let col = Math.floor(normalX / CELL_SIZE)
    let row = Math.floor(normalY / CELL_SIZE)
    return [col, row]
  },

  currentlySwipedTile () {
    return this.xyToColRow(this.state.pan.x0 + this.state.pan.dx, this.state.pan.y0 + this.state.pan.dy)
  },

  isBeingSwiped (row, col) {
    let [panCol, panRow] = this.currentlySwipedTile()
    if (row === panRow && col === panCol) {
      return true
    }
  },

  renderTile (id, style, letter) {
    return <Animated.View key={id} style={[styles.tile, style]}
      onStartShouldSetResponder={() => this.clickTile(id)}>
      <Text style={styles.letter}>{letter}</Text>
    </Animated.View>
  },

  clickTile (id) {
    //
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
