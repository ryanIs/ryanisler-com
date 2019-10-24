/**
 * Index.js is the HOMEPAGE route. It displays the animated background and featured
 * items below that.
 */
import React, { useState, useEffect } from 'react';
import background from './Background'

function Index(props) {

  // Enable or disable the background effects (CPU heavy)
  const ENABLE_BACKGROUND = false

  // Display the background using useEffect (componentDidMount)
  useEffect(() => {
    background(ENABLE_BACKGROUND)
  }, [])

  return(
    <div className="route route-index">
      
      <div className="background-overlay"></div>

      <div className="background-wrapper">
        <div className="background-canvas">
          <canvas id="background-canvas" width="2000px" height="1200px"></canvas>
        </div>
      </div>

      <div className='featured-wrapper'>
        FEATURED SECTION
      </div>

    </div>
  )
}

export default Index