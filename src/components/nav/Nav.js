import React, { useState, useEffect } from 'react'

function Nav(props) {
  return(
    <div className='navbar'>
      <div className='navbar-brand'>
        Ryan Isler
      </div>
      <div className='right'>
        <a href='#'>Games</a>
        <a href='#'>Music</a>
        <a href='#'>Art</a>
        <a href='#'>Timeline</a>
        <a href='#'>About</a>
      </div>
    </div>
  )
}