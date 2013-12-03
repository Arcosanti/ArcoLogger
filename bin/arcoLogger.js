#!/opt/bin/node

var fs = require('fs'),
  path = require('path'),
    LogFilter = require('../lib/LogFilter');

var config = {
  logFile: '/home/pi/proj/log/tempLog.log'
};

function main(c) {
  var express = require('express');

  var app = express();
  
  app.set('views', path.resolve(__dirname, '..') + '/views');
  app.set('view engine', 'ejs');
  
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(app.router);
  app.use(express.static('public'));

  app.get('/log', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');

    var fileStream = fs.createReadStream(c.logFile);
        fileStream.pipe(res);

  });

  app.get('/sensor/:name/view', function(req, res) {
    res.render('graph.ejs', {sensor: req.params.name}); 
  });

  app.get('/sensor/:name', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    sensorDetail({
      res: res,
      sourceFile: c.logFile
    });
  });

  app.get('/sensor', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send([{id: 'all', name: 'all'}, {id: '4', name: 'temperature/humidity'}]);
  });

  app.listen(3000);

  console.log('Server running at http://127.0.0.1:3000/');
}
main(config);

function sensorDetail(c) {

  var fileStream = fs.createReadStream(c.sourceFile);
  var filter = new LogFilter(c);

  c.res.write('[');
  fileStream
    .pipe(filter, {end: false})
    .pipe(c.res, {end: false});
  fileStream
    .on('end',function() {
      c.res.write('{}]'); 
      c.res.end();
      console.log("Completed sensor response");
    });

/*
  filter.pipe(c.res);
  fileStream.pipe(filter);
  
  filter.end();
*/

}

