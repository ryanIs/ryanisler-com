/**
 * DataLoader.js
 * 
 * This file is responsible for bringing JSON data directly
 * into objects on run-time for use.
 */

class DataLoader {

  constructor() {
    
  }

  FEATURED_JSON = "FEATURED"
  GAMES_JSON = "GAMES"
  MUSIC_JSON = "MUSIC"
  JAMS_JSON = "JAMS";
  ART_JSON = "ART"
  RANDOM_JSON = "RANDOM";

  FEATURED_URL = "/json/featured.json"
  GAMES_URL = "/json/games.json"
  MUSIC_URL = "/json/music.json"
  JAMS_URL = "/json/jams.json"
  ART_URL = "/json/art.json"
  RANDOM_URL = "/json/random.json"

  featured
  games
  music
  art
  random

  /**
   * Fetches data from (same domain) json file.
   * The _next_ time this is called, it will INSTANTLY return the data.
   * 
   * @param {String} type JSON type.
   * @param {Function} callback Callback that fires after the JSON has been loaded.
   * @returns {Object} JSON data used for main site content.
   */
  getData(type = this.FEATURED_JSON, callback = null) {

    let JSONUrl = this.FEATURED_JSON;

    if(type == this.FEATURED_JSON) {
      JSONUrl = this.FEATURED_URL;
      if(this.featured != null) {
        if(callback != null) {
          callback(this.featured)
        }
        return this.featured
      }
    } 

    else if(type == this.GAMES_JSON) {
      JSONUrl = this.GAMES_URL;
      if(this.games != null) {
        if(callback != null) {
          callback(this.games)
        }
        return this.games
      }
    } 

    else if(type == this.MUSIC_JSON) {
      JSONUrl = this.MUSIC_URL;
      if(this.music != null) {
        if(callback != null) {
          callback(this.music)
        }
        return this.music
      }
    } 

    else if(type == this.JAMS_JSON) {
      JSONUrl = this.JAMS_URL;
      if(this.jams != null) {
        if(callback != null) {
          callback(this.jams)
        }
        return this.jams
      }
    } 

    else if(type == this.ART_JSON) {
      JSONUrl = this.ART_URL;
      if(this.art != null) {
        if(callback != null) {
          callback(this.art)
        }
        return this.art
      }
    } 

    else if(type == this.RANDOM_JSON) {
      JSONUrl = this.RANDOM_URL;
      if(this.random != null) {
        if(callback != null) {
          callback(this.random)
        }
        return this.random
      }
    }

    // Initiate the fetch request
    return fetch(JSONUrl, {method: 'GET'})
    .then(response => (response.json()))
    .then(response => {

      // console.log('Fetch successs:');
      // console.log(response);

      if(type == this.FEATURED_JSON) {
        this.featured = response;
      } else if(type == this.GAMES_JSON) {
        this.games = response;
      } else if(type == this.MUSIC_JSON) {
        this.music = response;
      } else if(type == this.ART_JSON) {
        this.art = response;
      } else if(type == this.RANDOM_JSON) {
        this.random = response;
      } else if(type == this.JAMS_JSON) {
        this.jams = response;
      }

      if(callback != null) {
        callback(response)
      }

    })
    .catch(error => {

      console.log('Fetch error')
      console.log(error)

    })

    // var jsonRequest = new XMLHttpRequest();

    // jsonRequest.onreadystatechange = function() {
    //   if(this.readyState == 4 && this.status == 200) {
          
    //     var myObjectData = JSON.parse(this.response);
    //     console.log(myObjectData);

    //     if(type == FEATURED_JSON) {
    //       featured = myObjectData;
    //     } else if(type == GAMES_JSON) {
    //       games = myObjectData;
    //     } else if(type == MUSIC_JSON) {
    //       music = myObjectData;
    //     } else if(type == ART_JSON) {
    //       art = myObjectData;
    //     } else if(type == RANDOM_JSON) {
    //       random = myObjectData;
    //     }

    //     if(callback != null) {
    //       callback(myObjectData);
    //     }

    //   }
    // };

    // jsonRequest.open("GET", JSONUrl);
    // jsonRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // jsonRequest.send();

    // return jsonRequest;

  }

}

export default DataLoader