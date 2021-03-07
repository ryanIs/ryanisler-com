/**
 * GameRoutes.js
 * 
 * Handles the game routing.
 */

import React, { useState, useEffect } from 'react'
import GameRoute from './GameRoute'
import { Route } from "react-router-dom"
import utils from '../../../js/Utilities'

/**
 * Main GameRoutes component.
 * 
 * @param {Object} props Properties passed by parent.
 * @returns {JSX} Render JSX.
 */
function GameRoutes(props) {

  const [gameData, setRoutes] = useState()

  /**
   * Sets the routes based on the games.json input.
   * 
   * @param {Object} data Input from games.json.
   */
  const routeData = (data) => {
    if(gameData == null) {

      setRoutes(data)

    }
  }
  
  props.dataLoader.getData(props.dataLoader.GAMES_JSON, routeData)

  // <Switch> (rect-router-dom 5.2) doesn't allow React Fragments, so return an array of routes
  return (gameData != null) ?

        // Map over game genres
        Object.keys(gameData).flatMap((genre, index) => {

          // Not the 'UPCOMING' genre (which is a preview)
          if(genre != utils.UPCOMING_GAME) {
            
            // Map GAMES for the selected GENRE
            return gameData[genre].map((game, index) => 
              <Route path={`/games/${game.id}`} render={(props) => <GameRoute game={game} />} key={`genre-${index}`} />
            )

          }

        })
        :
        null
  
}

export default GameRoutes