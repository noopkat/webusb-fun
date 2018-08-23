process.hrtime = require('browser-process-hrtime');
const webusbSerialPort = require('webusb-serial').SerialPort;
const firmata = require('firmata');
const five = require('johnny-five');
const Oled  = require('oled-js');
const font = require('oled-font-5x7');

const connectButton = document.querySelector('#connectWebUSB');
const disconnectButton = document.querySelector('#disconnectWebUSB');
const sendButton = document.querySelector('#sendWebUSB');

let port, board, io;

function onConnect() {
  setUpWebUSB()
    .then(setUpJohnnyFive)
    .then(() => {
      sendButton.style.display = 'inline';
      disconnectButton.style.display = 'inline';
      connectButton.style.display = 'none';
    })
    .catch(console.error);
}

function onDisconnect() {
  board.io.reset();
  port.close();
  connectButton.style.display = 'inline';
 // disconnectButton.style.display = 'none';
//  sendButton.style.display = 'none';
  io = null;
  board = null;
  port = null;
}

function setUpJohnnyFive() {
  console.log('setting up j5');
  return new Promise((resolve, reject) => {
    const ioOptions = {
      reportVersionTimeout: 1, 
      samplingInterval: 300, 
      skipCapabilities: true
    };

    io = new firmata.Board(port, ioOptions);

    const j5Options = {
      io: io, 
      repl: false, 
      timeout: 30000
    };

    board = new five.Board(j5Options);

    board.on('ready', () => {
      onBoardReady(board);
      resolve();
    }); 
  });
}

function onBoardReady(board) {
  console.log('board ready');
  //var led = new five.Led(13);
  //led.blink(500);

  const oledOptions = {
    width: 128,
    height: 32,
    address: 0x3C,
    resetPin: 12 
  };

  const screen = new Oled(board, five, oledOptions);
  screen.clearDisplay();
  screen.update();

  // oled.setCursor(1, 1);
  // oled.writeString(font, 1, 'Hello webUSB', 1, true, 2);

  sendButton.addEventListener('click', () => {
    encodeBitmap();
    screen.buffer = oledbytearray;
    screen.update();  
  });
}

function setUpWebUSB() {
  return new Promise((resolve, reject) => {
    port = new webusbSerialPort({
      filters: [
        { 'vendorId': 0x239a, 'productId': 0x800c }
      ]
    });

    port.init()
      .then(() => resolve(port))
      .catch((error) => reject(error));
   
    
    port.on('open', () => console.log('device opened'));
    port.on('emit', console.log);
    port.on('error', console.log);
    port.on('data', console.log);
  
  });
}

connectButton.addEventListener('click', onConnect); 
disconnectButton.addEventListener('click', onDisconnect);

sendButton.style.display = 'none';
disconnectButton.style.display = 'none';
