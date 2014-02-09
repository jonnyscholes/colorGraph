#Color Graph

Color Graph is a node module that takes an HTML canvas and performs various collection/statistical tasks on it.
This can be used to create color palates, or to help create generative artworks from image data.

I will include a browser version soon.

#Example

```javascript
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

//Get all colors in a canvas - one color for each pixel
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
```

If you have any issues or requests please make an issue and I'll do my best to include it.
