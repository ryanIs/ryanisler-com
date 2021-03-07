/**
 * GameRoute.js
 * 
 * Game route page used when the player is playing a game.
 */

import React, { useState, useEffect } from 'react'
import { Prompt } from 'react-router-dom'
import utils from '../../../js/Utilities'

// border: 1px solid rgba(255, 255, 255, 0.082);
const GAME_PADDING = 0

/**
 * Main GameRoute component.
 * 
 * @param {Object} props Properties passed by parent.
 * @returns {JSX} Render JSX.
 */
function GameRoute(props) {

  const [showInstructions, setShowInstructions] = useState('container play-game-info hide-info')

  const game = props.game

  useEffect(() => {
    utils.setDocumentTitle(`Ryan Isler - ${game.title}`)
    utils.initRoute()
  }, [])
  
  /**
   * Toggle the visibility of the instructions.
   * 
   * @param {Object} mouseEvent Mouse event.
   */
  const toggleInstructions = (mouseEvent) => {

    setShowInstructions(
      (showInstructions.indexOf('hide') != -1) ? 
      'container play-game-info' :
      'container play-game-info hide-info'
    )

  }

  /**
   * This renders the download game icon SVG.
   * 
   * @returns {JSX} Render JSX.
   */
  const displayDownloadSVG = () => (
    <svg className="download-game-img" version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" enable-background="new 0 0 48 48">
        <g fill="#fff">
            <polygon points="24,37.1 13,24 35,24"/>
            <rect x="20" y="4" width="8" height="4"/>
            <rect x="20" y="10" width="8" height="4"/>
            <rect x="20" y="16" width="8" height="11"/>
            <rect x="6" y="40" width="36" height="4"/>
        </g>
    </svg>
  )

  return(
    <div className='game-route-wrapper'>

      <div className='navbar-spacing'></div>

      <div className='play-game-wrapper'>
        <div className='play-game-content'>

          <div className='play-game-header'>
            <img src={utils.getGameHeaderImage(game.game.headerImage, game.id)} alt={game.title} />
          </div>

          {
            (game.game.type == 'FLASH') ?
            (

              <div className='play-game-game'>

                <a className='game-image' title="Open this SWF file with the projecter to play the game." href={utils.getGameSWFFile(game.game.gameFile, game.id)}>
                  {displayDownloadSVG()}
                  <img src={utils.getGamePreviewImagePlain(game.image, game.id)} />
                </a>
                
                <div className='game-download-instructions'>
                  <p title="This game will be converted to HTMl5 soon so that it can be played directly in the browser.">
                    This game runs on Flash. To play this game, install the <a href="https://www.adobe.com/support/flashplayer/debug_downloads.html" target="_blank">Adobe Flash Player Projector.</a>
                  </p>
                  <p class="save-files-text" title="Once you save game data of any sort, make sure not to move the SWF file. The save files are tied to what folder the SWF file is in.">
                    Save files are based on where the SWF file exists. 
                    {/* https://stackoverflow.com/questions/15084338/sharedobject-location */}
                  </p>
                </div>

                <div className='game-download-wrapper'>
                  <a title="Download the Flash Player projecter for your operating system." href="https://www.adobe.com/support/flashplayer/debug_downloads.html" target="_blank"><button className='btn btn-default btn-primary download-flash'>Flash Player</button></a>
                  <a title="Open this SWF file with the projecter to play the game." href={utils.getGameSWFFile(game.game.gameFile, game.id)}><button className='btn btn-default btn-light download-game'>{game.title}</button></a>
                </div>

              </div>

            )
            :
            null
          }

          <div 
          className='play-game-info-button' 
          title='View game description and instructions'
          onClick={(mouseEvent) => {toggleInstructions(mouseEvent)}}
          >i</div>

          <div className={showInstructions}>

            <div className='game-instructions' dangerouslySetInnerHTML={{__html: game.instructions}}></div>
            <div className='game-description'>{game.description}</div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default GameRoute