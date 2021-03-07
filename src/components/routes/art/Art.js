/**
 * Art.js
 * 
 * Displays art from art.json in a responsive grid pattern.
 */

import React, { useState, useEffect, useRef } from 'react'
import utils from '../../../js/Utilities'
import { Link } from "react-router-dom"

let artPositionY = 0

/**
 * Main Art component function.
 * 
 * @param {Object} props Properties from the parent.
 * @returns {JSX} Render JSX.
 */
function Art(props) {

  // All genres and game data. Gets set async.
  const [art, setArt] = useState()

  // const artTitleRef = useRef()
  let artTitleRefs = []

  useEffect(() => {
    utils.setDocumentTitle('Ryan Isler - Art')
    utils.initRoute()
    if(artPositionY != 0) {
      window.scrollTo(0, artPositionY)
    }
    return () => {
      artPositionY = window.scrollY
    }
  }, [])

  /**
   * Set the art data from the art.json file.
   * 
   * @param {Object} data The art data from the art.json file.
   */
  const displayArtData = (data) => {
    if(art == null) {
      setArt(data)
    }
  }
  
  /**
   * Show the art title for the index.
   * 
   * @param {Number} index The index of the art title to display.
   */
  const showArtTitle = (index) => {
    artTitleRefs[index].style.opacity = '1.0'
  }

  
  /**
   * Hide the art title for the index.
   * 
   * @param {Number} index The index of the art title to display.
   */
  const hideArtTitle = (index) => {
    artTitleRefs[index].style.opacity = '0'
  }

  /**
   * Push title ref to artTitleRefs object.
   * 
   * @param {Object} ref React ref object.
   */
  const pushNewTitleRef = (ref) => {
    artTitleRefs.push(ref)
  }

  props.dataLoader.getData(props.dataLoader.ART_JSON, displayArtData)

  return(
    <div className='art-wrapper'>

      <div className='navbar-spacing'></div>

      <div className='all-art-wrapper row'>

        {
          (art != null) 
          ? art["art"].map((artObject, index) => {

            return(


              <div 
                className='art-object'
                art={artObject.id} 
                key={`ART-obj-${index}`} 
                title={artObject.descriptionShort}
                onMouseOver={() => (showArtTitle(index))} 
                onMouseOut={() => (hideArtTitle(index))}
                >

                <Link className='art-link-a' to={`/art/${artObject.id}`}>

                  <img src={utils.getArtImage(artObject)} alt={artObject.title}/>

                  <span className='art-name-overlay' ref={pushNewTitleRef}>
                    <div>{artObject.title}</div>
                  </span>

                </Link>

              </div>
            )

          }) 
          : null
        }

      </div>
      
    </div>
  )
}

export default Art