/**
 * Featured.js
 * 
 * This component is a featured item displayed on the Index page.
 */

import React, { useState } from 'react'
import FeaturedItem from './featuredItem/FeaturedItem'

/**
 * Main featured function.
 * 
 * @param {Object} props Properties passed from Index.js
 * @returns {JSX} Render JSX.
 */
function Featured(props) {

  const [featured, setFeatured] = useState()

  const MAX_FEATURED_ITEMS_DISPLAYED = 15

  /**
   * Display the featured data from the featured.json file.
   * 
   * @param {Object} data Featured JSON data.
   */
  const displayFeaturedData = (data) => {
    if(featured == null) {

      setFeatured(data)

      if(featured != null && featured['featured'].length > MAX_FEATURED_ITEMS_DISPLAYED) {

        setFeatured(featured['featured'].slice(0, MAX_FEATURED_ITEMS_DISPLAYED))

      }

    }
  }

  props.dataLoader.getData(props.dataLoader.FEATURED_JSON, displayFeaturedData)

  return(
    <div className='featured-wrapper'>
      <div className='featured-items'>

        <div className='featured-items-header'>
          <h1>Featured</h1>
        </div>

        <div className='container featured-container '>

          {
            (featured != null && featured['featured'] != null) ? 
            featured['featured'].map((item, itemIndex) => <FeaturedItem data={item} key={`fi_${itemIndex}`} />) : null
          }

        </div>      
      </div>      
    </div>
  )
}

export default Featured