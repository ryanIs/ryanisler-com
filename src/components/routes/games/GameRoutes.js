import React, { useState, useEffect } from 'react'
import GameRoute from './GameRoute'
import { BrowserRouter as Router, Route } from "react-router-dom"
import utils from '../../../js/Utilities'

function GameRoutes(props) {

  const [gameData, setRoutes] = useState()

  const routeData = (data) => {
    if(gameData == null) {

      setRoutes(data)

    }
  }
  
  props.dataLoader.getData(props.dataLoader.GAMES_JSON, routeData)

  return(
    <React.Fragment>

      {
        // Game data successfully fetched
        (gameData != null) ?

        // Map over game genres
        Object.keys(gameData).map((genre, index) => {

          // Not the 'UPCOMING' genre (which is a preview)
          if(genre != utils.UPCOMING_GAME) {
            
            // Map GAMES for the selected GENRE
            return (

              <React.Fragment key={`genre-${index}`}>
              {
                  gameData[genre].map((game, index) => {

                  return(
                    <React.Fragment key={`game-route-${index}`}>
                      <Route path={`/games/${game.gameId}`} render={(props) => <GameRoute game={game} />} />
                    </React.Fragment>
                  )

                })
              }
              </React.Fragment>

            )

          }

        })
        :
        null
      }

</React.Fragment>
  )
}

export default GameRoutes