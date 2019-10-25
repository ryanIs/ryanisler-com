import React from 'react'

function FeaturedItem(props) {
  // {
  //   "type": "Game",
  //   "title": "Stone King IV",
  //   "released": false,
  //   "releaseDate": "1/3/2020",
  //   "genre": "Role-playing game",
  //   "platform": "Desktop, Web, Flash",
  //   "description": "Coming Janurary 2020.",
  //   "featuredIcon": "../img/featured/sk4.jpg",
  //   "icon": "../img/stone-king-iii-icon.png",
  //   "site": "../games/stone-king-iii/"
  // },
  return(
    <div className='featured-item-wrapper'>
      <div className="feature-wrapper">
        <div className="vertical-align feature-inner">

          <div className="feature">

            <div className="feature-banner col-sm-12">
              <img className="banner-image" src={props.data.featuredImage} alt={props.data.title + ' featured image'} />
            </div>

            <div className="feature-body">
              <h1 className="feature-title">{props.data.title}</h1>
              <h2 className="feature-description">{props.data.description}</h2>
              {
                (props.data.site != null) ?
                <button type="button" className="btn btn-default btn-primary col-xs-2">PLAY NOW</button> : null
              }
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default FeaturedItem