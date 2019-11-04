/**
 * This is the main js file which gets attached to our main HTML document.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'
import "react-jinke-music-player/assets/index.css";
import './css/App.scss';

// Render our application the the React DOM
ReactDOM.render(<App />, document.getElementById('root'));