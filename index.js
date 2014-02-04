function ColorGraph(opts){
  if (!(this instanceof ColorGraph)) return new ColorGraph(opts);
  if (!opts) opts = {};

  this.getGraph = function(canvas, trim, callback){
    var rawHisto = {},
      imageData,
      ctx = canvas.getContext('2d');

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < canvas.height; ++y) {
      for (var x = 0; x < canvas.width; ++x) {
        var i = (y * canvas.width + x) * 4,
          s = imageData.data[i]+','+imageData.data[++i]+','+imageData.data[++i];

        if(rawHisto[s] === undefined){
          rawHisto[s] = 1;
        } else {
          rawHisto[s]++;
        }

        if(x == canvas.width-1 && y == canvas.height-1){
          this.organise(rawHisto, trim, callback);
        }
      }
    }
  };

  this.organise = function(rawHisto, trim, callback){
    var list = [];
    for(var propt in rawHisto){
      var o = {},
        tmp;

      o.occurances = rawHisto[propt];
      tmp = propt.split(',');
      o.r = tmp[0];
      o.g = tmp[1];
      o.b = tmp[2];

      if(o.occurances >= trim){
        list.push(o);
      }
    }
    callback(list);
  };

}