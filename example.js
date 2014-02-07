var fs = require('fs')
  , ColorGraph = require('./index.js')
  , Canvas = require('canvas')
  , Image = Canvas.Image;

var imgRaw = fs.readFileSync('./dark.jpg'),
  img = new Image;
  img.src = imgRaw;

var canvas = new Canvas(img.width, img.height),
  ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

var c = ColorGraph({trim: 0, mode: 'hsl'});
var d = ColorGraph({trim: 0, mode: 'rgb'});

//c.getGraph(canvas, function(colorGraph){
//  console.log(colorGraph);
//});

//var hslPoints = c.getPoints(canvas);
//console.log(hslPoints);

c.getDominantColors(canvas, function(results){
  console.log('HSL:');
  results.forEach(function(item){
    console.log('rgb('+item[0]+','+item[1]+','+item[2]+')');
  });
});

d.getDominantColors(canvas, function(results){
  console.log('RGB:');
  results.forEach(function(item){
    console.log('rgb('+item[0]+','+item[1]+','+item[2]+')');
  });
});