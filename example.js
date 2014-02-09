var fs = require('fs')
  , ColorGraph = require('./index.js')
  , Canvas = require('canvas')
  , Image = Canvas.Image;

var imgRaw = fs.readFileSync('./lisa.jpg'),
  img = new Image;
  img.src = imgRaw;

var canvas = new Canvas(img.width, img.height),
  ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

var d = ColorGraph({trim: 0});

//Get all colors in an image - one color for each pixel
var points = d.getPoints(canvas);
console.log(points);

//Get a list of all colors in a canvas along with their occurrence count
d.getGraph(canvas, function(colorGraph){
  console.log(colorGraph);
});

//Get a list of 5 of the main colors in an image. Uses clustering to work out general color groups then averages them.
d.getDominantColors(canvas, function(results){
  console.log('RGB:');
  console.log(results);
});