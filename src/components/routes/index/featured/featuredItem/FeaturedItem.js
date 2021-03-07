/**
 * FeaturedItem.js
 * 
 * This is a featured item used by the Featured.js component.
 */

import React from 'react'

/**
 * Main featured item function.
 * 
 * @param {Object} props Propertes passed down from parent.
 * @returns {JSX} Render JSX.
 */
function FeaturedItem(props) {
  
  /**
   * Navigate the browser to a URL.
   * 
   * @param {String} site URL to send the user to.
   */
  const navigateToSite = (site) => {
    window.location = site
  }

  return(
    <div className='featured-item-wrapper'>
      <div className="feature-wrapper">
        <div className="vertical-align feature-inner">

          <div className="feature">

          
            {
              (props.data.featuredImage != null && props.data.featuredImage.length > 0) 
              ?
              <div className="feature-banner col-sm-12">
                <img className="banner-image" src={props.data.featuredImage} alt={props.data.title + ' featured image'} />
              </div>
              : null
            }

            {
              (props.data.featuredYouTubeId != null && props.data.featuredYouTubeId.length > 0) 
              ?
              <div className="feature-youtube featured-media">
                <iframe  
                className=" col-sm-12"
                src={`https://www.youtube.com/embed/${props.data.featuredYouTubeId}`} 
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen></iframe>
              </div>
            : null
          }

            {
              (props.data.featuredAudioFile != null && props.data.featuredAudioFile.length > 0) 
              ?
              <div className="feature-audio featured-media">
              <audio controls className="featured-audio-audio col-sm-12">
              <source src={props.data.featuredAudioFile} />
            </audio> 

              </div>

            : null
          }

            <div className="feature-body">
              <h1 className="feature-title">{props.data.title}</h1>
              <h2 className="feature-description">{props.data.description}</h2>
              {
                (props.data.site != null && props.data.site.length > 0) ?
                <button 
                type="button" 
                className="btn btn-default btn-primary col-xs-2"
                onClick={(e) => { navigateToSite(props.data.site) }}>
                PLAY NOW</button> : null
              }
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default FeaturedItem