import React, { useState, useEffect } from 'react'
import Game from './game/Game'
import utils from '../../../js/Utilities'

const GENRES_ICONS = {
  "Action": '/images/games/genres/action.png',
  "Arcade": '/images/games/genres/arcade.png',
  "Puzzle": '/images/games/genres/puzzle.png',
  "Strategy": '/images/games/genres/strategy.png',
  "Role-playing": '/images/games/genres/role-playing-game.png',
}

const UPCOMING_GENRE = 'UPCOMING'

function Games(props) {

  // All genres and game data. Gets set async.
  const [gameGenres, setGenres] = useState()

  // (async) when loaded, add the upcoming content to the DOM.
  const [upcomingStyles, setUpcomingStyles] = useState({
    upcomingStyle: {},
    videoJSX: <span className='upcoming-video-empty'></span>
  })

  const displayGamesData = (data) => {
  if(gameGenres == null) {

      setGenres(data)

      let upcomingStyleObject = {}

      if(data != null && data['UPCOMING'] != null) {

        if(data['UPCOMING'].backgroundImage != null) {

          upcomingStyleObject.upcomingStyle = {
            backgroundImage: `url(${data['UPCOMING'].backgroundImage})`
          }

        }

        if(data['UPCOMING'].video != null) {

          upcomingStyleObject.videoJSX = (
            <div className='upcoming-video-wrapper' title='View the trailer here!'>
              <video controls>
                <source src={data['UPCOMING'].video} />
              </video>
            </div> 
          )

        }

        setUpcomingStyles(upcomingStyleObject)

      }

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
            <React.Fragment  key={`genre-wrapper-${genre}`}>

              {
                (genre != UPCOMING_GENRE) ?
                (
                  <div className='genre-wrapper'>

                    <div className='genre-header'>

                      <h1><img className='games-genre-img' src={GENRES_ICONS[genre]} /> {genre}</h1>

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
                :
                (
                  <div className='genre-upcoming-wrapper'>

                    <h1 className='upcoming-game-header-text'>Upcoming game</h1>

                    <div className='genre-upcoming-content vertical-align' style={upcomingStyles.upcomingStyle}>

                      <div className='container genre-upcoming'>

                        <h1>{gameGenres[genre].title}</h1>
                        <h2>{gameGenres[genre].descriptionShort}</h2>

                        <img className='genre-upcoming-img' src={gameGenres[genre].image} />

                        {upcomingStyles.videoJSX}

                        <div className='genre-upcoming-description'>

                          <h3>{gameGenres[genre].description}</h3>

                        </div>

                      </div>

                    </div>
                    
                  </div>
                )
              }

            </React.Fragment>
          )
        }) : null
      }
      
    </div>
  )
}

export default Games