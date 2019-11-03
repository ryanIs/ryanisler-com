import React, { useState, useEffect } from 'react'

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as jPlayers } from 'react-jplayer';
import { reducer as jPlaylists } from 'react-jplaylist';

import MusicPlayer from './MusicPlayer'
import utils from '../../../js/Utilities'

const store = createStore(combineReducers({ jPlayers, jPlaylists }));

function Music(props) {

  const [music, setGenres] = useState()

  const displayMusicData = (data) => {
    if(music == null) {

      setGenres(data)

    }
  }

  props.dataLoader.getData(props.dataLoader.MUSIC_JSON, displayMusicData)

  return(
    <div className='music-wrapper'>
      <div className='navbar-spacing'></div>

      {/* <Provider store={store}> */}
        <MusicPlayer />
      {/* </Provider> */}
      
    </div>
  )
}

export default Music