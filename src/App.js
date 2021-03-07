/**
 * App.js
 * 
 * This is the main file for the website. It contains all of the routing and
 * handles top-level things.
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom"
import Nav from './components/nav/Nav'
import Footer from './components/footer/Footer'
import NotFound from './components/not-found/NotFound'
import DataLoader from './js/DataLoader'
import Index from './components/routes/index/Index'
import Games from './components/routes/games/Games'
import GameRoutes from './components/routes/games/GameRoutes'
import Music from './components/routes/music/Music'
import Art from './components/routes/art/Art'
import ArtRoutes from './components/routes/art/ArtRoutes'
import About from './components/routes/about/About'
import utils from './js/Utilities'

const SOUND_ENABLED_STRING = 'sound-enabled'
const SOUND_DISABLED_STRING = 'sound-disabled'

/**
 * App is the primary React Hooks function. This has access to 
 * Reacts hooks and returns jsx.
 * 
 * @returns {JSX} JSX Render.
 */
function App() {

  // The main state for our application
  const [state, setState] = useState()

  const [gamePreviewSoundEnabled, setGamePreviewSound] = useState(SOUND_DISABLED_STRING)

  const dataLoader = new DataLoader()

  let musicKeyDownHandler, musicKeyUpHandler

  /**
   * Toggle the game sound on or off.
   * @param {Object} mouseEvent Mouse event trigger on click.
   * @param {Function} callback Function to be called after the game preview sound has been set.
   */
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

  /**
   * Handle key down events.
   * @param {Object} event Key event.
   */
  const handleKeyDown = (event) => {
    console.log(event)
  }

  /**
   * Handle key up events.
   * @param {Object} event Key event.
   */
  const handleKeyUp = (event) => {
    console.log(event)
  }

  const gameRoutes = GameRoutes({dataLoader})
  const artRoutes = ArtRoutes({dataLoader})

  return (
    <div className="App">

      <Router>
        
        <Nav />
        
        <Switch>
          <Route path="/" exact render={(props) => <Index dataLoader={dataLoader} />} />
          <Route path="/games" exact render={(props) => <Games dataLoader={dataLoader} toggleGameSound={toggleGameSound} soundEnabled={gamePreviewSoundEnabled} />} />
          <Route path="/art" exact render={(props) => <Art dataLoader={dataLoader} />} />
          <Route path="/music" render={(props) => <Music dataLoader={dataLoader} />} />
          <Route path="/timeline" render={(props) => <Timeline dataLoader={dataLoader} />} />
          <Route path="/About" render={(props) => <About dataLoader={dataLoader} />} />
          {gameRoutes}
          {artRoutes}
          <Route component={NotFound} />
        </Switch>


        <Footer />

      </Router>
    </div>
  )

}

// Temporary routes until the component is built out
const Timeline = (props) => (<h2>Timeline section!</h2>)

export default App;