import React, { useState, useEffect } from 'react'
import Game from './game/Game'

const GENRES = {
  "Action": '/images/games/genres/action.png',
  "Arcade": '/images/games/genres/arcade.png',
  "Puzzle": '/images/games/genres/puzzle.png',
  "Strategy": '/images/games/genres/strategy.png',
  "Role-playing": '/images/games/genres/role-playing-game.png',
}

function Games(props) {

  const [gameGenres, setGenres] = useState()

  const displayGamesData = (data) => {
  if(gameGenres == null) {
      setGenres(data)
    }
  }

  props.dataLoader.getData(props.dataLoader.GAMES_JSON, displayGamesData)

  return(
    <div className='games-wrapper'>

      <div className='navbar-spacing'></div>

      {
        (gameGenres != null) ?
        Object.keys(gameGenres).map((genre, index) => {
          return (
            <div className='genre-wrapper' key={`genre-wrapper-${genre}`}>

              <div className='genre-header'>

                <h1><img className='games-genre-img' src={GENRES[genre]} /> {genre}</h1>

              </div>

              <div className='genre-games-wrapper row'>
                
                {
                  gameGenres[genre].map((gameObject, index) => {


                    return(<Game game={gameObject} key={`game-obj-${index}`} toggleGameSound={props.toggleGameSound} soundEnabled={props.soundEnabled}/>)

                  })
                }

              </div>

            </div>
          )
        }) : null
      }
      
    </div>
  )
}

export default Games