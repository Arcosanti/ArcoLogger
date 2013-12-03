var stream = require('stream'),
    util = require('util'),
    Transform = stream.Transform;

function LogFilter(filter,c) {
  if (!(this instanceof LogFilter)) {
    return new LogFilter(filter,c);
  }
  if (!c) c = {};
  c.objectMode = true;

  Transform.call(this,c);

  this.filter = filter;
}
util.inherits(LogFilter, Transform);

LogFilter.prototype._transform = function (obj, enc, cb) {

  var self = this;
  var lines = String(obj).split("\n");
  lines.forEach(function (line) {
    if (line.trim().length) {
      self.push(line + ",\n", enc);
    }
  });

  cb();
}

module.exports = LogFilter;
