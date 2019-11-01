
const ICONS = {
  FLASH: '/images/games/flash-icon.png',
  UNITY: '/images/games/unity-icon.png',
}

const UPCOMING_GAME_STR = 'UPCOMING'

export default {

  UPCOMING_GAME: UPCOMING_GAME_STR,

  initRoute: function() {

    // When viewing a new router, scroll to the top.
    window.scrollTo(0, 0)

  },

  getGameSWFFile(gameSrc, gameId) {
    
    if(gameSrc == null) {
      return ''
    }

    if(gameSrc.toUpperCase() == 'DEFAULT') {
      return `/games/${gameId}/${gameId}.swf`
    }

    return gameSrc

  },

  getGameHeaderImage(imageSrc, gameId) {
    
    let imageArgs
    
    if(imageSrc == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'DEFAULT') {
      return `/games/${gameId}/${gameId}.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `url(/images/games/preview/${gameId}.${imageArgs[1]})`
    }
    
    return imageSrc

  },

  // Objective: Handle 'null' case for default TEXT inside box (or cool icon)
  getGamePreviewBGImage: function(imageSrc, gameId) {
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
  },

  // TODO: set <source type> dynamically
  getGameVideo: function (videoSrc, gameId) {
    
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

  },

  getGameIcon: function (strPlatform) {

    strPlatform = strPlatform.toLowerCase()

    if(strPlatform.indexOf('flash') != -1) {
      return ICONS.FLASH
    }
    
    else if(strPlatform.indexOf('unity') != -1) {
      return ICONS.UNITY
    }
    
    return ICONS.FLASH
  },

  

  getReleaseDate: function (ISODate) {

    let relDate = new Date(ISODate)

    let strDate = relDate.toLocaleString('default', {month: 'long'})

    strDate = strDate + ` ${relDate.getFullYear()}`

    return strDate

  },

}