/**
 * NotFound.js
 * 
 * This is the default display page for 404 links on the entire ryanisler.com website.
 */
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import utils from '../../js/Utilities'

/**
 * Main NotFound component function.
 * 
 * @returns {JSX} Render JSX.
 */
function NotFound() {

  return(
    <div className='not-found-wrapper'>
      
      <div className='navbar-spacing'></div>

      <h1>404</h1><span>File not found</span>
      <Link to="/">Home</Link>


    </div>
  )
}
export default NotFound;