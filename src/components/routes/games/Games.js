import React, { useState } from 'react'
import Game from './game/Game'

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

                <h1>{genre}</h1>

              </div>

              <div className='genre-games-wrapper row'>
                
                {
                  gameGenres[genre].map((gameObject, index) => {


                    return(<Game game={gameObject} key={`game-obj-${index}`}/>)

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