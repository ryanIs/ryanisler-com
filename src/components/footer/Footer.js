/**
 * Footer.js
 * 
 * Displays the footer bar at the header of every page. The footer 
 * contains a Twitter pop-out menu when hovering the Twitter link.
 */
import React, { useState, useEffect } from 'react'
import footerHypercubeVideo from '../../media/hypercube/footer-hypercube.mp4'
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import utils from '../../js/Utilities'

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Main Footer component function.
 * 
 * @returns {JSX} Render JSX.
 */
function Footer() {
  return(
    <div className='footer-wrapper'>
      <footer className='footer'>
        <span className='footer-p'>
          <span className="ryan-isler-text" onClick={(e) => { utils.scrollToTop() }}>Ryan Isler &copy; {CURRENT_YEAR} </span>
          <span className="text-divider"></span> 
          <span className="footer-twitter-wrapper">
            <a target="_blank" href="https://twitter.com/ryanisl">&#128038; Twitter</a> 
            <div className="twitter-wrapper">
              <div className="twitter-wrapper-b">
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="RyanIsl"
                  options={{height: 350}}
                />
              </div>
            </div>
          </span>
          <a target="_blank" href="https://www.facebook.com/RyanIslerDesigner/">&#128218; Facebook</a> 
          <a target="_blank" href="https://www.youtube.com/user/ryanisl">&#128249; YouTube</a> 
          <a target="_blank" href="https://dma.hamline.edu/~risler01/index.html">&#127979; Hamline</a> 
          <a target="_blank" href="http://www.ryanisler.com/blog">&#127760; Blog</a>
        </span>
        
        <a id='footer-tesseract-link' href='https://en.wikipedia.org/wiki/Tesseract' target='_blank'>
          <div className='footer-video-wrapper'>
            <video src={footerHypercubeVideo} muted loop autoPlay playsInline>
              <source src={footerHypercubeVideo} type="video/mp4" />
            </video> 
          </div>
        </a>
        
      </footer>
    </div>
  )
}

export default Footer;