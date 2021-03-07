/**
 * ArtRoutes.js
 * 
 * Handles the React routing for the different art objects from art.json.
 */
import React, { useState, useEffect } from 'react'
import ArtRoute from './ArtRoute'
import { Route } from "react-router-dom"
import utils from '../../../js/Utilities'

/**
 * Main ArtRoutes component function.
 * 
 * @param {Object} props Properties from the parent.
 * @returns {JSX} Render JSX.
 */
function ArtRoutes(props) {

  const [artData, setRoutes] = useState()

  /**
   * Set the art data based on the art.json input.
   * 
   * @param {Object} data The data from art.json.
   */
  const routeData = (data) => {
    if(artData == null) {

      setRoutes(data)

    }
  }
  
  props.dataLoader.getData(props.dataLoader.ART_JSON, routeData)

  return (artData != null) 
    ?
      artData["art"].map((artObject, index) => {
        return <Route path={`/art/${artObject.id}`} render={(props) => <ArtRoute art={artObject} />} key={`art-${index}`} />
      })
    : null
  
}

export default ArtRoutes