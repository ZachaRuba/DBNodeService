
require('dotenv').load();
const https = require('https');
const querystring = require('querystring');
const fs = require('fs');
const express = require('express');
const webcam = require('node-webcam');


const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const apikey = process.env.APIKEY;
const apiurl = "https://canadacentral.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion";
const userid = 12345

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
		var str = '';
	//Determine where Post is going
		var options = {
				hostname: "canadacentral.api.cognitive.microsoft.com",
				path: "/face/v1.0/detect?returnFaceId=false&returnFaceLandmarks=false&returnFaceAttributes=emotion",
				method: "POST",
				followRedirect: true,
				headers:{
					"Content-Type": "application/octet-stream",
					"Ocp-Apim-Subscription-Key": apikey
				}
		};

		var req = https.request(options, (res) => {
		  console.log('statusCode:', res.statusCode);
		  console.log('headers:', res.headers);

		  res.on('data', (d) => {
		    //process.stdout.write(d);
				str += d;
		  });

			res.on('end', (e) => {
				postemote(str);
				//console.log(str);
			});
		});

		req.on('error', (e) => {
		  console.error(e);
		});

		//execute the request
		req.write(postdata);
		req.end();

}

function postemote(postdata){
	var options = {
			hostname: "nw-mood-server.herokuapp.com",
			path: "/addEmotion",
			method: "POST",
			followRedirect: true,
			headers:{
				"Content-Type": "application/JSON",
			}
		}

			var req = https.request(options, (res) =>{
				console.log('statusCode:', res.statusCode);
				console.log('headers:', res.headers);
			});
			var id = "{'userId':" +  `'${userid}'}`;
			//execute the request
			req.write(postdata);
			console.log(postdata);
			req.write(id);
			console.log(id);
			req.end();
};


function snap() {
	maincam.capture("temp_picture", function(err, data){
			if(err) {
				console.log('ERROR!!!!');
			}
		});
		console.log('Hope we read your file ok.');
		fs.readFile('temp_picture.jpg', (err, data) => {
  		if (err) throw err;
			console.log(data);
  		postpic(data);
		});
	console.log('Just snapped your photo!');
}

snap();

setInterval(snap, 10000);

//TESTING CODE//
console.log(apikey);
