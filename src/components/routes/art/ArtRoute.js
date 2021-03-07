/**
 * ArtRoute.js
 * 
 * This is a route endpoint for an art piece. It displays the image and the 
 * art's description below it.
 */
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import utils from '../../../js/Utilities'

/**
 * Main ArtRoute component function.
 * 
 * @param {Object} props Properties from the parent.
 * @returns {JSX} Render JSX.
 */
function ArtRoute(props) {

  const art = props.art
  
  useEffect(() => {
    utils.setDocumentTitle(`Ryan Isler - ${art.title}`)
    utils.initRoute()
  }, [])

  return(
    <div className='art-route-wrapper'>

      <div className='navbar-spacing'></div>

      <Link to="/art">
        <div className="main-art-back-button">&#8678;</div>
      </Link>

      <div className="main-art-wrapper">

        <h1>{art.title}</h1>
        <h2>{utils.getHumanReleaseDate(art.releaseDate)}</h2>

        <div className="art-container">

          <a href={utils.getArtImage(art)} target='_blank'>
            <img src={utils.getArtImage(art)} title={art.descriptionShort} />
          </a>

        </div>

      </div>

      <div className="main-art-description-wrapper">
        <p>
          {art.description}
        </p>
      </div>

    </div>
  )
}

export default ArtRoute