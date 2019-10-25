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

      Refer to OBJECTIVES.TXT for what to do next :D
      
    </div>
  )
}

export default Games