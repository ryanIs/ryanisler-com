const playHandler = (albumType, albumName, trackIndex = 0, playOnLoaded) => {

  let myArray = albumType


  if(trackIndex < 0 || trackIndex > myArray[albumName].length - 1) {
    trackIndex = 0
  }

  if(albumName != currentAlbum) {

    let options = getDefaultOptions(albumName)

    // options.autoPlayInitLoadPlayList = true

    options = getPopulatedOptionsList(albumName, options)

    currentAlbumNow = albumName

    clearAudioList()
    // console.log(options)
    // setMusicPlayerOptions(options)
    
    // This method is a (poor) work around to a problem with this version of jinke music player
    // (albumList does not update with change of props audioList)
    setTimeout(()=> {

      setMusicPlayerOptions(options)

      setTimeout(() => {
        if(reactJkMusicPlayerRef.current.state.audioLists[0] != null) {

          if(trackIndex == null) {
            if(playOnLoaded) {
              reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[0].id)
            }
          }
          else {
            if(playOnLoaded) {
              reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id)
            }
          }
          
          // Dangerously modify the DOM directly:
          let audioItems = document.getElementsByClassName('audio-item')
          for(let i = 0; i < audioItems.length; i++) {
            audioItems[i].title = myArray[albumName][i].descriptionShort
          }

          // User selected to play specific track from description
          // try {
          //   if(trackIndex != null) {
          //     reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id)
          //   }
          // }
          // catch(e) {
          //   console.log("playAlbum() setTimeout() error")
          //   console.log(e)
          // }

        }
      }, 200)

    }, 200)

    setCurrentAlbum(albumName)

  }

  else if(trackIndex != null) {
    setTimeout(() => {

      try {
        if(playOnLoaded) {
          reactJkMusicPlayerRef.current.audioListsPlay(reactJkMusicPlayerRef.current.state.audioLists[trackIndex].id)
        }
      }
      catch(e) {
        console.log("playAlbum() setTimeout() error")
        console.log(e)
      }

    },400)
  }
}