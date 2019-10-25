import React, { useState } from 'react'
import FeaturedItem from './featuredItem/FeaturedItem'

function Featured(props) {

  const [featured, setFeatured] = useState()

  const displayFeaturedData = (data) => {
    if(featured == null) {
      setFeatured(data)
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
            (featured != null) ? 
            featured.map((item, itemIndex) => <FeaturedItem data={item} key={`fi_${itemIndex}`} />) : null
          }

        </div>      
      </div>      
    </div>
  )
}

export default Featured