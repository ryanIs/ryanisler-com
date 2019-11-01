import React, { useState, useEffect } from 'react'
import utils from '../../../js/Utilities'

function GameRoutes(props) {

  const [gameData, setRoutes] = useState()

  const game = props.game

  return(
    <div className='game-route-wrapper'>

      <div className='navbar-spacing'></div>

      <div className='play-game-wrapper'>
        <div className='play-game-content'>

          <div className='play-game-header'>
            <img src={utils.getGameHeaderImage(game.game.headerImage, game.gameId)} alt={game.title} />
            <div className='play-game-info-button'>i</div>
          </div>

          {
            (game.game.type == 'FLASH') ?
            (

              <div className='play-game-game'>
                <object 
                classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" 
                width={game.game.gameFileWidth} 
                height={game.game.gameFileHeight} 
                className="play-game-flash-object"
                >

                  <param name="movie" value={utils.getGameSWFFile(game.game.gameFile, game.gameId)} />
                  <param name="allowScriptAccess" value="sameDomain" />

                  <object 
                  type="application/x-shockwave-flash" 
                  data={utils.getGameSWFFile(game.game.gameFile, game.gameId)} 
                  width={game.game.gameFileWidth} 
                  height={game.game.gameFileHeight} 
                  id="flash-object"
                  >
                    <param name="movie" value={utils.getGameSWFFile(game.game.gameFile, game.gameId)} />
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

          <div className='play-game-info'>

            <div className='game-instructions'>{game.instruections}</div>
            <div className='game-description'>{game.description}</div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default GameRoutes