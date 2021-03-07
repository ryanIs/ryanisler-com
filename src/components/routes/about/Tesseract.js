/**
 * Tesseract.js
 *
 * Renders the tesseract in the canvas element.
 *
 * I have made edits to this code to make it more user interactive.
 *
 * @todo
 *  [ ] Must register touch-events on mobile devices (iPhone 6 not working) to change myX and myY.
 * 
 * @author
 *  Created by Dale
 *  https:// codepen.io/Interseptive
 */

// Canvas
// const canvas = document.getElementById('c1');
// const c = canvas.getContext('2d');
let canvas
let c

// Pixel Dimensions
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// c.translate(canvas.width/2, canvas.height/2);
let rx = 0
let ry = 0
let rz = 0
let rw = 0

// Camera Data
const Camera = {

  // Focal Length
  focalLength: 35,
  wFocalLength: 12,

  // Pinhole Location
  x: 0,
  y: 0,
  z: 0,
  w: 0,

  // Camera Rotation
  rotX: 0,
  rotY: 0,
  rotZ: 0,
}

Camera.z = -(Camera.focalLength ** 2)
Camera.w = -(Camera.wFocalLength ** 2)

// Vertex Object
class Vertex {

  constructor(x, y, z, w) {
    this.loc = [
      x / Camera.focalLength,
      y / Camera.focalLength,
      z / Camera.focalLength,
      w / Camera.focalLength,
    ]
    this.ploc = []
  }

  // 3D Rotation Transformation
  rotate(xr, yr, zr, wr) {

    // 4D Rotation on YW Axis
    let yy = this.loc[1]
    this.loc[1] = yy * Math.cos(wr) - this.loc[3] * Math.sin(wr)
    this.loc[3] = yy * Math.sin(wr) + this.loc[3] * Math.cos(wr)

    // Constants
    let x = this.loc[0]
    let y = this.loc[1]
    let z = this.loc[2]

    // Rotation Data
    let sx = Math.sin(xr)
    let sy = Math.sin(yr)
    let sz = Math.sin(zr)
    let cx = Math.cos(xr)
    let cy = Math.cos(yr)
    let cz = Math.cos(zr)

    // Repeating Parts of Equation
    let eq1 = sz * y + cz * x
    let eq2 = cz * y - sz * x
    let eq3 = cy * z + sy * eq1

    // Applying Transformations
    this.loc[0] = cy * eq1 - sy * z
    this.loc[1] = sx * eq3 + cx * eq2
    this.loc[2] = cx * eq3 - sx * eq2
  }

  // Projected 2D Coordinates
  project() {

    // Projects 4D to 3D
    this.loc[3] -= Camera.w / Camera.wFocalLength
    this.loc[0] = (-this.loc[0] / this.loc[3]) * Camera.wFocalLength
    this.loc[1] = (-this.loc[1] / this.loc[3]) * Camera.wFocalLength
    this.loc[2] = (-this.loc[2] / this.loc[3]) * Camera.wFocalLength

    // Camera Location
    let x = this.loc[0] - Camera.x / Camera.focalLength
    let y = this.loc[1] - Camera.y / Camera.focalLength
    let z = this.loc[2] - Camera.z / Camera.focalLength

    // Camera Rotation
    let sx = Math.sin(Camera.rotX)
    let sy = Math.sin(Camera.rotY)
    let sz = Math.sin(Camera.rotZ)
    let cx = Math.cos(Camera.rotX)
    let cy = Math.cos(Camera.rotY)
    let cz = Math.cos(Camera.rotZ)

    // Repeating Parts of Equation
    let eq1 = sz * y + cz * x
    let eq2 = cz * y - sz * x
    let eq3 = cy * z + sy * eq1

    // Camera Transformations
    let dx = cy * eq1 - sy * z
    let dy = sx * eq3 + cx * eq2
    let dz = cx * eq3 - sx * eq2

    // Projection
    this.ploc = [
      (Camera.focalLength / dz) * dx * Camera.focalLength,
      (Camera.focalLength / dz) * dy * Camera.focalLength,
    ]

  }
}

// Face Object
class Face {

  constructor(v1, v2, v3, v4, noCull) {
    this.vertices = [v1, v2, v3, v4]
    if (noCull == true) this.noCull = noCull
  }
  
  show(faceId) {

    // Drawing Face
    if (colorfulAppearanceEnabled) {
      c.lineWidth = myLineWidths[faceId]
      c.strokeStyle = myStrokeStyles[faceId]
      c.fillStyle = myFillStyles[faceId]
    }

    c.beginPath()
    c.moveTo(this.vertices[0].ploc[0], this.vertices[0].ploc[1])

    for (let i = 1; i < this.vertices.length; i++)
      c.lineTo(this.vertices[i].ploc[0], this.vertices[i].ploc[1])

    c.closePath()
    c.stroke()

    if (colorfulAppearanceEnabled) {
      c.fill()
    }

  }
}

var tesseractOpened = false
var autoUpdateAppearance = false
var colorfulAppearanceEnabled = false

var r = function (_) {
  return Math.floor(Math.random() * _)
}

var rr = () => "rgb(" + r(256) + "," + r(256) + "," + r(256) + ")"
var rra = () => "rgba(" + r(256) + "," + r(256) + "," + r(256) + `,0.${r(100)})`
var m_rr = (_ = r(256)) => "rgb(" + _ + "," + _ + "," + _ + ")"
var m_rra = (_ = r(256)) => "rgba(" + _ + "," + _ + "," + _ + `,0.${r(100)})`
var m_rh = (_ = r(358), __ = r(100), ___ = r(100)) =>
  "hsl(" + _ + "," + __ + "%," + ___ + "%)"
var m_rha = (_ = r(358), __ = r(100), ___ = r(100)) =>
  "hsla(" + _ + "," + __ + "%," + ___ + `%,0.${r(100)})`

var myStrokeStyles = [
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
  rr(),
]

var myLineWidths = [
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
  r(5) + 15,
]

var myFillStyles = [
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
  rra(),
]

const z_rgb = "rgb(0,0,0)"
const z_rgba = [
  "rgba(256,256,256,0.0)",
  "rgba(126,126,126,0.0)",
  "rgba(0,0,0,0.0)",
]

function resetAppearance() {
  autoUpdateAppearance = false
  c.lineWidth = 1
  c.strokeStyle = "#000"
  c.fillStyle = "transparent"
  colorfulAppearanceEnabled = false
  myFillStyles = [
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
  ]
  myLineWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  myStrokeStyles = [
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
    "#000",
  ]
}

// Works on RGBA too
const getValuesArrFromRGBA = (rgb) =>
  rgb
    .substring(5, rgb.length - 1)
    .replace(/ /g, "")
    .split(",")

// Assumes rgba/rgb standard
function autoUpdateAppearanceHandler() {
  let lineWidthChange = 1
  let fillStyleChange = 3
  let fillStyleChangeA = 0.01
  let strokeStyleChange = 3
  let strokeStyleChangeA = 0.01

  myLineWidths = myLineWidths.map((v, i) => {
    let newValue = v + (-lineWidthChange + r(lineWidthChange * 2 + 1))
    if (newValue < 0) newValue = 0
    if (newValue > 150) newValue = 150
    return newValue
  })

  let newArray = myFillStyles.map((v, i) => {
    let values = getValuesArrFromRGBA(v)
    let out = []

    for (let ii = 0; ii < values.length; ii++) {
      let i = values[ii]
      let j = parseInt(i)

      if (ii == 3) {
        j = parseFloat(i)
      }

      let newValue = j + (-fillStyleChange + r(fillStyleChange * 2 + 1))
      if (newValue < 0) newValue = 0
      if (newValue > 256) newValue = 256

      // alpha channel
      if (ii == 3) {
        newValue = j + (-fillStyleChangeA + r(fillStyleChangeA * 2 + 1))
        if (newValue < 0) newValue = 0
        if (newValue > 1) newValue = 1
      }

      out.push(newValue)
    }
    // if(out.length == 4)
    return `rgba(${out[0]},${out[1]},${out[2]},${out[3]})`

    // return `rgb(${out[0]},${out[1]},${out[2]})`
  })
  // if(r(2) == 0) {
  myFillStyles = newArray
  // console.log(myFillStyles)
  // }

  myStrokeStyles = myStrokeStyles.map((v, i) => {
    let values = getValuesArrFromRGBA(v)
    let out = []

    for (let ii = 0; ii < values.length; ii++) {
      let i = values[ii]
      let j = parseInt(i)

      if (ii == 3) {
        j = parseFloat(i)
      }

      let newValue = j + (-strokeStyleChange + r(strokeStyleChange * 2 + 1))
      if (newValue < 0) newValue = 0
      if (newValue > 256) newValue = 256

      // alpha channel
      if (ii == 3) {
        newValue = j + (-strokeStyleChangeA + r(strokeStyleChangeA * 2 + 1))
        if (newValue < 0) newValue = 0
        if (newValue > 1) newValue = 1
      }

      out.push(newValue)
    }

    if (out.length == 4) return `rgba(${out[0]},${out[1]},${out[2]},${out[3]})`

    return `rgb(${out[0]},${out[1]},${out[2]})`
  })
}

function randomizeAppearance(e) {
  autoUpdateAppearance = false

  // if(!e.shiftKey && !e.ctrlKey && !e.altKey) {
  myFillStyles = [
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
  ]
  myLineWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  // myStrokeStyles = ['#000','#000','#000','#000','#000','#000','#000','#000','#000','#000','#000','#000',]
  // }

  if (e.shiftKey) {
    myFillStyles = [
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
      rra(),
    ]
  }

  if (e.ctrlKey) {
    myLineWidths = [
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
      r(5) + 15,
    ]
  }

  myStrokeStyles = [
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
    rr(),
  ]

  if (e.shiftKey && e.altKey) {
    myStrokeStyles = [
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
      "transparent",
    ]
    myLineWidths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  } else if (e.altKey) {
    let u = r(358) //, v=r(358)
    myFillStyles = [
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
      m_rha(u, 100),
    ]
    if (e.ctrlKey) {
      myLineWidths = [
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
        r(5) + 15,
      ]
      myStrokeStyles = [
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
        m_rha(u, 100),
      ]
    }
  }

  if (e.shiftKey && e.altKey && e.ctrlKey) {
    // todo: reset this to 0 or try the commented
    let u = r(358)
    let ch_rgba = z_rgba[r(3)]
    // myStrokeStyles = [rra(),rra(),rra(),rra(),rra(),rra(),rra(),rra(),rra(),rra(),rra(),rra(),]
    // myLineWidths = [r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,r(116)+15,]
    myStrokeStyles = [
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
    ]
    myFillStyles = [
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
      ch_rgba,
    ]
    myLineWidths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    autoUpdateAppearance = !autoUpdateAppearance
  }

  if (colorfulAppearanceEnabled == false && tesseractOpened) {
    colorfulAppearanceEnabled = true
  }
}

var myAnimationFrameId
var myX = 0
var myY = 0
var WDefaultRotationSpeed = 0.005
var shiftDown = false
var pauseAnimation = false

function draw() {

  myAnimationFrameId = requestAnimationFrame(draw)

  c.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  )

  // ry = (ry-0.012)%(Math.PI*2);
  if (pauseAnimation == false) {
    if (!shiftDown) {
      rw = (rw - WDefaultRotationSpeed) % (Math.PI * 2)
      ry = (ry + myX) % (Math.PI * 2)
      // rz = (rz + myY) % (Math.PI * 2);
      rx = (rx - myY) % (Math.PI * 2)
    } else {
      rw = (rw + myX) % (Math.PI * 2)
      // rx = (rx - myY) % (Math.PI * 2);
      rz = (rz + myY) % (Math.PI * 2)
    }
  }

  let faces = []
  let w = 300

  // Vertices
  let v = []
  v[0] = new Vertex(-w / 2, w / 2, -w / 2, w / 2)
  v[1] = new Vertex(w / 2, w / 2, -w / 2, w / 2)
  v[2] = new Vertex(w / 2, w / 2, w / 2, w / 2)
  v[3] = new Vertex(-w / 2, w / 2, w / 2, w / 2)
  v[4] = new Vertex(-w / 2, -w / 2, -w / 2, w / 2)
  v[5] = new Vertex(w / 2, -w / 2, -w / 2, w / 2)
  v[6] = new Vertex(w / 2, -w / 2, w / 2, w / 2)
  v[7] = new Vertex(-w / 2, -w / 2, w / 2, w / 2)
  v[8] = new Vertex(-w / 2, w / 2, -w / 2, -w / 2)
  v[9] = new Vertex(w / 2, w / 2, -w / 2, -w / 2)
  v[10] = new Vertex(w / 2, w / 2, w / 2, -w / 2)
  v[11] = new Vertex(-w / 2, w / 2, w / 2, -w / 2)
  v[12] = new Vertex(-w / 2, -w / 2, -w / 2, -w / 2)
  v[13] = new Vertex(w / 2, -w / 2, -w / 2, -w / 2)
  v[14] = new Vertex(w / 2, -w / 2, w / 2, -w / 2)
  v[15] = new Vertex(-w / 2, -w / 2, w / 2, -w / 2)

  // Rotating and Projecting vertices

  for (let i = 0; i < v.length; i++) {
    // If Rotation is Needed
    if (Math.abs(rx) + Math.abs(ry) + Math.abs(rz) + Math.abs(rw) > 0)
      v[i].rotate(rx, ry, rz, rw)
    v[i].project()
  }

  // Faces
  faces.push(new Face(v[0], v[1], v[2], v[3]))
  faces.push(new Face(v[4], v[7], v[6], v[5]))
  faces.push(new Face(v[0], v[4], v[5], v[1]))
  faces.push(new Face(v[2], v[6], v[7], v[3]))
  faces.push(new Face(v[8], v[9], v[10], v[11]))
  faces.push(new Face(v[12], v[15], v[14], v[13]))
  faces.push(new Face(v[8], v[12], v[13], v[9]))
  faces.push(new Face(v[10], v[14], v[15], v[11]))
  faces.push(new Face(v[0], v[1], v[9], v[8]))
  faces.push(new Face(v[2], v[3], v[11], v[10]))
  faces.push(new Face(v[4], v[7], v[15], v[12]))
  faces.push(new Face(v[6], v[5], v[13], v[14]))
  for (let i = 0; i < faces.length; i++) faces[i].show(i)

}
// draw();

var slowRateFromMouseDistanceToCenter = 0.000009

function mouseMoveHandler(event) {
  // console.log(event)
  myX = (event.clientX - canvas.width / 2) * slowRateFromMouseDistanceToCenter
  myY = (event.clientY - canvas.height / 2) * slowRateFromMouseDistanceToCenter

  if (autoUpdateAppearance) {
    autoUpdateAppearanceHandler()
  }

  shiftDown = event.shiftKey
}

function initDraw(myCanvas, windowWidth, windowHeight) {
  canvas = myCanvas
  c = canvas.getContext("2d")

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  c.translate(canvas.width / 2, canvas.height / 2)

  draw()
  ry = (ry + 90) % (Math.PI * 2)


  window.addEventListener("mousemove", mouseMoveHandler)
  window.addEventListener("resize", windowResizeHandler)
  window.addEventListener("click", mouseUpHandler)
  window.addEventListener("mousedown", mouseDownHandler)
}

function mouseDownHandler(mouseEvent) {
  // Right-click button
  if (mouseEvent.button == 1) {
    pauseAnimation = !pauseAnimation
  }
}

function destructDraw() {
  window.removeEventListener("mousemove", mouseMoveHandler)
  window.removeEventListener("resize", windowResizeHandler)
  window.removeEventListener("click", mouseUpHandler)
  window.removeEventListener("mousedown", mouseDownHandler)
  cancelAnimationFrame(myAnimationFrameId)
}

function openTesseract(e) {
  setTimeout(() => (tesseractOpened = true), 200)
}

function closeTesseract(e) {
  resetAppearance()
  tesseractOpened = false
}

function windowResizeHandler() {
  setCanvasWidthAndHeight(window.innerWidth, window.innerHeight)
}

function mouseUpHandler(e) {
  randomizeAppearance(e)
}

function setCanvasWidthAndHeight(width, height) {
  // if(width< 1000) return false
  canvas.width = width
  canvas.height = height
  c.canvas.width = width
  c.canvas.height = height
  c.translate(canvas.width / 2, canvas.height / 2)
}

export default { initDraw, destructDraw, openTesseract, closeTesseract }