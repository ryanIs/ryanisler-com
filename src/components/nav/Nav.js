import React, { useState, useEffect } from 'react'

function Nav(props) {
  return(
    <div className='navbar'>
      <div className='navbar-brand'>
        Ryan Isler
      </div>
      <div className='right'>
        <a href='#'><img src={require('../../img/games-nav.png')} /> Games</a>
        <a href='#'><img src={require('../../img/music-nav.png')} /> Music</a>
        <a href='#'><img src={require('../../img/art-nav.png')} /> Art</a>
        <a href='#'><img src={require('../../img/timeline-nav.png')} /> Timeline</a>
        <a href='#'><img src={require('../../img/about-nav.png')} /> About</a>
      </div>
    </div>
  )
}