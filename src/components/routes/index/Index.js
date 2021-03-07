/**
 * Index.js 
 * 
 * This is the HOMEPAGE route. It displays the animated background and featured
 * items below that.
 */
import React, { useState, useEffect, useRef } from 'react';
import Featured from './featured/Featured'
import background from './Background'
import utils from '../../../js/Utilities'
import imgRIBanner from '../../../img/hypercube.png'
import soundIcon from '../../../img/note-icon.png'
import hypercubeVideo0 from '../../../media/hypercube/hc-0.mp4'
import hypercubeVideo1 from '../../../media/hypercube/hc-1.mp4'
import hypercubeVideo2 from '../../../media/hypercube/hc-2.mp4'
import hypercubeVideo3 from '../../../media/hypercube/hc-3.mp4'
import hypercubeVideo4 from '../../../media/hypercube/hc-4.mp4'
import hypercubeVideo5 from '../../../media/hypercube/hc-5.mp4'
import hypercubeVideo6 from '../../../media/hypercube/hc-6.mp4'
import hypercubeVideo7 from '../../../media/hypercube/hc-7.mp4'
import hypercubeVideo8 from '../../../media/hypercube/hc-8.mp4'
import hypercubeVideo9 from '../../../media/hypercube/hc-9.mp4'
import hypercubeVideo10 from '../../../media/hypercube/hc-10.mp4'
import hypercubeVideo11 from '../../../media/hypercube/hc-11.mp4'
import hypercubeVideo12 from '../../../media/hypercube/hc-12.mp4'

// don't import, use an audio file that can be uploaded to /music
// import homeAudioFile from '../../../media/hypercube/hc-12.mp4'

const hypercubeVideos = [
  hypercubeVideo0,
  hypercubeVideo1,
  hypercubeVideo2,
  hypercubeVideo3,
  hypercubeVideo4,
  hypercubeVideo5,
  hypercubeVideo6,
  hypercubeVideo7,
  hypercubeVideo8,
  hypercubeVideo9,
  hypercubeVideo10,
  hypercubeVideo11,
  hypercubeVideo12
]

/**
 * Index component main function.
 * 
 * @param {Object} props React props passed from parent.
 * @returns {JSX} JSX Render.
 */
function Index(props) {

  const [soundPlaying, setSoundPlaying] = useState(false)

  // Array of all the hypercube videos
  const [hypercubeVideo, setHypercubeVideo] = useState(
    hypercubeVideos[utils.random( hypercubeVideos.length - 1 )]
  )

  const [hypercubeVideoInterval, setHypercubeVideoInterval] = useState()

  const [hypercubeVideoIntervalB, setHypercubeVideoIntervalB] = useState()

  const [hypercubeVideoParameters, setHypercubeVideoParameters] = useState({
    width: 400,
    height: 400
  })

  const [homeAudio, setHomeAudio] = useState(new Audio('/music/index.mp3'))

  const [soundBtnStyle, setSoundBtnStyle] = useState({
    // opacity: 0.2
  })

  // Display the background using useEffect (componentDidMount)
  useEffect(() => {
    background.initCanvas(BACKGROUND_MODE)
    utils.setDocumentTitle()
    utils.initRoute()
    // homeAudio.volume = 0.09; // Commented out; allows more dynamic range the song can have
    homeAudio.loop = true
  }, [])

  // Display the background using useEffect (componentDidUnmount)
  useEffect(() => {
    return () => {

      homeAudio.pause()

      background.unloadBG()

      if(hypercubeVideoInterval != null) {
        clearInterval(hypercubeVideoInterval)
      }

      if(hypercubeVideoIntervalB != null) {
        clearInterval(hypercubeVideoIntervalB)
      }

    }
  }, [])

  const hypercubeVideoRef = useRef()

  // Enable or disable the background effects (CPU heavy)
  // Options: 'NONE': Do not render; 'LITE': Only 30 circles available; 'DEFAULT': 180 full circle
  const BACKGROUND_MODE = 'LITE'

  const soundBtnOnCSS = {
    opacity: 0.7
  }

  const soundBtnOffCSS = {
    opacity: 0.2
  }

  /**
   * Handles the changing the hypercube video.
   * 
   * @param {Boolean} turnOff If true, sets the hypercube video opacity to 0
   *   in preparation for a transition
   */
  const updateHypercubeAppearance = (turnOff) => {
    // console.log(hypercubeVideos[utils.random( hypercubeVideos.length - 1 )])
    try {
      
      if(turnOff == null || turnOff == false) {

        setHypercubeVideo(
          hypercubeVideos[utils.random( hypercubeVideos.length - 1 )]
        )
        hypercubeVideoRef.current.style.opacity = '0.5'

        let _newWidth = 100 + utils.random(900)
        let _left = (0 + utils.random(60)) + 'vw'

        setHypercubeVideoParameters({
          width: _newWidth,
          height: _newWidth,
          left: _left,
          transform: `rotate(${utils.random(360)}deg)`
        })

      }

      else {
        hypercubeVideoRef.current.style.opacity = '0.0'

        setHypercubeVideoIntervalB(
          setTimeout(updateHypercubeAppearance, 2000)
        )

      }

    }

    catch(e) {
      console.log('updateHypercubeAppearance() error')
      console.log(e)
    }

  }

  /**
   * Toggle the home sound off or on.
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

  // setHypercubeVideo(
  //   hypercubeVideos[utils.random( hypercubeVideos.length - 1 )]
  // )

  if(hypercubeVideoInterval == null) {
    setHypercubeVideoInterval(
      setInterval(updateHypercubeAppearance, 20000, true)
    )
  }

  return(
    <div className="route route-index">
      
      <div className="background-overlay"></div>

      <div className='sound-btn-wrapper' style={soundBtnStyle} onClick={(mouseEvent) => {toggleHomeSound()}}>
        <img src={soundIcon} className='sound-icon' />
      </div>

      <div className='hypercube-video-container'>
        <div style={hypercubeVideoParameters} className='banner-hypercube-video-wrapper' ref={hypercubeVideoRef}>
          <video src={hypercubeVideo} muted loop autoPlay playsInline>
            <source src={hypercubeVideo} type="video/mp4" />
          </video> 
        </div>
      </div>

      <div className="background-wrapper">
        <div className="background-canvas">
          <canvas id="background-canvas" width="2000px" height="1200px"></canvas>
        </div>
      </div>

      <div className='banner-wrapper'>
        <div className='banner-header'>

          <div className='banner-main'>
            <span className='banner-main-ryan'>Ryan</span> <span className='banner-main-image-container'><img src={imgRIBanner} alt='' /></span> <span className='banner-main-isler'>Isler</span>
          </div>
        </div>
      </div>

      <Featured dataLoader={props.dataLoader} />

    </div>
  )
}

export default Index