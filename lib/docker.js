var Request=require('request'),
    Async=require('async'),
    Converter = require('byte-converter').converterBase2;

var API="http://unix:///var/run/docker.sock:";

var sizeSaved=0;
var imageCleaned=0;
var containerCleaned=0;

function details(callback){
  Request.get(API+'/info',function (error, response, body){
    var info=body;
    Request.get(API+'/version',function (error, response, body){
      var version=body;
      Request.get(API+'/images/json',function (error, response, body){
        var data={
          info:JSON.parse(info),
          version:JSON.parse(version),
          images:JSON.parse(body).length
        }
        callback(data);
      });
    });
  });
}

function cleanContainers(callback){
  Request.get(API+'/containers/json?all=1',function (error, response, body){
    var containers=JSON.parse(body);
    containers.forEach(function(container){
      Request.del(API+'/containers/'+container.Id,function(err,response,body){
        if(response.statusCode==204){
          containerCleaned++;
        }
      });
    });
    callback();
  });
}

function cleanImages(callback){
  Request.get(API+'/images/json?all=1',function (error, response, body){
    var images=JSON.parse(body);
    Async.map(images, function(image, done) {
      var size=Math.round(Converter(image.Size, 'B', 'MB') * 100) / 100;
      var id=image.Id.replace('sha256:','');
      Request.del(API+'/images/'+id, function(error, response, body) {
        if(response.statusCode==200){
          sizeSaved+=size;
          imageCleaned++;
        }
        done(error, body);
      });
    }, function(err, results) {
      callback({
        size:sizeSaved,
        images:imageCleaned,
        containers:containerCleaned
      });
    });
  });
}

module.exports={
  cleanContainers:cleanContainers,
  cleanImages:cleanImages,
  details:details
}
