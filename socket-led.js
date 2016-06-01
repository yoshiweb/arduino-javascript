var app = require('http').createServer(handler);
var io = require('socket.io')(app);
// var fs = require('fs');
var five = require("johnny-five");


var board = new five.Board();
var led;


// httpサーバー起動
app.listen(3000);



/**
 * ボードの接続待機
 */
board.on("ready", function() {
  
  // 13ピンのLEDに接続
  led = new five.Led(13);

});


/**
 * HTTPリクエストには文字列を返す
 */
function handler (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}

// ソケット接続
io.on('connection', function (socket) {
  var id = socket.id;

  console.log("新規接続", id );


  // 接続してきたユーザーにメッセージを送信
  socket.emit('success', { id: id });

  // すでに接続してる人に配信
  socket.broadcast.emit('connected', { id: id });


  // 接続してきたユーザーからのメッセージを待機
  socket.on('message', function (data) {

    // 接続してきたユーザーから送られてきたデータ
    console.log('message', data);


    if( data.led ){

      switch( data.led ){
        case "off":
          _ledOff();
          break;
        case "on":
          _ledOn();
          break;
      }
    }

    // 送ってきた人以外に配信
    socket.broadcast.emit('broadcast', data);

  });


  // 接続解除を検知
  socket.on('disconnect', function (data) {

      console.log("接続解除", id, data);

    // 他の人が接続解除したことを配信
    socket.broadcast.emit('disconnected', { id: id });
  });

});



/**
 * LEDをONにする
 */
function _ledOn(){
  console.log("ledをONにする");

  led.on();
}

/**
 * LEDをOFFにする
 */
function _ledOff(){
  console.log("ledをOFFにする");
  
  led.off();
}


