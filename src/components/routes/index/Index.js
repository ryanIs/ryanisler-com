/**
 * Index.js is the HOMEPAGE route. It displays the animated background and featured
 * items below that.
 */
import React, { useState, useEffect } from 'react';
import Featured from './featured/Featured'
import background from './Background'
import utils from '../../../js/Utilities'
import imgRIBanner from '../../../img/hypercube.png'

function Index(props) {

  // Display the background using useEffect (componentDidMount)
  useEffect(() => {
    background.initCanvas(BACKGROUND_MODE)
  }, [])

  // Display the background using useEffect (componentDidUnmount)
  useEffect(() => (() => background.unloadBG()))

  // Enable or disable the background effects (CPU heavy)
  // Options: 'NONE': Do not render; 'LITE': Only 30 circles available; 'DEFAULT': 180 full circle
  const BACKGROUND_MODE = 'LITE'

  utils.initRoute()

  return(
    <div className="route route-index">
      
      <div className="background-overlay"></div>

      <div className="background-wrapper">
        <div className="background-canvas">
          <canvas id="background-canvas" width="2000px" height="1200px"></canvas>
        </div>
      </div>

      <div className='banner-wrapper'>
        <div className='banner-header'>
          <div className='banner-main'>
          Ryan <img src={imgRIBanner} alt='' /> Isler
          </div>
        </div>
      </div>

      <Featured dataLoader={props.dataLoader} />

    </div>
  )
}

export default Index