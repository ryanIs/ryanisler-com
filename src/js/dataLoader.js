/**
 * dataLoader.js
 * 
 * This file is responsible for bringing JSON data directly
 * into objects on run-time for use.
 */

var FEATURED_JSON = "FEATURED",
    GAMES_JSON = "GAMES",
    MUSIC_JSON = "MUSIC",
    ART_JSON = "ART",
    RANDOM_JSON = "RANDOM";

var FEATURED_URL = "../json/featured.json",
    GAMES_URL = "../json/games.json",
    MUSIC_URL = "../json/music.json",
    ART_URL = "../json/art.json",
    RANDOM_URL = "../json/random.json";

 var featured, games, music, art, random;

 function loadJSON(type, callback) {

    var JSONUrl = FEATURED_JSON;

    if(type == FEATURED_JSON) {
        JSONUrl = FEATURED_URL;
    } else if(type == GAMES_JSON) {
        JSONUrl = GAMES_URL;
    } else if(type == MUSIC_JSON) {
        JSONUrl = MUSIC_URL;
    } else if(type == ART_JSON) {
        JSONUrl = FEATURED_ART_URLURL;
    } else if(type == RANDOM_JSON) {
        JSONUrl = RANDOM_URL;
    }

    var jsonRequest = new XMLHttpRequest();

    jsonRequest.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            
            var myObjectData = JSON.parse(this.response);
            console.log(myObjectData);

            if(type == FEATURED_JSON) {
                featured = myObjectData;
            } else if(type == GAMES_JSON) {
                games = myObjectData;
            } else if(type == MUSIC_JSON) {
                music = myObjectData;
            } else if(type == ART_JSON) {
                art = myObjectData;
            } else if(type == RANDOM_JSON) {
                random = myObjectData;
            }

            if(callback != null) {
                callback(myObjectData);
            }

        }
    };

    jsonRequest.open("GET", JSONUrl);
    jsonRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    jsonRequest.send();

    return jsonRequest;

 }