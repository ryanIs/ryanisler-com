/**
 * App.js
 * 
 * This is the main file for the website. It contains all of the routing and
 * handles top-level things.
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Index from './components/routes/index/Index'
import Games from './components/routes/games/Games'
import GameRoutes from './components/routes/games/GameRoutes'
import Nav from './components/nav/Nav'
import DataLoader from './js/DataLoader'

const SOUND_ENABLED_STRING = 'sound-enabled'
const SOUND_DISABLED_STRING = 'sound-disabled'

/**
 * App is the primary React Hooks function. This has access to 
 * Reacts hooks and returns jsx.
 */

function App(props) {

  // The main state for our application
  const [state, setState] = useState()
  const [gamePreviewSoundEnabled, setGamePreviewSound] = useState(SOUND_DISABLED_STRING)

  const dataLoader = new DataLoader()

  const toggleGameSound = (mouseEvent, callback = null) => {
    if(gamePreviewSoundEnabled == SOUND_DISABLED_STRING) {
      setGamePreviewSound(SOUND_ENABLED_STRING)
    } else if(gamePreviewSoundEnabled == SOUND_ENABLED_STRING) {
      setGamePreviewSound(SOUND_DISABLED_STRING)
    }
    if(callback != null) {
      callback()
    }
  }

  return (
    <div className="App">

      <Router>
        
        <Nav />
        
        <Route path="/" exact render={(props) => <Index dataLoader={dataLoader} />} />
        <Route path="/games" exact render={(props) => <Games dataLoader={dataLoader} toggleGameSound={toggleGameSound} soundEnabled={gamePreviewSoundEnabled} />} />
        <Route path="/art" render={(props) => <Art dataLoader={dataLoader} />} />
        <Route path="/music" render={(props) => <Music dataLoader={dataLoader} />} />
        <Route path="/timeline" render={(props) => <Timeline dataLoader={dataLoader} />} />
        <Route path="/About" render={(props) => <About dataLoader={dataLoader} />} />

        <GameRoutes dataLoader={dataLoader} />

      </Router>
    </div>
  )

}

// Temporary routes until the component is built out
const About = (props) => (<h2>About section!</h2>)
const Art = (props) => (<h2>Art section!</h2>)
const Music = (props) => (<h2>Music section!</h2>)
const Timeline = (props) => (<h2>Timeline section!</h2>)

export default App;