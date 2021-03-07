/**
 * Utilities.js
 * 
 * Contains helper functions.
 */

const ICONS = {
  FLASH: '/images/games/flash-icon.png',
  UNITY: '/images/games/unity-icon.png',
}

const UPCOMING_GAME_STR = 'UPCOMING'

const WEBSITE_TITLE_DEFAULT = 'Ryan Isler - web/game developer, digital artist, musician'

export default {

  UPCOMING_GAME: UPCOMING_GAME_STR,

  /**
   * Initiate the route the user is currently on.
   */
  initRoute: function() {

    // When viewing a new router, scroll to the top.
    window.scrollTo(0, 0)

  },

  /**
   * Scroll the window to the top.
   */
  scrollToTop: function() {
    window.scrollTo(0, 0)
  },

  /**
   * Set a cookie.
   * 
   * @param {String} cookieName Name of the cookie to set.
   * @param {String} cookieValue Value to set the cookie to.
   * @param {Number} expiresInDays Number of days the cookie will expire in.
   */
  setCookie(cookieName, cookieValue, expiresInDays = 3650) {
    let d = new Date();
    d.setTime(d.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  },
  
  /**
   * Get a cookie.
   * 
   * @param {String} cookieName Name of the cookie to get.
   * @returns {String} Returns the cookie.
   */
  getCookie(cookieName) {
    let name = cookieName + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },

  /**
   * Gets a random number between zero up to the max minus one.
   * 
   * @param {Number} max Input number maximum.
   * @returns Random number.
   */
  random(max) {
    return Math.round(Math.random() * max)
  },

  /**
   * Returns a string with random RGB values.
   * 
   * @returns {String} RGB string with random hex values.
   */
  randomRGBString() {
    return `rgb(${this.random(256)}, ${this.random(256)}, ${this.random(256)})`
  },

  /**
   * Returns a string with random light RGB values.
   * 
   * @returns {String} RGB string with random hex values.
   */
  randomLightRGBString() {
    return `rgb(${this.random(106) + 150}, ${this.random(106) + 150}, ${this.random(106) + 150})`
  },

  /**
   * Returns a string with random dark RGB values.
   * 
   * @returns {String} RGB string with random hex values.
   */
  randomDarkRGBString() {
    return `rgb(${this.random(126)}, ${this.random(126)}, ${this.random(126)})`
  },

  /**
   * Returns a human-readable album name.
   * 
   * @param {String} albumName Name of the ablum
   * @returns Human-readable album name.
   */
  getAlbumDisplayName(albumName) {

    if(albumName == 'FEATURED') {
      return 'Featured'
    }

    return albumName

  },

  /**
   * Gets the featured album image path for the song object.
   * 
   * @todo
   *  update this such that it dynamicallly takes the image from the first element (or not)
   * 
   * @param {Object} imageObj The Song object.
   * @returns {String} Relative path to the album art.
   */
  getFeaturedAlbumImage(imageObj) {
    
    // if(imageObj == null) {
    //   return ''
    // }

    // let imageArgs

    // let imageSrc = imageObj.image

    // let imageAlbumId = imageObj.albumId

    // if(imageSrc == null || imageSrc.toUpperCase() == 'DEFAULT') {
    //   return `/images/music/${imageAlbumId}/album-art.png`
    // }

    // else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
    //   return `/images/music/${imageAlbumId}/album-art.${imageArgs[1]}`
    // }
    
    // return imageSrc
    return `/images/music/FEATURED/album-art.png`

  },

  /**
   * Get the correct image corresponding to the song object.
   * 
   * @param {Object} imageObj Song Object taken from the music.json.
   * @returns {String} The best-fit image src. The priority is: SONG_IMAGE > ALBUM_IMAGE > null.
   */
  getAlbumImage(imageObj) {
    
    if(imageObj == null) {
      return ''
    }

    let imageArgs

    let imageSrc = imageObj.image

    let imageAlbumId = imageObj.albumId
    
    if(imageSrc == null && imageAlbumId == null) {
      return ''
    }

    if(imageSrc == null || imageSrc.toUpperCase() == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.${imageArgs[1]}`
    }
    
    return imageSrc

  },

  /**
   * Get the correct album image corresponding to the song object.
   * 
   * @param {Object} imageObj Song Object taken from the music.json.
   * @returns {String} The best-fit image src. The priority is: ALBUM_IMAGE > null.
   */
  getActualAlbumImage(imageObj) {
    
    if(imageObj == null) {
      return ''
    }

    let imageArgs

    let imageSrc = imageObj.albumImage

    let imageAlbumId = imageObj.albumId
    
    if(imageSrc == null && imageAlbumId == null) {
      return ''
    }

    if(imageSrc == null || imageSrc.toUpperCase() == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.${imageArgs[1]}`
    }
    
    return imageSrc

  },
  
  /**
   * Get the song image for the input song object.
   * 
   * @param {Object} imageObj The Song object.
   * @returns {String} Path to the image.
   */
  getSongImage(imageObj) {
    
    if(imageObj == null) {
      return ''
    }

    let imageArgs

    let imageSrc = imageObj.image

    let imageAlbumId = imageObj.albumId

    let songId = imageObj.id
    
    if(imageSrc == null && imageAlbumId == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'SONG-DEFAULT') {
      return `/images/music/${imageAlbumId}/${songId}.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'SONG-DEFAULT') {
      return `/images/music/${imageAlbumId}/${songId}.${imageArgs[1]}`
    }

    if(imageSrc == null || imageSrc.toUpperCase() == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/music/${imageAlbumId}/album-art.${imageArgs[1]}`
    }
    
    return imageSrc

  },

  /**
   * Set the document title.
   * 
   * @param {String} titleText Text to set the title to.
   */
  setDocumentTitle(titleText = WEBSITE_TITLE_DEFAULT) {
    document.title = titleText
  },
  
  /**
   * Get the human-readable release date.
   * 
   * @param {String} dateYYYY-MM-DD Input date (in YYYY-MM-DD format)
   * @returns {Date} Human readable date object.
   */
  getHumanReleaseDate(dateYYYYMMDD) {

    let outputDate = new Date(Date.parse(dateYYYYMMDD + 'T00:00:00Z'))
    // console.log(dateYYYYMMDD)
    // console.log(outputDate)

    // Add one to convert UTC to actual upload day based on the json data
    outputDate.setDate(outputDate.getDate() + 1)

    outputDate = outputDate.toDateString()

    if(outputDate == null) {
      console.log('date is null')
      return ''
    }

    return outputDate
  },

  /**
   * Get the art image for the song object.
   * 
   * @param {Object} imageObj The song object.
   * @returns {String} Path to the image
   */
  getArtImage(imageObj) {
    
    if(imageObj == null) {
      return ''
    }

    let imageArgs

    let imageSrc = imageObj.file

    let imageAlbumId = "art"

    if(imageSrc == null && imageAlbumId == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'DEFAULT') {
      return `/images/art/art/${imageObj.id}.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/art/art/${imageObj.id}.${imageArgs[1]}`
    }
    
    return imageSrc

  },

  /**
   * Gets the song file for a song object.
   * 
   * @param {Object} songObj The song object.
   * @returns {String} Path to the song object.
   */
  getAlbumSongFile(songObj) {

    let fileArgs

    let fileSrc = songObj.file

    let albumId = songObj.albumId

    let songId = songObj.id

    if(fileSrc == null) {
      return `/music/${albumId}/${songId}.mp3`
    }

    if(fileSrc.toUpperCase() == 'DEFAULT') {
      return `/music/${albumId}/${songId}.mp3`
    }

    // Unique file type
    else if((fileArgs = fileSrc.split('_'))[0] == 'DEFAULT') {
      return `/music/${albumId}/${songId}.${fileArgs[1]}`
    }
    
    return fileSrc

  },

  /**
   * Get the path for a game.
   * 
   * @param {String} gameSrc Game source.
   * @param {String} id Game identifier.
   * @returns The path to the game.
   */
  getGameSWFFile(gameSrc, id) {
    
    if(gameSrc == null) {
      return ''
    }

    if(gameSrc.toUpperCase() == 'DEFAULT') {
      return `/games/${id}/${id}.swf`
    }

    return gameSrc

  },

  /**
   * Get the game header image path.
   * 
   * @param {String} imageSrc Image source
   * @param {String} id Game identifier
   * @returns {String} Path to the game
   */
  getGameHeaderImage(imageSrc, id) {

    let imageArgs
    
    if(imageSrc == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'DEFAULT') {
      return `/games/${id}/${id}.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/games/preview/${id}.${imageArgs[1]}`
    }
    
    return imageSrc

  },

  /**
   * Get CSS with path to game preview background image.
   * 
   * @objective
   *  Handle 'null' case for default TEXT inside box (or cool icon)
   * 
   * @param {String} imageSrc Image source.
   * @param {String} id Game identifier.
   * @returns {String} CSS URL string with path.
   */
  getGamePreviewBGImage: function(imageSrc, id) {
    let imageArgs

    if(imageSrc == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'DEFAULT') {
      return `url(/images/games/preview/${id}.png)`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `url(/images/games/preview/${id}.${imageArgs[1]})`
    }
    
    return imageSrc
  },

  /**
   * Get the game preview image plain.
   * 
   * @param {String} imageSrc Image source.
   * @param {String} id Game identifier
   * @returns {String} Path to game preview image.
   */
  getGamePreviewImagePlain: function(imageSrc, id) {
    let imageArgs

    if(imageSrc == null) {
      return ''
    }

    if(imageSrc.toUpperCase() == 'DEFAULT') {
      return `/images/games/preview/${id}.png`
    }

    else if((imageArgs = imageSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/games/preview/${id}.${imageArgs[1]}`
    }
    
    return imageSrc
  },

  // TODO: 
  /**
   * Get the game video.
   * 
   * @todo
   *  set <source type> dynamically
   * 
   * @param {String} videoSrc Video source.
   * @param {String} id Game identifier.
   * @returns {String} Path to game video.
   */
  getGameVideo: function (videoSrc, id) {
    
    let videoArgs

    if(videoSrc == null) {
      return null
    }

    if(videoSrc.toUpperCase() == 'DEFAULT') {
      return `/images/games/preview/${id}.mp4`
    }

    else if((videoArgs = videoSrc.split('_'))[0] == 'DEFAULT') {
      return `/images/games/preview/${id}.${videoArgs[1]}`
    }

    return videoSrc

  },

  /**
   * Get the game icon based on the game platform.
   * 
   * @param {String} strPlatform Game platform type (flash | unity).
   * @returns {String} Path to game icon.
   */
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

  /**
   * Get the release date (date object).
   * 
   * @param {String} ISODate Input date in YYYY-MM-DD format.
   * @returns {Date} Date object based on ISODate input.
   */
  getReleaseDate: function (ISODate) {

    let relDate = new Date(ISODate)

    let strDate = relDate.toLocaleString('default', {month: 'long'})

    strDate = strDate + ` ${relDate.getFullYear()}`

    return strDate

  },

}