/**
 * @fileOverview Starts a NodeJS server. The server is used to collect the 
 * coverage information once all the tests have been run. The collected coverage
 * information is then used to generate reports to be sent to Coveralls.io.
 **/
var http = require('http');

var istanbul = require('istanbul'),
    collector = new istanbul.Collector(),
    reporter = new istanbul.Reporter(),
    sync = false;

http.createServer(function (req, res) {
  req.on("data", function(chunk) {
    var coverage = JSON.parse(chunk.toString());
    collector.add(coverage);
    reporter.add('text');
    reporter.addAll([ 'lcov', 'clover' ]);
    reporter.write(collector, sync, function () {
      console.log('All reports generated');
    });
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Coverage reported!\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
