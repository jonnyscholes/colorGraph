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


var points = d.getPoints(canvas);
console.log(points);

d.getGraph(canvas, function(colorGraph){
  console.log(colorGraph);
});

d.getDominantColors(canvas, function(results){
  console.log('RGB:');
  console.log(results);
});