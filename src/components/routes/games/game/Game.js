import React, { useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import utils from '../../../../js/Utilities'

// TODO: Add this to a (global) React.Context
const SOUND_ENABLED_STRING = 'sound-enabled'
const SOUND_DISABLED_STRING = 'sound-disabled'


function Game(props) {

  useEffect(() => {
    updateSoundMuted()
  }, [props.soundEnabled])

  utils.initRoute()

  // Video HTML element reference for changing video
  const videoRef = React.createRef()
  const videoWrapperRef = React.createRef()
  const gameContentRef = React.createRef()

  const VIDEO_NOT_PLAYING_STYLE = '0.0'

  const VIDEO_PLAYING_STYLE = '1.0'

  const releaseDate = utils.getReleaseDate(props.game.releaseDate)

  const gameIcon = utils.getGameIcon(props.game.platform)

  // Sets background iamge
  const gameContainerStyle = {
    backgroundImage: utils.getGamePreviewBGImage(props.game.image, props.game.gameId)
  }

  // Sets game video
  const gameVideo = utils.getGameVideo(props.game.video, props.game.gameId)

  const gameSoundBtnStyle = (props.game.video == null) ?
    {display: 'none'} : {}


  const updateSoundMuted = () => {
    if(videoRef.current != null) {
      videoRef.current.muted = (props.soundEnabled == SOUND_ENABLED_STRING) ? false : true
    }
  }

  const beginGameVideo = () => {

    gameContentRef.current.style.opacity = VIDEO_PLAYING_STYLE

    if(videoRef.current == null) {
      return
    }

    updateSoundMuted()
    videoRef.current.play()
    videoWrapperRef.current.style.opacity = VIDEO_PLAYING_STYLE

  }

  const hideGameVideo = () => {

    gameContentRef.current.style.opacity = VIDEO_NOT_PLAYING_STYLE
    if(videoRef.current == null) {
      return
    }

    videoRef.current.muted = true
    videoRef.current.pause()
    videoWrapperRef.current.style.opacity = VIDEO_NOT_PLAYING_STYLE
    // videoRef.current.currentTime = 0

  }

  return(

    <div 
      className='game-wrapper col-md-4' style={gameContainerStyle} 
      onMouseOver={() => (beginGameVideo())} 
      onMouseOut={() => (hideGameVideo())}
    >
      
      {
        (props.game.video != null) ?
        (
          <div className='game-video-wrapper' ref={videoWrapperRef}>
            <video width="1057" height="595" muted ref={videoRef} loop>
              <source src={gameVideo} type="video/mp4" />
            </video> 
          </div>
        ) : null
      }

      <Link to={`/games/${props.game.gameId}`}>
        <div className='game-container' ref={gameContentRef}>

          <div className='game-platform'><img src={gameIcon} /></div>

          <h1>{props.game.title}</h1>
          <h2>{releaseDate}</h2>
          <h3>{props.game.descriptionShort}</h3>
          
          <div className='game-sound-button-wrapper' onClick={(mouseEvent) => {props.toggleGameSound(mouseEvent); }} style={gameSoundBtnStyle}>
            <div className={props.soundEnabled} />
          </div>

        </div>
      </Link>

    </div>
  )
}

export default Game