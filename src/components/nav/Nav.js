/**
 * Nav.js
 * 
 * Displays the navigation bar at the header of every page.
 */
import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import imgGamesNav from '../../img/games-nav.png'
import imgMusicNav from '../../img/music-nav.png'
import imgArtNav from '../../img/art-nav.png'
import imgTimelineNav from '../../img/timeline-nav.png'
import imgBlogNav from '../../img/blog-nav.png'
import imgAboutNav from '../../img/about-nav.png'
import imgBrand from '../../img/hypercube.png'

/**
 * Main Navigation component function.
 * 
 * @param {Object} props Properties from the parent.
 * @returns {JSX} Render JSX.
 */
function Nav(props) {

  const NAVBAR_DEFAULT_CLASS_NAME = 'navbar navbar-default navbar-fade-in',
        NAVBAR_FAST_CLASS_NAME = 'navbar navbar-default navbar-fade-in-fast'



  // Deprecated (navbar is ALWAYS loaded and only loads when the page loads)
  // let navbarClassName = 'navbar ' + ((props.navbarAnimation != null) ? props.navbarAnimation : '')
  let [navbarClassName, setNavbarClassName] = useState(NAVBAR_DEFAULT_CLASS_NAME)

  let [navRightClassName, setNavRightClassName] = useState('navbar-nav')
  
  const navbarRef = useRef()

  const windowPathname = window.location.pathname

  /**
   * Skip the long fade-in animation if on a non index route.
   * 
   * @param {String} pathName The pathname.
   */
  const handleWindowPathname = (pathName) => {

    if(pathName != null && pathName.length > 1) {
      // setTimeout(() => {
      setNavbarClassName(NAVBAR_FAST_CLASS_NAME)
      // },100)
    }

    // if(pathNameSplit.length < 1 || windowPathAlbumFound != null) {
    //   return null
    // }

    // else {
    //   if(pathNameSplit[1] != null && pathNameSplit[1] != "") {
    //     let [requestedAlbumId, requestedSongId] = pathNameSplit[1].split('/')
    //   }
    // }
  }
  
  useEffect(() => {
    handleWindowPathname(windowPathname)
  }, [])

  /**
   * Toggle the mobile navigation options.
   * 
   * @param {Object} mouseEvent Mouse event.
   */
  const toggleMobileNav = (mouseEvent) => {

    let newClassName = navRightClassName.indexOf('navbar-opened') == -1 
                        ? 'navbar-opened navbar-nav'
                        : 'navbar-nav'

    setNavRightClassName(newClassName)

  }

  /**
   * Reset the navigation to the default class name.
   * 
   * @param {Object} mouseEvent MouseEvent
   */
  const closeMobileNav = (mouseEvent) => {

    let newClassName = 'navbar-nav'

    setNavRightClassName(newClassName)

  }


  // At another time
  // <li><Link to="/timeline"><img className='navbar-icon' src={imgTimelineNav} alt='' /> <span className='blue'>T</span>imeline</Link></li>

  /**
   * Close the mobile dropdown when clicking outside of it.
   * 
   * @param {Object} ref React reference to a DOM element.
   */
  const useClickOutsideOfDescToClose = (ref) => {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) { 
        if(navRightClassName.indexOf('navbar-opened') == -1) {
          return
        }

        // TODO: validate the quereyselector line
        if (ref.current && !ref.current.contains(event.target)) {

            closeMobileNav()

        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
      // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [ref, navRightClassName]);
  }

  useClickOutsideOfDescToClose(navbarRef)

  return(
    <div className='navbar-wrapper'>
      <nav className={navbarClassName} ref={navbarRef}>

        <div className='navbar-brand'>
          <Link to="/" onClick={(mouseEvent) => (closeMobileNav())}><img className='navbar-icon' src={imgBrand} alt=''/> Ryan Isler</Link>
        </div>

        <div className='navbar-mobile-dropdown' onClick={(mouseEvent) => (toggleMobileNav(mouseEvent))}>
          <span className='navbar-line' />
          <span className='navbar-line' />
          <span className='navbar-line' />
        </div>

        <div className={navRightClassName}>
          <ul className='navbar-links navbar-right'>
            <li><Link to="/games" onClick={(mouseEvent) => (closeMobileNav())}><img className='navbar-icon' src={imgGamesNav} alt='' /> <span className='blue'>G</span>ames</Link></li>
            <li><Link to="/art" onClick={(mouseEvent) => (closeMobileNav())}><img className='navbar-icon' src={imgArtNav} alt='' /> <span className='blue'>A</span>rt</Link></li>
            <li><Link to="/music" onClick={(mouseEvent) => (closeMobileNav())}><img className='navbar-icon' src={imgMusicNav} alt='' /> <span className='blue'>M</span>usic</Link></li>
            <li><a href="http://www.ryanisler.com/blog" onClick={(mouseEvent) => (closeMobileNav())} target="_blank"><img className='navbar-icon' src={imgBlogNav} alt='' /> <span className='blue'>B</span>log</a></li>
            <li><Link to="/about" onClick={(mouseEvent) => (closeMobileNav())}><img className='navbar-icon' src={imgAboutNav} alt='' /> <span className='blue'>A</span>bout</Link></li>
          </ul>
        </div>

      </nav>
    </div>
  )
}
/*

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Link</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>

*/
/* Toggle ability
<div className="navbar-header">
<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
  <span className="sr-only">Toggle navigation</span>
  <span className="icon-bar"></span>
  <span className="icon-bar"></span>
  <span className="icon-bar"></span>
</button>
</div>
*/
export default Nav;