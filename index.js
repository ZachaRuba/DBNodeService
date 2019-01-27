const http = require('http');
const webcam = require('node-webcam');

const hostname = '127.0.0.1';
const port = 3000;

var maincamconfig = {
	width:          1280,
	hight:          720,
	quality:        100,
	delay:          0,
	saveShots:      true,
	output:         "jpeg",
	device:         false,
	callbackReturn: "base64",
	verbose:        false
};

var maincam = webcam.create(maincamconfig);
var image;


const server = http.createServer((req, res) => {
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'text/html');
	  maincam.capture("temp_picture", function(err, data){
	      image = "<img src='" + data + "'>";
          });
	  res.end(image);
});

server.listen(port, hostname, () => {
	  console.log(`Server running at http://${hostname}:${port}/`);
});
