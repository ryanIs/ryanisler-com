/**
 * App.js
 * 
 * This is the main file for the website. It contains all of the routing and
 * handles top-level things.
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Index from './components/routes/index/Index'
import Nav from './components/routes/Nav/Nav'

/**
 * App is the primary React Hooks function. This has access to 
 * Reacts hooks and returns jsx.
 */
function App(props) {

  // The main state for our application
  const [state, setState] = useState()

  // <div>
  //   <nav>
  //     <ul>
  //       <li>
  //         <Link to="/">Home</Link>
  //       </li>
  //       <li>
  //         <Link to="/about/">About</Link>
  //       </li>
  //     </ul>
  //   </nav>

  //   <Route path="/" exact component={Index} />
  //   <Route path="/about/" component={About} />
  // </div>

  return (
    <div className="App">

      <Router>
        <Route path="/" exact component={Index} />
      </Router>
    </div>
  )

}

function About() {
  return <h2>About</h2>
}

export default App;