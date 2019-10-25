/**
 * Displays the navigation bar at the header of every page.
 */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import imgGamesNav from '../../img/games-nav.png'
import imgMusicNav from '../../img/music-nav.png'
import imgArtNav from '../../img/art-nav.png'
import imgTimelineNav from '../../img/timeline-nav.png'
import imgAboutNav from '../../img/about-nav.png'
import imgBrand from '../../img/hypercube.png'

function Nav(props) {

  // Deprecated (navbar is ALWAYS loaded and only loads when the page loads)
  // let navbarClassName = 'navbar ' + ((props.navbarAnimation != null) ? props.navbarAnimation : '')
  let navbarClassName = 'navbar navbar-default navbar-fade-in'

  return(
    <div className='navbar-wrapper'>
      <nav className={navbarClassName}>

        <div className='navbar-brand'>
          <Link to="/"><img className='navbar-icon' src={imgBrand} alt=''/> Ryan Isler</Link>
        </div>

        <div className='navbar-nav' >
          <ul className='navbar-right'>
            <li><Link to="/games"><img className='navbar-icon' src={imgGamesNav} alt='' /> Games</Link></li>
            <li><Link to="/music"><img className='navbar-icon' src={imgMusicNav} alt='' /> Music</Link></li>
            <li><Link to="/art"><img className='navbar-icon' src={imgArtNav} alt='' /> Art</Link></li>
            <li><Link to="/timeline"><img className='navbar-icon' src={imgTimelineNav} alt='' /> Timeline</Link></li>
            <li><Link to="/about"><img className='navbar-icon' src={imgAboutNav} alt='' /> About</Link></li>
          </ul>
        </div>

      </nav>
    </div>
  )
}
/* Toggle ability
<div className="navbar-header">
<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
  <span className="sr-only">Toggle navigation</span>
  <span className="icon-bar"></span>
  <span className="icon-bar"></span>
  <span className="icon-bar"></span>
</button>
</div>
*/
export default Nav;