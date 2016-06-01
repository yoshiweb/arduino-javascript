var fs = require('fs');
var http = require('http');
var server = http.createServer();
var five = require("johnny-five");
var board = new five.Board();
var io = require('socket.io').listen(server);

var led;

// httpアクセスがあったら
server.on('request', function(req, res) {
  
  // HTMLを表示
  var stream = fs.createReadStream('index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  stream.pipe(res);

  // LEDを点滅させる
  led.blink(500);
  
});


// 1.ボードの準備ができたら
board.on("ready", function() {
  
  // 13ピンのLEDに接続
  led = new five.Led(13);

  // httpサーバーを起動
  server.listen(3000);
});