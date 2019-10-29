import React, { useState } from 'react'

const ICONS = {
  FLASH: '/images/games/flash-icon.png',
  UNITY: '/images/games/unity-icon.png',
}

// Objective: Handle 'null' case for default TEXT inside box (or cool icon)
function getBGImage(imageSrc, gameId) {
  let imageArgs

  if(imageSrc == null) {
    return ''
  }

  if(imageSrc.toUpperCase() == 'DEFAULT') {
    return `url(/images/games/preview/${gameId}.png)`
  }

  else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
    return `url(/images/games/preview/${gameId}.${imageArgs[1]})`
  }
  
  return imageSrc
}

// TODO: set <source type> dynamically
function getGameVideo(videoSrc, gameId) {
  let videoArgs

  if(videoSrc == null) {
    return null
  }

  if(videoSrc.toUpperCase() == 'DEFAULT') {
    return `/images/games/preview/${gameId}.mp4`
  }

  else if((videoArgs = videoSrc.split('_'))[0] == 'DEFAULT') {
    return `/images/games/preview/${gameId}.${videoArgs[1]}`
  }
  return videoSrc
}

function getGameIcon(strPlatform) {

  strPlatform = strPlatform.toLowerCase()

  if(strPlatform.indexOf('flash') != -1) {
    return ICONS.FLASH
  }
  
  else if(strPlatform.indexOf('unity') != -1) {
    return ICONS.UNITY
  }
  
  return ICONS.FLASH
}
function getReleaseDate(ISODate) {

  let relDate = new Date(ISODate)

  let strDate = relDate.toLocaleString('default', {month: 'long'})

  strDate = strDate + ` ${relDate.getFullYear()}`

  return strDate
}

function Game(props) {

  // Video HTML element reference for changing video
  const videoRef = React.createRef()
  const videoWrapperRef = React.createRef()

  const VIDEO_NOT_PLAYING_STYLE = '0.0'

  const VIDEO_PLAYING_STYLE = '1.0'

  // TODO: Set this later
  let videoMuted = true

  const releaseDate = getReleaseDate(props.game.releaseDate)

  const gameIcon = getGameIcon(props.game.platform)

  // Sets background iamge
  const gameContainerStyle = {
    backgroundImage: getBGImage(props.game.image, props.game.gameId)
  }

  // Sets game video
  const gameVideo = getGameVideo(props.game.video, props.game.gameId)

  const beginGameVideo = () => {
    if(videoRef.current == null) {
      return
    }
    videoRef.current.muted = videoMuted
    videoRef.current.play()
    videoWrapperRef.current.style.opacity = VIDEO_PLAYING_STYLE
  }

  const hideGameVideo = () => {
    if(videoRef.current == null) {
      return
    }
    videoRef.current.muted = true
    videoRef.current.pause()
    videoWrapperRef.current.style.opacity = VIDEO_NOT_PLAYING_STYLE
    videoRef.current.currentTime = 0
  }

  return(
    <div className='game-wrapper col-md-4' style={gameContainerStyle} 
    onMouseOver={() => (beginGameVideo())} 
    onMouseOut={() => (hideGameVideo())}>
      
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

      <div className='game-container'>
        <h1>{props.game.title}</h1>
        <div className='game-platform'><img src={gameIcon} /></div>
        <h2>{releaseDate}</h2>
        <h3>{props.game.descriptionShort}</h3>
      </div>
    </div>
  )
}

export default Game