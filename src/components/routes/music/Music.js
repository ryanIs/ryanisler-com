/**
 * Music.js
 * 
 * Music player for the music from music.json
 * 
 * @info
 *  Music Album Art standard dimensions: 3000 x 3000 pixels at 300 dpi
 * 
 *  Click outside of description UI to close it
 *    https://codesandbox.io/s/outside-alerter-hooks-lmr2y?module=/src/OutsideAlerter.js&file=/src/OutsideAlerter.js
 * 
 * @todo
 *  [x] Add 'play this song' button to description section.
 *  TEST Clicking on the default play button on Firefox (desktop) does not play the media. (first run)
 * 
 * @bugs
 *  [x]9) jinke-player playMode is '' and not the defaultPlayMode on startup
 *  [ ]0) 'orderLoop' with playlist with 1 song does NOT loop. ( however it does loop with singleLoop)
 * 
 * @wanted_features
 *  [ ] Move 'orderLoop' icon (react-jinke-music-player-mode-icon) nearer to the buttons
 *  [ ]0) LEFT/RIGHT arrow keys on the music description page moves the page forward/back
 *  [x] Scroll on the volume bar to increase/decrease volume
 *  [x] LEFT/RIGHT arrow keys while focused on the music player moves FORWARD/BACK 10-15 seconds
 *  [x] Is there anyway to be able to have a SLOW/SPEED UP feature like with 'best practice' app?
 *  [x] (somehow) increase the clickArea of the navigation (progress-bar) for music.
 *  [x] CTRL + CLICK on an album brings up the description page
 * 
 * @notes
 *  Use [xx:xx] in the song descriptions to scrub to that time in the currently viewed song.
 */

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from "prop-types"
import ReactJkMusicPlayer from "react-jinke-music-player" // ^4.4.3 - custom
import utils from '../../../js/Utilities'
import imgFeaturedMusic from '../../../img/music/featured-music.png'

// Important variables used to initiate a album or jam on page load
let INITIAL_ALBUM = 'FEATURED',
    INITIAL_TRACK = null,
    INITIAL_TRACK_ID_IS_VALID = null,
    INITIAL_LOADED_ONCE = null

// Set to true when the default album has been initiated
let defaultAlbumInit = null

// Set to true when 'albums' or 'jams' is available as a GET parameter in the URL.
let albumInfoRequestedOnLoad = false

// The loader will stop searching for albums from jams/albums once one has been found from either (string)
let windowPathAlbumFound = null

// Title of the song currently being played
let currentlyPlayingSongTitle = ""

// Album name currently being played. Set by Jinke's audioTrackChangeHandler.
let currentAlbumNow = null

let currentlyPlayingAlbumType = "albums"

// Audio loop beginning and end (seconds)
let loopStartSeconds = -1,
    loopEndSeconds = -1

let spaceKeyDown = false,
    leftKeyDown = false,
    rightKeyDown = false

// Used as a storage place for the volume when muting and unmuting
let mobileUnmuteVolume = 0

/**
 * Main Music component function.
 * 
 * @param {Object} props Properties from the parent.
 * @returns {JSX} Render JSX.
 */
function Music(props) {

  // Music JSON data
  const [albums, setAlbums] = useState()

  // Music JSON data
  const [jams, setJams] = useState()

  // String of currently played album
  const [currentAlbum, setCurrentAlbum] = useState()

  // Music player options required by the Jinke Music Player
  const [musicPlayerOptions, setMusicPlayerOptions] = useState()

  const [musicDescriptionInfo, setMusicDescriptionInfo] = useState({
    currentlyDisplayedAlbum: INITIAL_ALBUM,
    title: 'Title',
    releaseDate: 'Release Date',
    description: 'Description',
    image: imgFeaturedMusic
  })

  const [musicDescriptionSongs, setMusicDescriptionSongs] = useState()

  const [featuredAlbumDescriptionShort, setFeaturedAlbumDescriptionShort] = useState('')

  const [featuredImage, setFeaturedImage] = useState(imgFeaturedMusic)

  const [defaultdescFadeInStyle, setDefaultdescFadeInStyle] = useState({});

  // When loading a song on application init (via url GET), display the proper 
  // info once musicDescriptionSongs is ready
  useEffect(() => {

    let descriptionIndex = INITIAL_TRACK + 1
    
    // Display album information if no valid songId has been provided
    if(INITIAL_TRACK_ID_IS_VALID == false) {
      descriptionIndex = 0
    }

    if (albumInfoRequestedOnLoad) {

      songDescriptionOptionClick(descriptionIndex);
      descSelectorRef.current.selectedIndex = descriptionIndex;
      albumInfoRequestedOnLoad = false;
      INITIAL_LOADED_ONCE = true

      // console.log('INITIAL_ALBUM is: '+INITIAL_ALBUM)
      if(INITIAL_ALBUM != 'FEATURED') {
        document.getElementById(INITIAL_ALBUM).scrollIntoView();
      }

      // This would theoretically pause it after it starts, but the init music play SHOULD be auto stopped.
      // setTimeout(() => {
      // toggleMusicIsPlaying()
      // }, 1000)
    }
    
  }, [musicDescriptionSongs])
 

  // Initialize the 'FEATURED' album
  useEffect(() => {
    if(albums != null) {
      
      // Wait a bit for the jinke player to append to DOM
      setTimeout(() => {

        // Init
        handleWindowPathname(windowPathname)

        if(windowPathAlbumFound != "jams") {

          if(INITIAL_TRACK == null && INITIAL_ALBUM == 'FEATURED' || INITIAL_LOADED_ONCE == true) {
            initAlbum(INITIAL_ALBUM)
            // initAlbum("FEATURED")
            defaultAlbumInit = true
          }

          else if(windowPathAlbumFound == "albums") { 

            playAlbum(INITIAL_ALBUM, INITIAL_TRACK, true, false)
            displayAlbumDescription(albums[INITIAL_ALBUM], albums[INITIAL_ALBUM][0])
            albumInfoRequestedOnLoad = true
            currentlyPlayingSongTitle = albums[INITIAL_ALBUM][INITIAL_TRACK].title

            setTimeout(() => {
              if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null)
              reactJkMusicPlayerRef.current.setState({
                playMode: PLAYER_DEFAULT_PLAY_MODE
              })
            },600)

          }
        }

        setFeaturedAlbumDescriptionShort(albums['FEATURED'][0].albumDescriptionShort)
        setFeaturedImage(utils.getFeaturedAlbumImage(albums['FEATURED']))

      },500)

    }
    
  }, [albums])

  // Handle a init loadout from jams callback
  useEffect(() => {

    if(jams != null) {
      
      // Wait a bit for the jinke player to append to DOM
      setTimeout(() => {

        // Init
        handleWindowPathname(windowPathname, false)

        if(INITIAL_ALBUM != 'FEATURED' && windowPathAlbumFound == "jams" && INITIAL_LOADED_ONCE != true) {
          
          let delayTime = ((defaultAlbumInit) ? 1500 : 0)
          // console.log('delayTime is: '+delayTime) 
          // console.log('currentAlbum is: '+currentAlbum)
          // console.log('windowPathAlbumFound is: '+windowPathAlbumFound)
          // reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[0].id)
          // clearAudioList()
          setTimeout(() => {

            // console.log(INITIAL_ALBUM);
            playJam(INITIAL_ALBUM, INITIAL_TRACK, true, false)
            // playJam(INITIAL_ALBUM)
            // console.log(reactJkMusicPlayerRef.current.state);
            displayAlbumDescription(jams[INITIAL_ALBUM], jams[INITIAL_ALBUM][0])
            albumInfoRequestedOnLoad = true
            currentlyPlayingSongTitle = jams[INITIAL_ALBUM][INITIAL_TRACK].title

            setTimeout(() => {
              if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null)
              reactJkMusicPlayerRef.current.setState({
                playMode: PLAYER_DEFAULT_PLAY_MODE
              })
            },600)
            
            if(defaultAlbumInit) {
              setTimeout(() => {
                // reactJkMusicPlayerRef.current.forceUpdate()
                reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[INITIAL_TRACK].id, true)
                audioTrackChangeHandler(null, null, null)
              },600)
            }

          }, delayTime)
        }

      },500)

    }
    
  }, [jams])

  // useEffect(() => {
  //   if(defaultdescFadeInStyle.opacity != null && defaultdescFadeInStyle.opacity == 0) {
  //   setDefaultdescFadeInStyle({opacity: 1, transition: 'opacity 0.4s'})
  //   }
  // }, [defaultdescFadeInStyle])

  useEffect(() => {

    // setDefaultdescFadeInStyle({opacity: 0, transition: 'opacity 0.4s'})

    // setTimeout(() => {

      let descriptionText = document.getElementById('desc-description')

      if(descriptionText != null) {
        descriptionText.innerHTML = descriptionText.innerHTML.replace(/\[(\d\d:\d\d)\]/g, `<span>$1</span>`)
                                                                      //  \[([^|]*)|(.*)\]
        descriptionText.innerHTML = descriptionText.innerHTML.replace(/\[([^\|]*)\|(.*)\]/g, `<a href="$2">$1</a>`)
        // descriptionText.innerHTML = descriptionText.innerHTML.replace(/\[([^|]*)(|)/g, `<a href="$2">$1</a>`)
      }

      // setDefaultdescFadeInStyle({opacity: 1})

    // }, 200)

  }, [musicDescriptionInfo])

  // Music Route initiation
  useEffect(() => {
    init()
    initEvents()
    utils.initRoute()
    utils.setDocumentTitle('Ryan Isler - Music')
    return () => {
      removeAudioLoop()
      removeEvents()
      saveCookiesOnUnload()
    }
  }, [])

  // Used for loading music from pasted URL
  const windowPathname = window.location.pathname

  const reactJkMusicPlayerRef = useRef()
  const musicDescriptionWrapperRef = useRef()
  const musicDescriptionContentRef = useRef()
  const descSelectorRef = useRef()

  const PLAYER_DEFAULT_PLAY_MODE = 'orderLoop'

  const PROGRESS_BAR_TITLE_TEXT = 'Left / Right (Ctrl, Shft): seek, rate, song\nSpace (Shft): (un)pause, loop [1: A, 2: B, 3: disable]\nUp / Down (Shft): volume'

  // Handle key presses while the mouse is focused on the bottom music panel
  // Called when reactJinke player ref is loaded
  useEffect(() => {
    
    // console.log(React.findDOMNode(reactJkMusicPlayerRef))

    // reactJkMusicPlayerRef.current.addEventListener('keydown', (a) => {
      // console.log(23432)
    // })

    // Add volume bar in mini player (like how is this not already a feature)
    // addVolumeUIToMobilePlayer()

    // Add key events when music player is focused
    let bottomMusicPanel = document.querySelector('.react-jinke-music-player-main')

    if(bottomMusicPanel != null) {
      bottomMusicPanel.setAttribute('tabIndex', '0')
      bottomMusicPanel.addEventListener('keydown', keyDownHandler)
      bottomMusicPanel.addEventListener('wheel', scrollWhellHandler)
      bottomMusicPanel.addEventListener('keyup', keyUpHandler)

      // setTimeout(() => {

      //   let progressLoadBar = document.querySelector('.progress-bar')
      //   console.log(progressLoadBar);
      //   if(progressLoadBar != null) {
      //     progressLoadBar.setAttribute('title', PROGRESS_BAR_TITLE_TEXT)
      //   }

      // }, 2000);

    }
    
    // Set the initial player volume based on the music volume cookie (if available) 
    setTimeout(() => {
      if(musicVolumeLevelCookie != null && musicVolumeLevelCookie != "") {
        setCurrentVolume(parseInt(musicVolumeLevelCookie))
      }
    }, 600)

    // when reactJkMusicPlayerRef unmounts
    return () => {

      clearAudioList()

      if(bottomMusicPanel != null) {
        bottomMusicPanel.removeEventListener('keydown', keyDownHandler)
        bottomMusicPanel.removeEventListener('keyup', keyUpHandler)
      }
      
    }

  }, [reactJkMusicPlayerRef])

  let musicVolumeLevelCookie = utils.getCookie('mvl')

  let propTypes = {
    children: PropTypes.element.isRequired
  }

  let playerWasJustStopped = false

  /**
   * Formats the appearance of the loop indicator when the window is resized.
   */
  const loopPropertiesWindowResizeHandler = () => {

    let rcSliderParent = isMobile() ? '.react-jinke-music-player-mobile-progress' : '.progress-bar'

    let rcSliderDiv = document.querySelector('.progress-bar .rc-slider') || document.querySelector('.react-jinke-music-player-mobile-progress .rc-slider')
    let loopSectionDiv = document.querySelector(`${rcSliderParent} .rc-slider .rc-loop`)

    if(rcSliderDiv != null) {
      
      // If loop is set/enabled
      if(loopEndSeconds != -1) {

        if(loopSectionDiv == null) {
          loopSectionDiv = document.createElement('span')
          loopSectionDiv.className = 'rc-loop'
          rcSliderDiv.appendChild(loopSectionDiv)
        }

        let playBarSliderWidth = rcSliderDiv.clientWidth // || 801

        let loopTotalTime = reactJkMusicPlayerRef.current.audio.duration
        let [sliderLeftPosition, sliderWidth] = getLoopLineProperties(loopStartSeconds, loopEndSeconds, loopTotalTime, playBarSliderWidth)
        
        loopSectionDiv.style.left = `${sliderLeftPosition}px`
        loopSectionDiv.style.width = `${sliderWidth}px`

      }

    }
    
  }

  /**
   * Handles window resize.
   * 
   * @param {Object} event Window resize event.
   */
  const windowResizeHanler = (event) => {
    // addVolumeUIToMobilePlayer()
    loopPropertiesWindowResizeHandler()
  }

  /**
   * Add event listeners.
   */
  const initEvents = () => {

    window.addEventListener('resize', windowResizeHanler)

  }

  /**
   * Remove event listeners.
   * 
   * @objective
   *  Why is this commented out?
   */
  const removeEvents = () => {

    // window.removeEventListener('resize', windowResizeHanler)

  }

  /**
   * Stores the volume level for the next time the player returns.
   */
  const saveCookiesOnUnload = () => {

    // Store volume level
    utils.setCookie('mvl', getCurrentVolume())

  }

  /**
   * Gets the track ID for the currently play ID.
   * 
   * @param {Array<object>} myAudioList Jinke's audio list.
   * @param {String} currentPlayId Jinke's audio tag id.
   * @returns {Number} index of track being currently played
   */
  const getTrackIdForCurrentPlayId = (myAudioList, currentPlayId) => {

    if (myAudioList != null) {
      for (let i = 0; i < myAudioList.length; i++) {
        if (myAudioList[i].id == currentPlayId) {
          return i
        }
      }
    }

    return 0

  }

  /**
   * Get the track ID for the input songId.
   * 
   * @param {Array<Object>} albumSongsArr Array of song objects.
   * @param {String} songId Song ID to look for.
   * @returns {Number} Track index.
   */
  const getTrackIdForSongId = (albumSongsArr, songId) => {

    // for(let myTrackNumber in albumSongsArr) {
    for(let myTrackNumber = 0; myTrackNumber < albumSongsArr.length; myTrackNumber++) {
      if(songId == albumSongsArr[myTrackNumber].id) {
        return myTrackNumber
      }
    }

    return 0
    // return null

  }

  /**
   * Determine if a songId exists in the albumSongsArr array.
   * 
   * @param {Array<Object>} albumSongsArr Array of song objects.
   * @param {String} songId Song ID to look for.
   * @returns {Boolean} Does the songId exist?
   */
  const songIdExistsInAlbum = (albumSongsArr, songId) => {

    for(let myTrackNumber = 0; myTrackNumber < albumSongsArr.length; myTrackNumber++) {
      if(songId == albumSongsArr[myTrackNumber].id) {
        return true
      }
    }

    return false

  }

  /**
   * Get the album object for inputAlbumId.
   * 
   * @param {String} inputAlbumId Input album ID.
   * @returns {Object} Album object.
   */
  const getAlbumObjectFromAlbumName = (inputAlbumId) => {

    if (albums != null) {
      let albumKeys = Object.keys(albums);
      for (let albumId of albumKeys) {
        if (inputAlbumId == albumId) {
          return albums[albumId]
        }
      }
    }

    if (jams != null) {
      let jamKeys = Object.keys(jams);
      for (let jamId of jamKeys) {
        if (inputAlbumId == jamId) {
          return jams[jamId]
        }
      }
    }

    return albums["FEATURED"]

  }

  /**
   * Get track ID for song name.
   * 
   * @param {Array<Object>} albumSongsArr Album Songs array.
   * @param {String} songName Song Name.
   * @returns {Number} Track Number.
   */
  const getTrackIdForSongName = (albumSongsArr, songName) => {

    // for(let myTrackNumber in albumSongsArr) {
    for(let myTrackNumber = 0; myTrackNumber < albumSongsArr.length; myTrackNumber++) {
      if(songName == albumSongsArr[myTrackNumber].title) {
        return myTrackNumber
      }
    }

    return 0
    // return null

  }

  /**
   * Get song ID for songName.
   * 
   * @param {Array<Object>} albumSongsArr Array of song objects.
   * @param {String} songName Song name to look for.
   * @returns {String} Song ID
   */
  const getSongIdForSongName = (albumSongsArr, songName) => {

    // for(let myTrackNumber in albumSongsArr) {
    for(let myTrackNumber = 0; myTrackNumber < albumSongsArr.length; myTrackNumber++) {
      if(songName == albumSongsArr[myTrackNumber].title) {
        return albumSongsArr[myTrackNumber].id
      }
    }

    return albumSongsArr[0].id
    // return null

  }

  /**
   * Prepare the necessary song name and songId to play based on the window URL GET parameters 
   * (if available).
   * 
   * @param {String} pathName GET variable from the URL containing the album and songName.
   * @param {Boolean} searchAlbums Search album or boolean
   * @returns {Object} returnObject The object that has the songName and songId for the player to play
   */
  const handleWindowPathname = (pathName, searchAlbums = true) => {

    let pathNameSplit = pathName.split('music/')

    if(pathNameSplit.length < 1 || windowPathAlbumFound != null) {
      return null
    }

    else {
      if(pathNameSplit[1] != null && pathNameSplit[1] != "") {
        let [requestedAlbumId, requestedSongId] = pathNameSplit[1].split('/')
        let returnObject = {
          albumId: null,
          songId: null
        }

        // if(requestedSongId == null || requestedSongId == "" || requestedSongId.length < 1) {
        // }
        // console.log('requestedSongId is: '+requestedSongId)

        // Check albums
        if(searchAlbums) {
          for(let myAlbumId of Object.keys(albums)) {
            // let myAlbumId = albums[albumKey]
            if(myAlbumId == requestedAlbumId) {
              windowPathAlbumFound = "albums"
              INITIAL_ALBUM = requestedAlbumId
              let myTrackId = getTrackIdForSongId(albums[INITIAL_ALBUM], requestedSongId)
              INITIAL_TRACK_ID_IS_VALID = songIdExistsInAlbum(albums[INITIAL_ALBUM], requestedSongId)
              if(myTrackId != null) {
                INITIAL_TRACK = myTrackId
              }
              returnObject.albumId = requestedAlbumId
              returnObject.songId = INITIAL_TRACK_ID_IS_VALID ? requestedSongId : albums[INITIAL_ALBUM][0]
            }
          }
        }

        // Check Jams
        else {
          for(let myAlbumId of Object.keys(jams)) {
            if(myAlbumId == requestedAlbumId) {
              windowPathAlbumFound = "jams"
              INITIAL_ALBUM = requestedAlbumId
              let myTrackId = getTrackIdForSongId(jams[INITIAL_ALBUM], requestedSongId)
              INITIAL_TRACK_ID_IS_VALID = songIdExistsInAlbum(jams[INITIAL_ALBUM], requestedSongId)
              if(myTrackId != null) {
                INITIAL_TRACK = myTrackId
              }
              returnObject.albumId = requestedAlbumId
              returnObject.songId = INITIAL_TRACK_ID_IS_VALID ? requestedSongId : albums[INITIAL_ALBUM][0]
            }
          }
        }

        return returnObject

      }

    }

    return null
    
  }

  /**
   * Hook that alerts clicks outside of the passed ref
   * @author
   *  https://codesandbox.io/s/outside-alerter-hooks-lmr2y?module=/src/OutsideAlerter.js&file=/src/OutsideAlerter.js
   */
  const useClickOutsideOfDescToClose = (ref) => {
    useEffect(() => {

      /**
       * Close modal when clicked outside.
       * 
       * @params {Object} event Mouse Event.
       */
      function handleClickOutside(event) { 

        // TODO: validate the quereyselector line
        if (ref.current && !ref.current.contains(event.target) && 
            !document.querySelector('.react-jinke-music-player-main').contains(event.target)) {
          // alert("You clicked outside of me!");

          if(musicDescriptionWrapperRef.current.style.display != 'none') {
            musicDescriptionXClick()
          }

        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const audioTrackChangeHandler = (currentPlayId, audioLists, audioInfo) => {
    // addVolumeUIToMobilePlayer()

    removeAudioLoop()
    // console.log(audioLists)
    // console.log(audioInfo)

    // let myAlbumTrackId = getTrackIdForSongName(getAlbumObjectFromAlbumName(currentAlbumNow), audioInfo.name) // seems to load the one previously being played
    
    setTimeout(()=>{
      // console.log('currentAlbumNow is: '+currentAlbumNow)
      
      let mySongId = getSongIdForSongName(getAlbumObjectFromAlbumName(currentAlbumNow), currentlyPlayingSongTitle)
      // console.log('currentlyPlayingSongTitle is: '+currentlyPlayingSongTitle)

      window.history.replaceState(null, "", `/music/${currentAlbumNow}/${mySongId}`)
    },250)
  }

  /**
   * Runs when the music player is changes viewport modes..
   * 
   * @param {String} newMode New mode of the player.
   */
  const onPlayerSizeChangeHandler = (newMode) => {
    // if(newMode == 'full') {
    //   addVolumeUIToMobilePlayer()
    // }
  }

  /**
   * Checks if the window width is smaller than 768.
   * Jinkes player uses 767.
   * 
   * @returns {Boolean} Returns true if the window width is < 768.
   */
  const isMobile = () => (window.innerWidth < 768)

  /**
   * Get the default options required for the initialization of the Jinke's player.
   * 
   * @param {String} albumName Name of the album.
   * @returns {Object} Object used for jinke's player to setup player.
   */
  const getDefaultOptions = (albumName) => {

    let returnObject = {

      // Audio files will be placed here for playing
      audioLists: [],

      // clearPriorAudioLists: true,

      showThemeSwitch: false,

      showLyric: false,

      panelTitle: utils.getAlbumDisplayName(albumName),

      defaultPosition: {
        bottom: 10,
        left: 10
      },

      // Start the player in the 'OPENED' state ('full' or 'mini')
      // NOTE: MOBILE USES 100% VW & VH. if on mobile, start this in mini
      mode: isMobile() ? 'mini' : 'full',

      // emptyLyricPlaceholder: null,

      // lyricClassName: null,

      // Can the user remove songs from the current playlist
      remove: false,

      // Dragging bounds of the open music player button
      bounds: {
        left: 0, 
        right: 0, 
        bottom: 0, 
        top: 0, 
      },

      // Text displayed when changing album play-through type

      // playModeText: {
      //   order: "order",
      //   orderLoop: "orderLoop",
      //   singleLoop: "singleLoop",
      //   shufflePlay: "shufflePlay"
      // },

      defaultPlayMode: PLAYER_DEFAULT_PLAY_MODE,

      onAudioProgress: audioProgressHandler,

      onAudioPlay: (audioListInfo) => {
        currentlyPlayingSongTitle = audioListInfo.name

        if(audioListInfo.name != null && audioListInfo.name != '') {
          utils.setDocumentTitle(`Ryan Isler - ${audioListInfo.name}`)
        }
      },

      onAudioPlayTrackChange: audioTrackChangeHandler,

      onAudioSeeked: (audioInfo) => {
        // [ ] stop player from playing on seek
        // console.log(99999)
        // setTimeout(() => {
        // toggleMusicIsPlaying()
        // },100)

        // console.log(reactJkMusicPlayerRef.current.state.playing)
        // if(reactJkMusicPlayerRef.current.state.playing == false && playerWasJustStopped == false) {
        //   playerWasJustStopped = true
        //   setTimeout(() => {
        //   pauseAudio()

        //     playerWasJustStopped = false
        //   }, 200)
        // }
      },

      onModeChange: onPlayerSizeChangeHandler,
      
      // onPlayIndexChange: (playIndex) => {
      //   // console.trace()
      //   console.log("playIndex",playIndex)
      // },

      // The default audioPlay handle function will be played again after each 
      // pause, If you only want to trigger it once, you can set 'true'
      once: true,

      // playIndex: 0,

      // // audioTitle: 'My custom audio title(?)',

      // defaultPlayIndex: 0,

      // Automatically hides cover photo if no photo provided
      autoHiddenCover: true,

      autoPlay: false,

      // Play/pause with space bar
      // spaceBar: true,

      // Show reload music file
      // showReload: false,

      // Default theme when loaded
      theme: 'light',

      preload: 'auto',

      // clearPriorAudioLists: true,

    }

    return returnObject
  }

  const clearAudioList = (newList = []) => {
    // this.audio.pause();
    // this.initPlayInfo([]);
    // this.setState({
    //   currentTime: 0,
    //   duration: 0,
    //   loading: false,
    //   playing: false,
    //   pause: true,
    //   currentLyric: "",
    //   playId: this.initPlayId,
    // });


    // reactJkMusicPlayerRef.current._pauseAudio()
    // reactJkMusicPlayerRef.current.onPauseAudio()
    // reactJkMusicPlayerRef.current.resetAudioStatus()
    if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null) {
      reactJkMusicPlayerRef.current.setState({
        audioLists: newList
      })
    }
    // setMusicPlayerOptions(getDefaultOptions('loading'))
  }

  /**
   * Sets the albums data object array.
   * @param {Object} data Music Object with the music data
   */
  const displayMusicData = (data) => {
    if(albums == null) {

      setAlbums(data)

    }
  }

  const closeMusicPlayerIfOpen = () => {
    reactJkMusicPlayerRef.current.onHidePanel()
    //   reactJkMusicPlayerRef.current.setState({
    //   mode: "mini"
    // })
    
  }
  
  const displayJamsData = (data) => {
    if(jams == null) {

      setJams(data)

    }
  }

  /**
   * Display album info UI and populate it.
   * @param {Array} songAlbumArray Album array which contains all the song objects
   * @param {Object} songAlbumObj The first object of the songAlbumArray which contains important album info.
   */
  const displayAlbumDescription = (songAlbumArray, songAlbumObj) => {

    // Could potential use "Jam: " for when a jam is selected
    let titlePrefix = "Album: "

    setMusicDescriptionInfo({
      currentlyDisplayedAlbum: songAlbumObj.albumId,
      title: titlePrefix + songAlbumObj.album,
      releaseDate: songAlbumObj.releaseDate,
      description: songAlbumObj.albumDescription,
      image: utils.getActualAlbumImage(songAlbumObj),
    })

    let zeroAlbumObject = {
      currentlyDisplayedAlbum: songAlbumObj.album,
      title: titlePrefix + songAlbumObj.album, 
      releaseDate: songAlbumObj.releaseDate,
      description: songAlbumObj.albumDescription,
      image: utils.getActualAlbumImage(songAlbumObj),
    }

    descSelectorRef.current.selectedIndex = 0

    // console.log(descSelectorRef.current)

    setMusicDescriptionSongs([zeroAlbumObject, ...songAlbumArray])

    // songNames: [songAlbumObj.album, ...Object.keys(songAlbumArray)]

    musicDescriptionWrapperRef.current.style.display = 'flex'

    // Hide music player when open description (better for mobile in landscape)
    // if(isMobile()) {
    //   closeMusicPlayerIfOpen()
    // }

  }

  /**
   * Setup the Jinke Music Player and start the 'FEATURED' album.
   * 
   * @param {String} albumName Name of the album you want to play.
   */
  const initAlbum = (albumName) => {
    
    // Options for the music player
    let options = getDefaultOptions(albumName)

    options = getPopulatedOptionsList(albumName, options)

    setMusicPlayerOptions(options)

    setCurrentAlbum(albumName)

    currentAlbumNow = albumName

    // console.log('albumName is: '+albumName)

    // Add song name descriptions (Dangerously modify the DOM directly)
    setTimeout(() => {
        
        let audioItems = document.getElementsByClassName('audio-item')
        for(let i = 0; i < audioItems.length; i++) {
          // if(albums[albumName][i] != null) {
            audioItems[i].title = albums[albumName][i].descriptionShort
          // }
        }

        // note: to play/stop the player automatically:
        if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null)
        reactJkMusicPlayerRef.current.setState({
          playMode: PLAYER_DEFAULT_PLAY_MODE
        })

        // console.log(reactJkMusicPlayerRef.current.state)

    }, 600)

  }

  const musicPlayerClickHandler = (event) => {
    // if(isMobile()) {
    //   setTimeout(() => {
    //     addVolumeUIToMobilePlayer()
    //   }, 500)
    // }
  }

  const volumeMiniIconClickHandler = (event) => {
    // let isMuted = (mobileUnmuteVolume > 0)
    let myVolumeInput = document.querySelector('.mobile-volume-slider')

      if(myVolumeInput != null) {
        // if(isMuted) {
        //   myVolumeInput.setAttribute('value', mobileUnmuteVolume * 100)
        //   reactJkMusicPlayerRef.current.setAudioVolume(mobileUnmuteVolume)
        //   setTimeout(() => {
        //     mobileUnmuteVolume = 0
        //   },100)
        // }
        // else {
          let tempValue = reactJkMusicPlayerRef.current.audio.volume
          reactJkMusicPlayerRef.current.setAudioVolume(mobileUnmuteVolume)
          let newVol = Math.round(mobileUnmuteVolume * 100)
          myVolumeInput.setAttribute('value', String(newVol))
          myVolumeInput.value = newVol
            // setTimeout(() => {
            mobileUnmuteVolume = tempValue
            // myVolumeInput.setAttribute('value', 0)
          // },100)
        // }
      }
    }

  const volumeSliderChangeHandler = (event) => {
    let newVolume = parseInt(event.target.value)

    if(newVolume == null || isNaN(newVolume)) {
      newVolume = 50
    }

    if(newVolume > 0.0000000001 && mobileUnmuteVolume > 0)
    mobileUnmuteVolume = 0


    newVolume = newVolume / 100

    // console.log(newVolume);
    

    if(newVolume < 0) {
      newVolume = 0
    }
    else if(newVolume > 1) {
      newVolume = 1
    }

    reactJkMusicPlayerRef.current.setAudioVolume(newVolume)
  }

  /**
   * Returns volume out of 100
   */
  const getCurrentVolume = () => {
    return Math.round(reactJkMusicPlayerRef.current.audio.volume * 100)
  }

  /**
   * Set the main player volume.
   * 
   * @param {Number} newVolume Number to set the volume to (0-100).
   */
  const setCurrentVolume = (newVolume) => {
    let newVol = newVolume * 0.01
    // reactJkMusicPlayerRef.current.audio.volume = newVol
    // reactJkMusicPlayerRef.current.setState({
    //   currentAudioVolume: newVol,
    //   soundValue: newVolume,
    //   isMute: (newVolume == 0) ? true : false
    // })
    // reactJkMusicPlayerRef.current.setAudioVolume(
    //   reactJkMusicPlayerRef.current.state.currentAudioVolume
    // )
    if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null) {
      reactJkMusicPlayerRef.current.setAudioVolume(
        newVol
      )
    }
  }

  /**
   * Detects if the volume UI exists on the mobile view; if not, adds it.
   * 
   * This feature is WORKING on desktop, but doesn't work on mobile because 
   * mobile browsers do not allow volume to go below 1.0.
   */
  const addVolumeUIToMobilePlayer = () => {
    
    // Today I learned: mobile browsers do not allow audio.volume to be anything other than 0!
    return false

    if(!isMobile) {
      return false
    }

    let mobileVolumeLi = document.querySelector('.react-jinke-music-player-mobile .react-jinke-music-player-mobile-operation ul li:nth-child(4)')

    if(mobileVolumeLi != null) {
      let newVolumeSpan = document.querySelector('.react-jinke-music-player-mobile .react-jinke-music-player-mobile-operation ul li:nth-child(4) .play-sounds')
      if(newVolumeSpan == null) {

        // function onRangeChange(rangeInputElmt, listener) {

        //   var inputEvtHasNeverFired = true;
        
        //   var rangeValue = {current: undefined, mostRecent: undefined};
          
        //   rangeInputElmt.addEventListener("input", function(evt) {
        //     inputEvtHasNeverFired = false;
        //     rangeValue.current = evt.target.value;
        //     if (rangeValue.current !== rangeValue.mostRecent) {
        //       listener(evt);
        //     }
        //     rangeValue.mostRecent = rangeValue.current;
        //   });
        
        //   rangeInputElmt.addEventListener("change", function(evt) {
        //     if (inputEvtHasNeverFired) {
        //       listener(evt);
        //     }
        //   }); 
        
        // }

        // https://stackoverflow.com/questions/18544890/onchange-event-on-input-type-range-is-not-triggering-in-firefox-while-dragging/37623959#37623959
        function onRangeChange(r,f) {
          var n,c,m;
          r.addEventListener("input",function(e){n=1;c=e.target.value;if(c!=m)f(e);m=c;});
          r.addEventListener("change",function(e){if(!n)f(e);});
        }

      //   let VOLUME_SLIDER_INNER_HTML = `<span class="sounds-icon">
      //   <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;"><g><path d="m23.4 5.4c6.7 1.5 11.6 7.5 11.6 14.6s-4.9 13.1-11.6 14.6v-3.4c4.8-1.4 8.2-5.9 8.2-11.2s-3.4-9.8-8.2-11.2v-3.4z m4.1 14.6c0 3-1.6 5.5-4.1 6.7v-13.4c2.5 1.2 4.1 3.7 4.1 6.7z m-22.5-5h6.6l8.4-8.4v26.8l-8.4-8.4h-6.6v-10z"></path></g></svg>
      // </span>
      // <div class="rc-slider sound-operation">
      //   <div class="rc-slider-rail"></div>
      //   <div class="rc-slider-track" style="background-color: rgb(49, 194, 124); left: 0%; right: auto; width: 100%;"></div>
      //   <div class="rc-slider-step"></div>
      //   <div tabindex="0" class="rc-slider-handle" style="background-color: rgb(49, 194, 124); border: 2px solid rgb(255, 255, 255); left: 100%; right: auto; transform: translateX(-50%);" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false"></div>
      //   <div class="rc-slider-mark"></div>
      // </div>`
      

        newVolumeSpan = document.createElement('span')
        newVolumeSpan.className = 'group play-sounds'
        newVolumeSpan.setAttribute('title', 'Volume') 
        // newVolumeSpan.innerHTML = VOLUME_SLIDER_INNER_HTML
        mobileVolumeLi.appendChild(newVolumeSpan)

        let VOLUME_SVG_INNER_HTML = `<svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;"><g><path d="m23.4 5.4c6.7 1.5 11.6 7.5 11.6 14.6s-4.9 13.1-11.6 14.6v-3.4c4.8-1.4 8.2-5.9 8.2-11.2s-3.4-9.8-8.2-11.2v-3.4z m4.1 14.6c0 3-1.6 5.5-4.1 6.7v-13.4c2.5 1.2 4.1 3.7 4.1 6.7z m-22.5-5h6.6l8.4-8.4v26.8l-8.4-8.4h-6.6v-10z"></path></g></svg>`
        // let VOLUME_SVG_INNER_HTML = `<g><path d="m23.4 5.4c6.7 1.5 11.6 7.5 11.6 14.6s-4.9 13.1-11.6 14.6v-3.4c4.8-1.4 8.2-5.9 8.2-11.2s-3.4-9.8-8.2-11.2v-3.4z m4.1 14.6c0 3-1.6 5.5-4.1 6.7v-13.4c2.5 1.2 4.1 3.7 4.1 6.7z m-22.5-5h6.6l8.4-8.4v26.8l-8.4-8.4h-6.6v-10z"></path></g>`
        let newVolumeSpanSpan = document.createElement('span')
        newVolumeSpanSpan.innerHTML = VOLUME_SVG_INNER_HTML
        newVolumeSpanSpan.setAttribute('muted', 'false')
        newVolumeSpanSpan.onclick = volumeMiniIconClickHandler
        newVolumeSpan.appendChild(newVolumeSpanSpan)

        let newVolumeSpanInput = document.createElement('input')
        newVolumeSpanInput.className = 'rc-slider sound-operation mobile-volume-slider'
        // newVolumeSpanInput.type = 'range'
        newVolumeSpanInput.setAttribute('type', 'range')
        newVolumeSpanInput.setAttribute('min', 0)
        newVolumeSpanInput.setAttribute('max', 100)
        newVolumeSpanInput.setAttribute('value', getCurrentVolume())
        const rangeTouchEndHandler = (event) => {
          alert(555)
        }
        // newVolumeSpanInput.oninput = volumeSliderChangeHandler
        // newVolumeSpanInput.onchange = volumeSliderChangeHandler
        if ("oninput" in newVolumeSpanInput) {
          newVolumeSpanInput.addEventListener("input", volumeSliderChangeHandler, false)
      }
      newVolumeSpanInput.addEventListener("ontouchend", rangeTouchEndHandler, false)

        // onRangeChange(newVolumeSpanInput, volumeSliderChangeHandler)
        newVolumeSpan.appendChild(newVolumeSpanInput)

        
        
    /*
      <span class="group play-sounds" title="Volume">
        <span class="sounds-icon">
          <svg fill="currentColor" preserveAspectRatio="xMidYMid meet" height="1em" width="1em" viewBox="0 0 40 40" style="vertical-align: middle;"><g><path d="m23.4 5.4c6.7 1.5 11.6 7.5 11.6 14.6s-4.9 13.1-11.6 14.6v-3.4c4.8-1.4 8.2-5.9 8.2-11.2s-3.4-9.8-8.2-11.2v-3.4z m4.1 14.6c0 3-1.6 5.5-4.1 6.7v-13.4c2.5 1.2 4.1 3.7 4.1 6.7z m-22.5-5h6.6l8.4-8.4v26.8l-8.4-8.4h-6.6v-10z"></path></g></svg>
        </span>
        <div class="rc-slider sound-operation">
          <div class="rc-slider-rail"></div>
          <div class="rc-slider-track" style="background-color: rgb(49, 194, 124); left: 0%; right: auto; width: 100%;"></div>
          <div class="rc-slider-step"></div>
          <div tabindex="0" class="rc-slider-handle" style="background-color: rgb(49, 194, 124); border: 2px solid rgb(255, 255, 255); left: 100%; right: auto; transform: translateX(-50%);" role="slider" aria-valuemin="0" aria-valuemax="1" aria-valuenow="1" aria-disabled="false"></div>
          <div class="rc-slider-mark"></div>
        </div>
      </span>
    */
      }

      // newVolumeSpan.style.left = `${sliderLeftPosition}px`
      // newVolumeSpan.style.width = `${sliderWidth}px`

      return true
    }

  }

  /**
   * Closes the music description modal.
   */
  const musicDescriptionXClick = () => {

    // let _display = musicDescriptionWrapperRef.current.style.display
    // musicDescriptionWrapperRef.current.style.display = (_display != 'none') ? 'none' : 'flex'
    musicDescriptionWrapperRef.current.style.display = 'none'

  }

  /**
   * Play the albumName album. Unloads the previous album.
   * 
   * @param {String} albumName Name of the album (references the object keys in the json files).
   * @param {Number} trackIndex The track to play of that album.
   * @param {Boolean} ignorePlay Do not init the play.
   * @param {Boolean} initPlay Play n init.
   */
  const playAlbum = (albumName, trackIndex = 0, ignorePlay = false, initPlay = true) => {

    playHandler("albums", albumName, trackIndex, ignorePlay, initPlay)

  }

  /**
   * Pause the audio.
   */
  const pauseAudio = () => {
    reactJkMusicPlayerRef.current.audio.pause()
    reactJkMusicPlayerRef.current.setState({
      pause: true,
      playing: false
    });
  }

  /**
   * The main play music function. This handles the Jinke's player options and edge 
   * cases for playing media.
   * 
   * @param {String} albumType The album type ("albums" | "jams").  
   * @param {String} albumName Name of the album (references the object keys in the json files).
   * @param {Number} trackIndex The track to play of that album.
   * @param {Boolean} ignorePlay Do not init the play.
   * @param {Boolean} initPlay Play init.
   * @returns {Boolean} Success.
   */
  const playHandler = (albumType = "albums", albumName, trackIndex = 0, ignorePlay, initPlay = true) => {

    let myArray = albums
    if(albumType == "jams") {
      myArray = jams
    }
    
    // Trying to play a jam in a music album or vice versa.
    if(myArray[albumName] == null) {
      console.log(`playerHandler() error: Unable to play from ${albumType}: ${albumName}`)
      return false
    }

    currentlyPlayingAlbumType = albumType

    if(trackIndex < 0 || trackIndex > myArray[albumName].length - 1) {
      trackIndex = 0
    }

    if(albumName != currentAlbum) {

      let options = getDefaultOptions(albumName)

      // options.autoPlayInitLoadPlayList = true

      if(albumType == "jams") {
        options = getPopulatedOptionsListForJam(albumName, options)
      }
      else{
        options = getPopulatedOptionsList(albumName, options)
      }

      currentAlbumNow = albumName

      clearAudioList()
      // console.log(options)
      // setMusicPlayerOptions(options)
      
      // This method is a (poor) work around to a problem with this version of jinke music player
      // (albumList does not update with change of props audioList)
      setTimeout(()=> {

        setMusicPlayerOptions(options)

        setTimeout(() => {
          if(reactJkMusicPlayerRef != null && reactJkMusicPlayerRef.current != null) {

            if(reactJkMusicPlayerRef.current.state.audioLists[0] != null) {

                if(initPlay) {
                  reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id, ignorePlay)
                }
                else {
                  reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id, ignorePlay)
                  setTimeout(() => {
                    pauseAudio()
                  }, 50) 
                  utils.setDocumentTitle(`Ryan Isler - ${myArray[albumName][trackIndex].title}`)

                }
              
              // Dangerously modify the DOM directly:
              let audioItems = document.getElementsByClassName('audio-item')
              for(let i = 0; i < audioItems.length; i++) {
                audioItems[i].title = myArray[albumName][i].descriptionShort
              }

            }

          }
        }, 200)

      }, 200)

      setCurrentAlbum(albumName)

    }

    else if(trackIndex != null) {
      setTimeout(() => {

        try {
          
          if(initPlay) {
            reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id, ignorePlay)
          }
        }
        catch(e) {
          console.log("playHandler() setTimeout() error")
          console.log(e)
        }

      },400)
    }
    return true
  }

  /**
   * Play the albumName jam. Unloads the previous album.
   * 
   * @param {String} albumName Name of the album (references the object keys in the json files).
   * @param {Number} trackIndex The track to play of that album.
   * @param {Boolean} ignorePlay Do not init the play.
   * @param {Boolean} initPlay Play n init.
   */
  const playJam = (albumName, trackIndex = 0, ignorePlay = true, initPlay = true) => {

    playHandler("jams", albumName, trackIndex, ignorePlay)

    // if(trackIndex < 0 || trackIndex > jams[albumName].length - 1) {
    //   trackIndex = 0
    // }

    // if(albumName != currentAlbum) {

    //   let options = getDefaultOptions(albumName)

    //   // options.autoPlayInitLoadPlayList = true

    //   currentAlbumNow = albumName

    //   options = getPopulatedOptionsListForJam(albumName, options)
      
    //   clearAudioList()
    //   // console.log(options)
    //   // setMusicPlayerOptions(options)
      
    //   // This method is a (poor) work around to a problem with this version of jinke music player
    //   // (albumList does not update with change of props audioList)
    //   setTimeout(()=> {

    //     setMusicPlayerOptions(options)

    //     setTimeout(() => {
    //       if(reactJkMusicPlayerRef.current.state.audioLists[0] != null) {
            
    //         if(trackIndex == null) {
    //           if(playOnLoaded) {
    //             reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[0].id)
    //           }
    //         }
    //         else {
    //           if(playOnLoaded) {
    //             reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id)
    //           }
    //         }
            
    //         // Dangerously modify the DOM directly:
    //         let audioItems = document.getElementsByClassName('audio-item')
    //         for(let i = 0; i < audioItems.length; i++) {
    //           audioItems[i].title = jams[albumName][i].descriptionShort
    //         }

    //       }
    //     }, 200)

    //   }, 200)

    //   setCurrentAlbum(albumName)

    // }

    // else if(trackIndex != null) {
    //   setTimeout(() => {

    //     try {
    //       if(playOnLoaded) {
    //         reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id)
    //       }
    //     }
    //     catch(e) {
    //       console.log("playJam() setTimeout() error")
    //       console.log(e)
    //     }

    //   },400)
    // }

  }

  /**
   * Returns an object that has the corerctly formatted album data.
   * @param {String} albumName Name of album to play
   * @param {Object} musicPlayerOptions Jinkes Object with appropriate data for the Jinkes Music Player
   * @returns {Object} Jinkes object with correct requested album song array.
   */
  const getPopulatedOptionsList = (albumName, musicPlayerOptions) => {

    // Clear audio list
    if(musicPlayerOptions != null) {
      musicPlayerOptions.audioLists = []
    }

    // console.log(albumName)

    // Apply json song data from albumName album to the player (via options props)
    for(let song of albums[albumName]) {
      if(song != null) {

        let newAudioListItem = {

          // Song Title 
          name: song.title,

          // Song Singer/Author
          singer: 'Ryan Isler',

          // Song artwork to display
          cover: utils.getAlbumImage(song),

          // Song file
          musicSrc: utils.getAlbumSongFile(song),

          lyric: ""
          
        }

        musicPlayerOptions.audioLists.push(newAudioListItem)

        // console.log( "newAudioListItem.musicSrc" )
        // console.log( newAudioListItem.musicSrc )
      }
    }

    return musicPlayerOptions

  }

  /**
   * Play song button pressed.
   * 
   * @param {Array} myAlbumArray Album array to be loaded by the player.
   * @param {Number} trackToPlay Track index number to play.
   */
  const playThisSongBtn = (myAlbumArray, trackToPlay) => {
    if(currentlyPlayingAlbumType == "albums") {
      playAlbum(myAlbumArray, trackToPlay)
    }
    else {
      playJam(myAlbumArray, trackToPlay)
    }
  }

  /**
   * Go to the next description.
   * 
   * @param {Booealn} goPreviousInstead Booealn to go backward instead.
   */
  const goNextDescription = (goPreviousInstead = false) => {

    if(goPreviousInstead == false) {
      if(descSelectorRef.current.selectedIndex < descSelectorRef.current.children.length - 1) {
        descSelectorRef.current.selectedIndex++
        songDescriptionOptionClick(descSelectorRef.current.selectedIndex)
      }
    }
    else {
      if(descSelectorRef.current.selectedIndex > 0) {
        descSelectorRef.current.selectedIndex--
        songDescriptionOptionClick(descSelectorRef.current.selectedIndex)
      }
    }

  }

  /**
   * Scrub the currentTime of the main audio element to mySeconds seconds.
   * 
   * @param {Number} mySeconds Time value (seconds) to scrub to.
   */
  const scrubToTimeSeconds = (mySeconds) => {

    reactJkMusicPlayerRef.current.audio.currentTime = mySeconds;

  }

  /**
   * Format seconds to minutes and seconds separated by a colon (e.g. 70 becomes 01:10).
   * 
   * @param {Number} inputTimeSeconds Input time in seconds.
   * @returns {String} Output time in MM:SS format.
   */
  const parseSecondsToMinuteSecondsFormat = (inputTimeSeconds) => {

    inputTimeSeconds = Math.floor(inputTimeSeconds)
    
    let timeMinutes = Math.floor(inputTimeSeconds / 60)

    if(timeMinutes > 0) {
      inputTimeSeconds -= timeMinutes * 60
    }

    let timeSeconds = inputTimeSeconds

    return ((timeMinutes < 10) ?
        '0' + timeMinutes :
        timeMinutes) + ':' + ((timeSeconds < 10) ?
        '0' + timeSeconds :
        timeSeconds)

  }

  /**
   * Scrub the current audio to codeTime.
   * 
   * @param {String} codeTime Code time string (format: MM:SS)
   */
  const scrubToTime = (codeTime) => {

    //parse code time "[xx:xx]"

    // console.log(codeTime)

    // codeTime = codeTime.slice(1, -1)

    let minsAndSeconds = codeTime.split(':')
    
    let timeMinutes = parseInt(minsAndSeconds[0])
    let timeSeconds = parseInt(minsAndSeconds[1])

    let mySeconds = timeSeconds + (60 * timeMinutes)

    reactJkMusicPlayerRef.current.audio.currentTime = mySeconds;

  }

  /**
   * Handles clicking on span elements in the description that will scrub 
   * the user to MM:SS time in the audio based on the content of the span.
   * 
   * @param {Object} mouseEvent Mouse event.
   */
  const delegateDescriptionClick = (mouseEvent) => {
    var $el = mouseEvent.target
    if($el.tagName.toLowerCase() == "span") {
      scrubToTime($el.innerHTML)
    }
    // if ($el.is('span.tagged')) {
    //     this.doSomething($el);
    // }
  }

  /**
   * Set the music description information when clicking on the desc-select dropdown.
   * 
   * @param {Number} songIndex The song index number.
   */
  const songDescriptionOptionClick = (songIndex) => {

    setMusicDescriptionInfo({
      currentlyDisplayedAlbum: musicDescriptionInfo.currentlyDisplayedAlbum,
      title: musicDescriptionSongs[songIndex].title,
      releaseDate: musicDescriptionSongs[songIndex].releaseDate,
      description: musicDescriptionSongs[songIndex].description,
      image: utils.getSongImage(musicDescriptionSongs[songIndex]),
    })

  }
  
  /**
   * Get the Jinke's player options object for the jam albumName.
   * 
   * @param {String} albumName Name of the album.
   * @param {Object} musicPlayerOptions Music player options
   * @returns {Object} Jinke's music player options for the jam albumName.
   */
  const getPopulatedOptionsListForJam = (albumName, musicPlayerOptions) => {

    // Clear audio list
    if(musicPlayerOptions != null) {
      musicPlayerOptions.audioLists = []
    }

    // Apply json song data from albumName album to the player (via options props)
    for(let song of jams[albumName]) {
      if(song != null) {

        let newAudioListItem = {

          // Song Title 
          name: song.title,

          // Song Singer/Author
          singer: 'Ryan Isler',

          // Song artwork to display
          cover: utils.getAlbumImage(song),

          // Song file
          musicSrc: utils.getAlbumSongFile(song),

          lyric: ""
          
        }

        musicPlayerOptions.audioLists.push(newAudioListItem)

        // console.log( "newAudioListItem.musicSrc" )
        // console.log( newAudioListItem.musicSrc )
      }
    }

    return musicPlayerOptions

  }

  /**
   * Move the player forward (or backward for negative) moveForwardSeconds seconds.
   * 
   * @param {Number} moveForwardSeconds Number of seconds to move forward.
   */
  const moveTimeForwardXSeconds = (moveForwardSeconds) => {
    let mySeconds = reactJkMusicPlayerRef.current.audio.currentTime + moveForwardSeconds

    if(mySeconds < 0) {
      mySeconds = 0
    }
    else if(mySeconds > reactJkMusicPlayerRef.current.audio.duration) {
      mySeconds = reactJkMusicPlayerRef.current.audio.duration - 1
    }

    // let minsAndSeconds = codeTime.split(':')
    
    // let timeMinutes = parseInt(minsAndSeconds[0])
    // let timeSeconds = parseInt(minsAndSeconds[1])

    // let mySeconds = timeSeconds + (60 * timeMinutes)

    reactJkMusicPlayerRef.current.audio.currentTime = mySeconds;

    // If not playing music, don't start it while they're scrubbing
    if(!reactJkMusicPlayerRef.current.state.playing) {
      // reactJkMusicPlayerRef.current.onTogglePlay()
      // console.log(111111)
      toggleMusicIsPlaying()
    }

  }

  /**
   * Move forward (or backward) trackAmount number of tracks.
   * 
   * @param {Number} trackAmount Number of tracks to move by.
   */
  const moveForwardXTracks = (trackAmount) => {
    // let newTrackId = getTrackIdForSongName(
    //   getAlbumObjectFromAlbumName(currentAlbumNow), 
    //   reactJkMusicPlayerRef.current.state.name
    // )
    // if(newTrackId == null) {
    //   newTrackId = 0
    // } else {
    //   newTrackId += trackAmount
    // }
    // if(newTrackId < 0) {
    //   newTrackId = 0
    // }
    // else if(newTrackId > reactJkMusicPlayerRef.current.state.audioLists.length) {
    //   newTrackId = reactJkMusicPlayerRef.current.state.audioLists.length - 1
    // }
    
    if(trackAmount > 0) {
      // reactJkMusicPlayerRef.current.onPlayNextAudio()
      reactJkMusicPlayerRef.current.audioPrevAndNextBasePlayHandle(true)
    } else {
      // reactJkMusicPlayerRef.current.onPlayPrevAudio()
      reactJkMusicPlayerRef.current.audioPrevAndNextBasePlayHandle(false)
    }
    
  }

  /**
   * Increase or decrease the volume.
   * 
   * @param {Number} increaseBy Value to increase the volume by (myCurrentAudioVolume range is: 0 - 1)
   */
  const addVolume = (increaseBy) => {
    let myCurrentAudioVolume = reactJkMusicPlayerRef.current.state.currentAudioVolume

    myCurrentAudioVolume += increaseBy

    if(myCurrentAudioVolume < 0) {
      myCurrentAudioVolume = 0
    }

    if(myCurrentAudioVolume > 1) {
      myCurrentAudioVolume = 1
    }

    reactJkMusicPlayerRef.current.setState({
      currentAudioVolume: myCurrentAudioVolume,
      soundValue: myCurrentAudioVolume
    }, () => {
      reactJkMusicPlayerRef.current.audio.volume = myCurrentAudioVolume
    })
  }

  /**
   * Toggle the play state of the music.
   */
  const toggleMusicIsPlaying = () => {
    reactJkMusicPlayerRef.current.setState({
      playing: !reactJkMusicPlayerRef.current.state.playing
    }, () => {
      reactJkMusicPlayerRef.current.state.playing ? 
      reactJkMusicPlayerRef.current.audio.play() :
      reactJkMusicPlayerRef.current.audio.pause()
    })
  }
  
  /**
   * Set the playback rate of the music.
   * 
   * @param {Number} amount Number to set the playback rate to (0.5: 50% speed, 1.0: 100% speed, 1.5: 150% speed, etc.`)
   */
  const setPlaybackRate = (amount) => {

    reactJkMusicPlayerRef.current.audio.playbackRate = amount

    console.log(`Audio Play Rate: Audio playback rate reset to: ${amount}`)

  }

  /**
   * Adjust the playback rate by increaseAmount.
   * 
   * @param {Number} increaseAmount Number to move the playback rate by.
   */
  const addPlaybackRate = (increaseAmount) => {

    let myRate = reactJkMusicPlayerRef.current.audio.playbackRate

    myRate += increaseAmount

    if(myRate < 0.25) {
      myRate = 0.25
    }
    else if (myRate > 5) {
      myRate = 5
    }

    reactJkMusicPlayerRef.current.audio.playbackRate = parseFloat(myRate).toPrecision(3)

    console.log(`Audio Play Rate: Audio playback rate set to: ${myRate}`)

  }

  /**
   * Gets the left position and width of the loop line based on the loop properties.
   * 
   * @param {Number} startSeconds Loop start in seconds.
   * @param {Number} myLoopEndSeconds Loop end in seconds.
   * @param {Number} loopTotalTime Total duration of the loop in seconds.
   * @param {Number} maxSliderWidth Max slider width.
   * @returns {Array} CSS properties for LoopLine element. [left position, width]
   */
  const getLoopLineProperties = (startSeconds, myLoopEndSeconds, loopTotalTime, maxSliderWidth) => {
    let sliderLeftPosition = Math.round(maxSliderWidth * (startSeconds / loopTotalTime))
    let sliderWidth = Math.round((maxSliderWidth * (myLoopEndSeconds / loopTotalTime)) - sliderLeftPosition)
    return [
      sliderLeftPosition, 
      sliderWidth
    ]
  }

  /**
   * Add the loop line UI to the slider.
   * 
   * @param {Number} myLoopStartSeconds Loop start in seconds.
   * @param {Number} myLoopEndSeconds Loop end in seconds.
   * @returns {Boolean} If the loop was successfully added.
   */
  const addLoopLineToSlider = (myLoopStartSeconds, myLoopEndSeconds) => {

    let rcSliderParent = isMobile() ? '.react-jinke-music-player-mobile-progress' : '.progress-bar'

    let rcSliderDiv = document.querySelector('.progress-bar .rc-slider') || document.querySelector('.react-jinke-music-player-mobile-progress .rc-slider')
    let loopSectionDiv = document.querySelector(`${rcSliderParent} .rc-slider .rc-loop`)

    if(myLoopStartSeconds == -1 || myLoopEndSeconds == -1) {

      // Remove line from rc-slider
      if(loopSectionDiv != null && rcSliderDiv != null) {
        rcSliderDiv.removeChild(loopSectionDiv)
      }

      return true
    }
    
    // let sliderLeftPosition = Math.round(playBarSliderWidth * (myLoopStartSeconds / loopTotalTime))
    // let sliderWidth = Math.round((playBarSliderWidth * (myLoopEndSeconds / loopTotalTime)) - sliderLeftPosition)

    if(rcSliderDiv != null) {
      let playBarSliderWidth = rcSliderDiv.clientWidth // || 801

      let loopTotalTime = reactJkMusicPlayerRef.current.audio.duration
      let [sliderLeftPosition, sliderWidth] = getLoopLineProperties(loopStartSeconds, myLoopEndSeconds, loopTotalTime, playBarSliderWidth)
      
      if(loopSectionDiv == null) {
        loopSectionDiv = document.createElement('span')
        loopSectionDiv.className = 'rc-loop'
        rcSliderDiv.appendChild(loopSectionDiv)
      }

      loopSectionDiv.style.left = `${sliderLeftPosition}px`
      loopSectionDiv.style.width = `${sliderWidth}px`

      return true
    }
    else {
      return false
    }

    return false

  }
  
  // 
  /**
   * Called when the audio progresses.
   * Called about four times per second.
   * 
   * @param {Object} audioInfo Player audio info.
   */
  const audioProgressHandler = (audioInfo) => {

    // This means that the loop feature is ready and has been enabled
    if(loopEndSeconds != -1) {

      let myCurrentTimeSeconds = Math.floor(audioInfo.currentTime + 0.5)

      if(myCurrentTimeSeconds == loopEndSeconds) {
        scrubToTimeSeconds(loopStartSeconds)
      }

    }

  }

  /**
   * Remove the audio loop.
   */
  const removeAudioLoop = () => {
    loopStartSeconds = -1
    loopEndSeconds = -1
    addLoopLineToSlider(loopStartSeconds, loopEndSeconds)
  }

  /**
   * Set the loop point.
   * 
   * The first call sets loopStartSeconds.
   * 
   * The second call sets loopEndSeconds and moves the audio to loopStartSeconds.
   * 
   * The third call will remove the loop.
   * 
   * @returns {Boolean} false if there was an error setting the loop.
   */
  const setLoopPoint = () => {
    // width: 801 (total bar with)

    // set A at currentTime,
    // again sets B at currentTime (loop enabled)
    // once set A again, disables, but sets it (loop process)
    // [x] add a line on the bar to show loop area

    if(loopStartSeconds == -1) {
      loopStartSeconds = Math.floor(reactJkMusicPlayerRef.current.audio.currentTime)

      console.log(`Audio Loop: loop point A set at: ${parseSecondsToMinuteSecondsFormat(loopStartSeconds)}`)
    }

    else if(loopEndSeconds == -1) {

      loopEndSeconds = Math.ceil(reactJkMusicPlayerRef.current.audio.currentTime)

      if(loopEndSeconds <= loopStartSeconds) {
        removeAudioLoop()
        console.log(`Audio Loop: failed to set loop point B! B was set at or before A`)
        return false
      }

      scrubToTimeSeconds(loopStartSeconds)

      addLoopLineToSlider(loopStartSeconds, loopEndSeconds)

      console.log(`Audio Loop: loop point B set at: ${parseSecondsToMinuteSecondsFormat(loopEndSeconds - 1)}. Loop enabled`)
    }

    // Disable and unset loop variables
    else {
      removeAudioLoop()

      console.log(`Audio Loop: loop disabled`)
    }

    return true

    // Leave a console.log in production which tells user loop information
  }

  /**
   * Toggle the audio Play Mode.
   */
  const gotoNextPlayMode = () => {
    reactJkMusicPlayerRef.current.togglePlayMode()
  }

  /**
   * Handle scroll wheel events
   * 
   * @param {Object} event Scroll wheel event. 
   */
  const scrollWhellHandler = (event) => {
    if(event.target.className == 'rc-slider sound-operation' || event.target.parentNode.className == 'rc-slider sound-operation') {
      event.preventDefault()

      let changeAmount = -event.deltaY

      let newAmount = getCurrentVolume() + changeAmount

      if(newAmount > 100) newAmount = 100
      else if(newAmount < 0) newAmount = 0

      console.log(newAmount)

      setCurrentVolume(newAmount)
    }
    // 'rc-slider'
  }
  
  /**
   * Handle keyboard events.
   * 
   * @info
   *  Copy sound cloud format:
   *  left right, scrub 5sec
   *  shift+ left right: next prev song in playlist
   *  shift+ up/down: volume increase/decrease
   *  space: pause/play
   * 
   * @param {Object} event Key event
   */
  const keyDownHandler = (event) => {
    // enter: 13
    // This was getting called twice
    if(Object.keys(event).length < 3) {
      return
    }
    let charCode = (typeof event.which == "undefined") ? event.keyCode : event.which;

    // Left arrow key
    if(charCode == 37) {
      if(event.shiftKey) {
        event.preventDefault()
        moveForwardXTracks(-1)
      }
      else if(event.ctrlKey) {
        event.preventDefault()
        addPlaybackRate(-0.01)
        if(rightKeyDown) {
          setPlaybackRate(1)
        }
      }
      else {
        moveTimeForwardXSeconds(-5)
      }
      leftKeyDown = true
    }

    // Right arrow key
    else if(charCode == 39) {
      if(event.shiftKey) {
        event.preventDefault()
        moveForwardXTracks(1)
      }
      else if(event.ctrlKey) {
        event.preventDefault()
        addPlaybackRate(0.01)
        if(leftKeyDown) {
          setPlaybackRate(1)
        }
      }
      else {
        moveTimeForwardXSeconds(5)
      }
      rightKeyDown = true
    }

    // Up arrow key
    else if(charCode == 38) {
      if(event.shiftKey) {
        event.preventDefault()
        addVolume(0.05)
      }
    }

    // Down arrow key
    else if(charCode == 40) {
      if(event.shiftKey) {
        event.preventDefault()
        addVolume(-0.05)
      }
    }
    
    // Space key
    else if(charCode == 32) {
      event.preventDefault()
      if(spaceKeyDown == false) {
        if(event.shiftKey) {
          setLoopPoint()
        }
        else {
          toggleMusicIsPlaying()
        }
        spaceKeyDown = true
      }
    }
    
    // Esc key
    else if(charCode == 27) {
      musicDescriptionXClick()
    }

    // R key
    else if(charCode == 82) {
      gotoNextPlayMode()
    }

  }

  /**
   * Handle key up events.
   * 
   * @param {Object} event Key handler
   */
  const keyUpHandler = (event) => {
    if(Object.keys(event).length < 3) {
      return
    }
    let charCode = (typeof event.which == "undefined") ? event.keyCode : event.which;

    if(charCode == 37) {
      leftKeyDown = false
    }
    else if(charCode == 39) {
      rightKeyDown = false
    }
    else if(charCode == 32) {
      spaceKeyDown = false
    }
  }

  /**
   * Reset all global variables
   */
  const resetGlobals = () => {

    INITIAL_ALBUM = 'FEATURED'
    INITIAL_TRACK = null
    INITIAL_TRACK_ID_IS_VALID = null
    INITIAL_LOADED_ONCE = null

    defaultAlbumInit = null

    albumInfoRequestedOnLoad = false

    windowPathAlbumFound = null

    currentlyPlayingSongTitle = ""

    currentAlbumNow = null

    loopStartSeconds = -1
    loopEndSeconds = -1

    spaceKeyDown = false
    leftKeyDown = false
    rightKeyDown = false
    
    mobileUnmuteVolume = 0
  }
  
  /**
   * Initialize the this component (this gets called every re-render though)
   */
  const init = () => {

    resetGlobals()

    // Load music JSON data into our state
    if(albums == null) {
      props.dataLoader.getData(props.dataLoader.MUSIC_JSON, displayMusicData)
    }
    if(jams == null) {
      props.dataLoader.getData(props.dataLoader.JAMS_JSON, displayJamsData)
    }
  }

  // init()

  useClickOutsideOfDescToClose(musicDescriptionContentRef)

  return(
    // <div className="music-wrapper" onKeyDown={(event) => {keyDownHandler(event)}} onKeyUp={(event) => {keyUpHandler(event)}} tabIndex="0">
    <div className="music-wrapper" onKeyDown={keyDownHandler} onKeyUp={keyUpHandler} tabIndex={0}> 

      <div className="music-player-wrapper">
        <ReactJkMusicPlayer {...musicPlayerOptions} ref={reactJkMusicPlayerRef} />,
      </div>

      <div className="music-description-wrapper" ref={musicDescriptionWrapperRef} style={{display: 'none'}}>
        <div className="music-description-content" ref={musicDescriptionContentRef}>

          <div className="desc-x" onClick={(mouseEvent) => {musicDescriptionXClick()}} >x</div>

          <div className="desc-nav">
            <span className="arrow-item arrow-left" 
            onClick={(mouseEvent) => {goNextDescription(true)}}
            style={{borderRightColor: utils.randomRGBString()}}
            ></span>
            <select id="desc-select" 
              ref={descSelectorRef} 
              onChange={(event) => {songDescriptionOptionClick(event.target.value)}} 
              title="Select the item you would like to read the description for." 
              style={{backgroundColor: utils.randomLightRGBString(), color: utils.randomDarkRGBString()}}
            >
              {
                (musicDescriptionSongs != null) ? 
                  musicDescriptionSongs.map((songObject, index) => {
                    return(
                      <React.Fragment key={`music-desc-opt-${index}`}>
                      {
                        (index == 0) 
                          ? <option value={index} defaultValue>{songObject.title}</option>
                          : <option value={index}>{`${index}) ` + songObject.title}</option>
                      }
                      </React.Fragment>
                    )
                  }) : null
              }
            </select>
            <span className="arrow-item arrow-right" 
              onClick={(mouseEvent) => {goNextDescription()}}
              style={{borderLeftColor: utils.randomRGBString()}}
            ></span>

            <span className="play-icon-wrapper" 
              title="Play this song" 
              onClick={(mouseEvent) => playThisSongBtn(musicDescriptionInfo.currentlyDisplayedAlbum, descSelectorRef.current.selectedIndex - 1)}>
              <span className="play-icon" ></span>
            </span>

          </div>

          <div className="desc-content-wrapper">
            <div className="desc-image">
              <img className="desc-image-img" src={musicDescriptionInfo.image} alt={musicDescriptionInfo.currentlyDisplayedAlbum[0].albumName + ' song image'}/>
            </div>

            <div className="desc-content">
              <h1>{musicDescriptionInfo.title}</h1>
              <h2>{utils.getHumanReleaseDate(musicDescriptionInfo.releaseDate)}</h2>
              <p id="desc-description" style={defaultdescFadeInStyle} onClick={(mouseEvent) => {delegateDescriptionClick(mouseEvent)}}>{musicDescriptionInfo.description}</p>
            </div>
          </div>

        </div>
      </div>

      <div className='featured-wrapper' >

        <div className='navbar-spacing'></div>

        <div className='featured-image-wrapper'>
          <div id='featured-album-image-wrapper' id="FEATURED" className='album' album='FEATURED'>
              <span 
                title={featuredAlbumDescriptionShort}
                onClick={(mouseEvent) => { playAlbum('FEATURED') }}>
              <img className='album-art' src={featuredImage} alt='Featured image'/>
              {/* <img className='album-art' src={imgFeaturedMusic} /> */}
            </span>
            <div style={{color: '#fff', marginTop: '10px'}} className='album-description-icon' onClick={(mouseEvent) => {displayAlbumDescription(albums['FEATURED'], albums['FEATURED'][0])}}>i</div>
          </div>
        </div>

      </div>

      <div className='albums-wrapper'>

        <div className='all-albums'>
          {
            (albums != null) ? 
              Object.keys(albums).map((albumName, index) => {
                
                if(index == 0) {
                  return null
                }

                let albumObjArray = albums[albumName]

                let albumSongObject = albums[albumName][0]

                // console.log(albumName)
                // console.log(albumObjArray)
                // console.log(utils.getAlbumImage(albumSongObject))
                // <img className='album-art' src={ require(utils.getAlbumImage(albumObject)) } />

                return(
                  <div className='album album-two-row' id={albumName} album={Object.keys(albumObjArray)[index]} key={`album-key-${index}`} >
                    <span 
                    title={albumSongObject.albumDescriptionShort}
                    onClick={(mouseEvent) => { mouseEvent.ctrlKey 
                      ? displayAlbumDescription(albumObjArray, albumSongObject)
                      : playAlbum(albumName) }}>
                      <img className='album-art' src={ (utils.getAlbumImage(albumSongObject)) } alt={albumSongObject.albumName + ' album image'}/>
                      <h1>{albumSongObject.album}</h1>
                    </span>
                    <div 
                    className='album-description-icon' 
                    title='Read more information about this album'
                    onClick={(mouseEvent) => { displayAlbumDescription(albumObjArray, albumSongObject) }}>i</div>
                  </div>
                )

              }) : null
          }
        </div>

      </div>

      <div className='jams-wrapper'>

        <h1 className="jams-header">Jams</h1>
      
        <div className='all-jams'>
          {
            (jams != null) ? 
            Object.keys(jams).map((albumName, index) => {

              let albumObjArray = jams[albumName]

              let albumSongObject = jams[albumName][0]

              return(
                <div className='jam jam-four-row' id={albumName} album={Object.keys(albumObjArray)[index]} key={`album-key-${index}`}>
                  <span 
                  onClick={(mouseEvent) => { 
                    mouseEvent.ctrlKey
                    ? displayAlbumDescription(albumObjArray, albumSongObject)
                    : playJam(albumName) }}
                  title={albumSongObject.albumDescriptionShort}
                  >
                    <img className='jam-art' src={ (utils.getAlbumImage(albumSongObject)) }  alt={albumSongObject.albumName + ' album image'}/>
                    <h1>{albumSongObject.album}</h1>
                  </span>
                  <div className='album-description-icon' 
                    title='Read more information about this jam collection'
                    onClick={(mouseEvent) => {displayAlbumDescription(albumObjArray, albumSongObject)}}
                  >i</div>
                </div>
              )

            }) : null
          }
        </div>

      </div>
      
    </div>
  )
}

export default Music