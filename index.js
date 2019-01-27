
require('dotenv').load();
const http = require('http');
const express = require('express');
const webcam = require('node-webcam');


const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const apikey = process.env.APIKEY;
const apiurl = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?";

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
var body = 0;

function intervalFunc() {
	var time = new Date();
	maincam.capture("temp_picture", function(err, data){
			body = "<img src='" + data + "'><p>" + time + "</p>";
		});
	console.log('Just snapped your photo!');
}

const server = http.createServer((req, res) => {
	  res.statusCode = 200;
	  res.setHeader('Content-Type', 'text/html');
	  res.end(body);
});

intervalFunc();

server.listen(port, hostname, () => {
	  console.log(`Server running at http://${hostname}:${port}/`);
});

setInterval(intervalFunc, 10000);
