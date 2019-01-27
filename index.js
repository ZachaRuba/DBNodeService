
require('dotenv').load();
const https = require('https');
const fs = require('fs');
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

//API Code Below
function postpic(postdata) {

	//Determine where Post is going
		var options = {
				hostname: "canadacentral.api.cognitive.microsoft.com",
				path: "/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion",
				method: "POST",
				followRedirect: true,
				headers:{
					"Content-Type": "application/json",
					"Ocp-Apim-Subscription-Key": apikey
				}
		};

		var req = https.request(options, (res) => {
		  console.log('statusCode:', res.statusCode);
		  console.log('headers:', res.headers);

		  res.on('data', (d) => {
		    process.stdout.write(d);
		  });
		});

		req.on('error', (e) => {
		  console.error(e);
		});

		//execute the request
		req.write(postdata);
		req.end();

}

function snap() {
	var time = new Date();
	maincam.capture("temp_picture", function(err, data){
			if(err) {
				console.log('ERROR!!!!');
			}
			var body = "{'url': 'https://www.biography.com/.image/t_share/MTE1ODA0OTcxNTkzNzk1MDg1/sean-connery-9255144-1-402.jpg'}";
			postpic(body)
		});
	console.log('Just snapped your photo!');
}

snap();

setInterval(snap, 10000);

//TESTING CODE//
console.log(apikey);
