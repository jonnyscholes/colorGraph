var fs = require('fs')
  , Canvas = require('canvas')
  , converter = require('color-convert')();

"use strict";

module.exports = ColorGraph;

function ColorGraph(options){
  if (!(this instanceof ColorGraph)) return new ColorGraph(options);

  options = options || {trim: 0, mode: 'rgb'};

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
  this.getDominantColors = function(canvas, callback) {
    var points = this.getPoints(canvas),
      clusters = this.kmeans(points, 5, 1),
      results = [];

    for (var i = 0; i < clusters.length; i++) {
      var p = [];

      if(options.mode === 'hsl') {
        p = converter.hsl(clusters[i][0][0],clusters[i][0][1],clusters[i][0][2]).rgb();

      } else {
        p[0] = parseInt(clusters[i][0][0],10);
        p[1] = parseInt(clusters[i][0][1],10);
        p[2] = parseInt(clusters[i][0][2],10);
      }

      results.push(p);
    }

    callback(results);
  }

  this.getPoints = function(canvas){
    var points = [],
      ctx = canvas.getContext('2d'),
      imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < canvas.height; ++y) {
      for (var x = 0; x < canvas.width; ++x) {
        var i = (y * canvas.width + x) * 4,
          d = [];

        if(options.mode === 'hsl') {
          d = converter.rgb(imgData.data[i],imgData.data[++i],imgData.data[++i]).hsl();
        } else {
          d = [imgData.data[i],imgData.data[++i],imgData.data[++i]];
        }

        points.push(d);

        if(x == canvas.width-1 && y == canvas.height-1){
          return points;
        }
      }
    }
  }

  //@todo: rename function
  //@todo: integrate getPoints and integrate hsl option
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

  //This kmeans implementation comes from charlesleifer.com with some small modifications.
  this.kmeans = function(points, k, min_diff) {
    var clusters = [],
      seen = [],
      self = this;
    while (clusters.length < k) {
      var idx = parseInt(Math.random() * points.length),
      found = false;

      for (var i = 0; i < seen.length; i++ ) {
        if (idx === seen[i]) {
          found = true;
          break;
        }
      }
      if (!found) {
        seen.push(idx);
        clusters.push([points[idx], [points[idx]]]);
      }
    }

    while (true) {
      var plists = [];
      for (var i = 0; i < k; i++) {
        plists.push([]);
      }

      for (var j = 0; j < points.length; j++) {
        var p = points[j]
          , smallest_distance = 10000000
          , idx = 0;

        for (var i = 0; i < k; i++) {
          var distance = self.euclidean(p, clusters[i][0]);
          if (distance < smallest_distance) {
            smallest_distance = distance;
            idx = i;
          }
        }
        plists[idx].push(p);
      }

      var diff = 0;
      for (var i = 0; i < k; i++) {
        var old = clusters[i]
          , center = self.calculateCenter(plists[i], 3)
          , new_cluster = [center, (plists[i])]
          , dist = self.euclidean(old[0], center);
        clusters[i] = new_cluster
        diff = diff > dist ? diff : dist;
      }
      if (diff < min_diff) {
        break;
      }
    }
    return clusters;
  };

  this.euclidean = function(p1, p2) {
    var s = 0;
    for (var i = 0, l = p1.length; i < l; i++) {
      s += Math.pow(p1[i] - p2[i], 2)
    }
    return Math.sqrt(s);
  };

  this.calculateCenter = function(points, n) {
    var vals = [],
      plen = 0;

    for (var i = 0; i < n; i++) { vals.push(0); }
    for (var i = 0, l = points.length; i < l; i++) {
      plen++;
      for (var j = 0; j < n; j++) {
        vals[j] += points[i][j];
      }
    }
    for (var i = 0; i < n; i++) {
      vals[i] = vals[i] / plen;
    }
    return vals;
  };
}