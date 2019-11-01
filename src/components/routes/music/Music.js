import React, { useState, useEffect } from 'react'
import utils from '../../../js/Utiities'

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

    </div>
  )
}

export default Games