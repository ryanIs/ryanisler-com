/**
 * Music Album Art standard dimensions: 3000 x 3000 pixels at 300 dpi
 * 
 * TODO: Clicking on the default play button on Firefox (desktop) does not play the media. (first run)
 * Instead, clicking on the play button in the playlist context menu starts it.
 */

import React, { useState, useEffect } from 'react'
import MusicPlayer from './MusicPlayer'
import utils from '../../../js/Utilities'
import imgFeaturedMusic from '../../../img/music/featured-music.png'

const INITIAL_ALBUM = 'FEATURED'

function Music(props) {

  // Music JSON data
  const [albums, setAlbums] = useState()

  // String of currently played album
  const [currentAlbum, setCurrentAlbum] = useState()

  // Music player options required by the Jinke Music Player
  const [musicPlayerOptions, setMusicPlayerOptions] = useState()

  // Initialize the 'FEATURED' album
  useEffect(() => {

      // Init
      if(albums != null) {
        initAlbum(INITIAL_ALBUM)
        console.log(albums)
      }
      
  }, [albums])

  /**
   * Sets the albums data object array.
   * @param {Object} data Music Object with the music data
   */
  const displayMusicData = (data) => {
    if(albums == null) {

      setAlbums(data)

    }
  }

  /**
   * Setup the Jinke Music Player and start the 'FEATURED' album
   * @param {String} albumName Name of the album you want to play.
   */
  const initAlbum = (albumName) => {
    
    // Options for the music player
    let options = {

      // Audio files will be placed here for playing
      audioLists: [],

      panelTitle: utils.getAlbumDisplayName(albumName),

      defaultPosition: {
        bottom: 10,
        left: 10
      },

      // Start the player in the 'OPENED' state ('full' or 'mini')
      // NOTE: MOBILE USES 100% VW & VH.
      mode: 'mini',

      emptyLyricPlaceholder: null,

      lyricClassName: null,

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
      // TODO: Figure out looping
      playModeText: {
        order: "order",
        orderLoop: "orderLoop",
        singleLoop: "singleLoop",
        shufflePlay: "shufflePlay"
      },

      onAudioPlay: (audioListInfo) => {
        console.log(audioListInfo)
      },

      playIndex: 0,

      // audioTitle: 'My custom audio title(?)',

      defaultPlayIndex: 0,

      // Automatically hides cover photo if no photo provided
      autoHiddenCover: true,

      autoPlay: false,

      // Play/pause with space bar
      // spaceBar: true,

      // Show reload music file
      // showReload: false,

      // Default theme when loaded
      theme: 'light',

      // Do not show the light/dark mode theme switch
      showThemeSwitch: false,

      preload: 'auto',

    }

    options = getPopulatedOptionsList(albumName, options)

    setMusicPlayerOptions(options)

  }

  /**
   * Play the [albumName] album. Unloads the previous album.
   * @param {String} albumName Name of the album you want to play.
   */
  const playAlbum = (albumName) => {

    let options = {

      // Audio files will be placed here for playing
      audioLists: [],

    }

    getPopulatedOptionsList(albumName, options)

    setMusicPlayerOptions(options)

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
          
        }

        musicPlayerOptions.audioLists.push(newAudioListItem)

        console.log( "newAudioListItem.musicSrc" )
        console.log( newAudioListItem.musicSrc )
      }
    }

    return musicPlayerOptions

  }

  // Load music JSON data into our state
  props.dataLoader.getData(props.dataLoader.MUSIC_JSON, displayMusicData)

  return(
    <div className='music-wrapper'>

      {/* Floating */}
      <MusicPlayer options={musicPlayerOptions} />


      <div className='featured-wrapper'>

        <div className='navbar-spacing'></div>


        <div className='featured-image-wrapper'>
          <div className='album' album='FEATURED' onClick={(mouseEvent) => {playAlbum('FEATURED') }}>
            <img className='album-art' src={imgFeaturedMusic} />
          </div>
        </div>

      </div>

      <div className='albums-wrapper'>
        {/* Loop through albums from data*/}
      </div>

      <div className='jams-wrapper'>
        {/* Objective: Load jams */}
      </div>
      
    </div>
  )
}

export default Music