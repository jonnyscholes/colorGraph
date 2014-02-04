var fs = require('fs')
  , Color = require('./index.js')
  , Canvas = require('canvas')
  , Image = Canvas.Image;

var imgRaw = fs.readFileSync('./lisa.jpg'),
  img = new Image;
  img.src = imgRaw;

var canvas = new Canvas(img.width, img.height),
  ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

Color.getGraph(canvas, 10, function(colorGraph){
  console.log(colorGraph);
});