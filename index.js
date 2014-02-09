var Canvas = require('canvas')
  , kmeans = require('node-kmeans');

"use strict";

module.exports = ColorGraph;

function ColorGraph(options){
  if (!(this instanceof ColorGraph)) return new ColorGraph(options);

  options = options || {trim: 0};

  this.getGraph = function(canvas, callback){
    var data = {},
      imageData,
      ctx = canvas.getContext('2d');

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < canvas.height; ++y) {
      for (var x = 0; x < canvas.width; ++x) {
        var i = (y * canvas.width + x) * 4,
          s = imageData.data[i]+','+imageData.data[++i]+','+imageData.data[++i];

        if(data[s] === undefined){
          data[s] = 1;
        } else {
          data[s]++;
        }

        if(x == canvas.width-1 && y == canvas.height-1){
          this.organise(data, callback);
        }
      }
    }
  };

  //@todo: implement feature to detect foreground/background based on number of points in a cluster being closest to middle of canvas
  //@todo: this should really be something more like getColorGroups
  this.getDominantColors = function(canvas, callback) {
    var points = this.getPoints(canvas),
      results = [];

    kmeans.clusterize(points, {k: 5}, function(err,clusters) {
      if (err) { return console.error(err); }

      clusters.forEach(function(cluster){
        var p = [];

        p[0] = parseInt(cluster.centroid[0],10);
        p[1] = parseInt(cluster.centroid[1],10);
        p[2] = parseInt(cluster.centroid[2],10);

        results.push(p);
      });

      callback(results);

    });

  }

  //@todo: impliment cords feature to include the co-ordinates of each point in the returned array
  this.getPoints = function(canvas){
    var points = [],
      ctx = canvas.getContext('2d'),
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < canvas.height; ++y) {
      for (var x = 0; x < canvas.width; ++x) {
        var i = (y * canvas.width + x) * 4;

        points.push([imgData.data[i],imgData.data[++i],imgData.data[++i]]);

        if(x == canvas.width-1 && y == canvas.height-1){
          return points;
        }
      }
    }
  }

  //@todo: rename function
  this.organise = function(rawHisto, callback){
    var list = [];
    for(var propt in rawHisto){
      var o = {},
        tmp;

      o.occurances = rawHisto[propt];
      tmp = propt.split(',');
      o.r = tmp[0];
      o.g = tmp[1];
      o.b = tmp[2];

      if(o.occurances >= options.trim){
        list.push(o);
      }
    }
    callback(list);
  };

}