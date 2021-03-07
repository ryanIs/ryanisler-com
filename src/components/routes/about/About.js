/**
 * About.js
 * 
 * Displays the About page. This page has a canvas in the background that 
 * renders a tesseract. The user can interact with it based on their mouse 
 * positioning. The tesseract is dim while the About info is active.
 * 
 * Clicking with shift/ctrl/alt causes the properties of the faces and lines 
 * of the tesseract to change. 
 * 
 * Holding shift changes the rotation axis used for the continous spin.
 * 
 * Fun!
 */
import React, { useState, useEffect, useRef } from 'react'
import utils from '../../../js/Utilities'
import tesseract from './Tesseract'
import profileImg from '../../../img/about/profile.png'
import hypercubeImg from '../../../img/hypercube.png'
import soundIcon from '../../../img/note-icon.png'

// &#11088;  star icon (yellow on firefox)

/**
 * Main About component function.
 * 
 * @returns {JSX} Render JSX.
 */
function About() {

  const canvasRef = useRef()

  const [aboutContentStyle, setAboutContentStyle] = useState()

  const [canvasWrapperStyle, setCanvasWrapperStyle] = useState()
  
  const [soundPlaying, setSoundPlaying] = useState(false)
  
  const [homeAudio, setHomeAudio] = useState(new Audio('/music/about.mp3'))

  const [soundBtnStyle, setSoundBtnStyle] = useState({
    // opacity: 0.2
  })
  
  const soundBtnOnCSS = {
    opacity: 0.7
  }

  const soundBtnOffCSS = {
    opacity: 0.2
  }

  useEffect(() => {

    tesseract.initDraw(canvasRef.current)
    // homeAudio.volume = 0.8;
    homeAudio.loop = true
    utils.setDocumentTitle('Ryan Isler - About')
    utils.initRoute()

    return () => {

      tesseract.destructDraw()
      homeAudio.pause()

    }

  }, [])

  /**
   * Play/Pause the home sound.
   * 
   * @param {Object} mouseEvent Mouse event.
   */
  const toggleHomeSound = (mouseEvent) => {
    // toggleHomeSound
    if(soundPlaying == false) {
      setSoundPlaying(true)
      homeAudio.play()
      setSoundBtnStyle(soundBtnOnCSS)
    }
    else {
      setSoundPlaying(false)
      homeAudio.pause()
      setSoundBtnStyle(soundBtnOffCSS)
    }
  }

  /**
   * Toggle the about text and tesseract styling.
   * 
   * @param {Object} event Mouse event.
   */
  const toggleAboutText = (event) => {

    if(aboutContentStyle == null) {
      setAboutContentStyle({
        display: 'none',
      })
      setCanvasWrapperStyle({
        opacity: 1,
      })

      tesseract.openTesseract(event)
    }

    else {
      setAboutContentStyle(null)
      setCanvasWrapperStyle(null)
      tesseract.closeTesseract(event)
    }

  }

  return(
    <div className='about-wrapper'>

      <div className='navbar-spacing'></div>

      <img 
      className='hypercube-img' 
      src={hypercubeImg} 
      title='View the hypercube (use shift to replace x-axis with w-axis & play around with shift/ctrl/alt + click / middle click). ' 
      onClick={(event) => {toggleAboutText()}}/>
      
      <div className='sound-btn-wrapper' style={soundBtnStyle} onClick={(mouseEvent) => {toggleHomeSound()}}>
        <img src={soundIcon} className='sound-icon' />
      </div>

      <div className='canvas-wrapper' style={canvasWrapperStyle}>
        <canvas id='c1' ref={canvasRef}></canvas>
      </div>

      <div className='about-content-wrapper' style={aboutContentStyle}>

        <div className="profile-image-wrapper">
          <img src={profileImg} title="Ryan Isler" />
        </div>

        <div className="about-text-wrapper">
          <p>Welcome to my personal site! I love to create cool stuff! I am a web &amp; game developer, digital artist and musician. I love video games, music, cats and creativity. I've worked on many different game projects all with their own unique art, music and programming. Ranging from full role-playing games to the simplest arcade games, I enjoy the simple pleasure of creating anything I think will be cool. Oh yeah, and I also enjoy watching video game speedruns, thought-provoking movies, computers and all things <a href="https://en.wikipedia.org/wiki/Four-dimensional_space" target="_blank">4D</a>.</p>
          <p>My current work includes the development and completion of several old flash projects. With Flash being phased out soon (sadface), I'm exciting to be working with Unity and other new awesome tools to develop my ideas with. With <a href="/games/stone-king-iii" target="_blank">Stone King III</a> completed, I've been working on Stone King IV which has a completely different battle system than SK, SKII and SKIII. Working with a completely new style of music has been an interesting, yet exciting process. I am learning all new sorts of ways I can use sounds and to compose some very interesting ambient background music. </p>
          <p>Along with game development, I am happily learning new creativity techniques and exploring fascinating ideas for new projects. My mission is to be creative in all of my works and push my boundaries as an artist. I think it would be very cool to setup a moon/mars base or start working on building a Dysonsphere around our sun. I know that's pretty far down the line, but if I can help to inspire people and create real drive for that goal then I think we would be in for treat.</p>
        </div>

      </div>

    </div>
  )
}

export default About;