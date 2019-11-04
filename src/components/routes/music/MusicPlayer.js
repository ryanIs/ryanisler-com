import React from 'react';
import ReactJkMusicPlayer from "react-jinke-music-player";

const MusicPlayer = (props) => {

  return(
    <div class="music-player-wrapper">
      <ReactJkMusicPlayer {...props.options} />,
    </div>
  )

}

export default MusicPlayer;