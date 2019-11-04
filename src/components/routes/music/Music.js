import React, { useState, useEffect } from 'react'
import MusicPlayer from './MusicPlayer'
import utils from '../../../js/Utilities'

const INITIAL_ALBUM = 'FEATURED'

function Music(props) {

  const [albums, setAlbums] = useState()

  const [playerOptions, setPlayerProps] = useState()

  useEffect(() => {

      // Init
      if(albums != null) {
        viewAlbum(INITIAL_ALBUM)
        console.log(albums)
      }
      
  }, [albums])

  const displayMusicData = (data) => {
    if(albums == null) {

      setAlbums(data)

    }
  }

  const viewAlbum = (albumName) => {
    
    let options = {
      audioLists: [],
      panelTitle: utils.getAlbumDisplayName(albumName),
      defaultPosition: {
        top: 0,
        left: 0
      },
      autoPlay: false,
      showReload: false,
      preload: 'auto',
    }

    // Apply json song data from albumName album to the player (via options props)
    for(let song of albums[albumName]) {
      if(song != null) {
        options.audioLists.push({
          name: song.title,
          cover: (song.image == null) ? utils.getAlbumImage(song.albumImage) : utils.getAlbumImage(song.image),
          musicSrc: song.file
        })
        console.log(song.file)
      }
    }

    setPlayerProps(options)

  }

  props.dataLoader.getData(props.dataLoader.MUSIC_JSON, displayMusicData)

  return(
    <div className='music-wrapper'>

      <div className='navbar-spacing'></div>

      <MusicPlayer options={playerOptions} />

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