
  const handleWindowPathname = (pathName) => {

    let pathNameSplit = pathName.split('music/')

    if(pathNameSplit.length < 1 || windowPathAlbumFound != null) {
      return
    }

    else {
      if(pathNameSplit[1] != null) {
        let [requestedAlbumId, requestedSongId] = pathNameSplit[1].split('/')

        // if(requestedSongId == null || requestedSongId == "" || requestedSongId.length < 1) {
        // }
        // console.log('requestedSongId is: '+requestedSongId)

        // Check albums
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
          }
        }

        // Only check jams if an album hasn't been checked yet
        if(windowPathAlbumFound == null) {

          // Check Jams
          for(let myAlbumId of Object.keys(jams)) {
            if(myAlbumId == requestedAlbumId) {
              windowPathAlbumFound = "jams"
              INITIAL_ALBUM = requestedAlbumId
              let myTrackId = getTrackIdForSongId(jams[INITIAL_ALBUM], requestedSongId)
              INITIAL_TRACK_ID_IS_VALID = songIdExistsInAlbum(jams[INITIAL_ALBUM], requestedSongId)
              if(myTrackId != null) {
                INITIAL_TRACK = myTrackId
              }
            }
          }

        }


      }
    }
    
  }