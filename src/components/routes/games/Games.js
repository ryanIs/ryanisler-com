import React, { useState } from 'react'

function Games(props) {

  const [games, setGames] = useState()

  const displayGamesData = (data) => {
    if(games == null) {
      setGames(data)
    }
  }

  props.dataLoader.getData(props.dataLoader.GAMES_JSON, displayGamesData)

  return(
    <div className='games-wrapper'>

      <div className='navbar-spacing' />

      {
        (games != null) ?
        1 : 0 // Actually this is a genre, not a game.
      }
      
    </div>
  )
}

export default Games