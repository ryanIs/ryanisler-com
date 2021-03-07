/**
 * GameRoute-flash.js
 * 
 * This JavaScript file used to allow flash games to play directly in the browser.
 * The good old days..
 * 
 * @depricated
 *  Flash is no longer supported.
 */

import React, { useState, useEffect } from 'react'
import { Prompt } from 'react-router-dom'
import utils from '../../../js/Utilities'

// border: 1px solid rgba(255, 255, 255, 0.082);
const GAME_PADDING = 0

function GameRoute(props) {

  const [showInstructions, setShowInstructions] = useState('container play-game-info hide-info')


  useEffect(() => {
    if(promptWhenLeaving) {
      window.onbeforeunload = () => true
    }
    else {
      window.onbeforeunload = null
    }
  })

  useEffect(() => (() => {
    promptWhenLeaving = false
    window.onbeforeunload = null
  }))
  
  useEffect(() => {
    utils.setDocumentTitle('Ryan Isler - Games')
    utils.initRoute()
  }, [])

  let promptWhenLeaving = true

  const game = props.game

  const toggleInstructions = (mouseEvent) => {

    setShowInstructions(
      (showInstructions.indexOf('hide') != -1) ? 
      'container play-game-info' :
      'container play-game-info hide-info'
    )

  }

  return(
    <div className='game-route-wrapper'>

      <Prompt
        when={promptWhenLeaving}
        message='Are you sure you would like to exit? Any unsaved data will be lost.'
        />

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
                <object 
                classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" 
                width={game.game.gameFileWidth + GAME_PADDING} 
                height={game.game.gameFileHeight + GAME_PADDING} 
                className="play-game-flash-object"
                >

                  <param name="movie" value={utils.getGameSWFFile(game.game.gameFile, game.id)} />
                  <param name="allowScriptAccess" value="sameDomain" />

                  <object 
                  type="application/x-shockwave-flash" 
                  data={utils.getGameSWFFile(game.game.gameFile, game.id)} 
                  width={game.game.gameFileWidth + GAME_PADDING} 
                  height={game.game.gameFileHeight + GAME_PADDING} 
                  id="flash-object"
                  >
                    <param name="movie" value={utils.getGameSWFFile(game.game.gameFile, game.id)} />
                    <param name="allowScriptAccess" value="sameDomain" />

                    <a href="http://www.adobe.com/go/getflash">
                      <img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash player" />
                    </a>

                  </object>

                </object>

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