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
import Nav from './components/nav/Nav'
import DataLoader from './js/DataLoader'

/**
 * App is the primary React Hooks function. This has access to 
 * Reacts hooks and returns jsx.
 */

function App(props) {

  // The main state for our application
  const [state, setState] = useState()

  const dataLoader = new DataLoader()

  return (
    <div className="App">

      <Router>
        
        <Nav />
        
        <Route path="/" exact render={(props) => <Index dataLoader={dataLoader} />} />
        <Route path="/games" render={(props) => <Games dataLoader={dataLoader} />} />
        <Route path="/art" render={(props) => <Art dataLoader={dataLoader} />} />
        <Route path="/music" render={(props) => <Music dataLoader={dataLoader} />} />
        <Route path="/timeline" render={(props) => <Timeline dataLoader={dataLoader} />} />
        <Route path="/About" render={(props) => <About dataLoader={dataLoader} />} />
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