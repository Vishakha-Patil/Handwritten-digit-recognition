import '@babel/polyfill'


//-------------------
// GLOBAL variables
//-------------------
var modelName = "digitrecognizercnn";
let model;

var canvasWidth           	= 150;
var canvasHeight 			= 150;
var canvasStrokeStyle		= "white";
var canvasLineJoin			= "round";
var canvasLineWidth       	= 10;
var canvasBackgroundColor 	= "black";
var canvasId              	= "canvas";

var clickX = new Array();
var clickY = new Array();
var clickD = new Array();
var drawing;

document.getElementById('chart_box').innerHTML = "";
document.getElementById('chart_box').style.display = "none";
document.getElementById("clear_canvas").onclick = function() {clearCanvas()};
document.getElementById("predict_canvas").onclick = function() {predict()};
//---------------
// Create canvas
//---------------
var canvasBox = document.getElementById('canvas_box');
var canvas    = document.createElement("canvas");
var modelName = 'digitrecognizercnn';
canvas.setAttribute("width", canvasWidth);
canvas.setAttribute("height", canvasHeight);
canvas.setAttribute("id", canvasId);
canvas.style.backgroundColor = canvasBackgroundColor;
canvasBox.appendChild(canvas);
if(typeof G_vmlCanvasManager != 'undefined') {
  canvas = G_vmlCanvasManager.initElement(canvas);
}

var ctx = canvas.getContext("2d");


loadModel(modelName);
function clearCanvas(id) {
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	clickX = new Array();
	clickY = new Array();
	clickD = new Array();
}

//---------------------
// MOUSE DOWN function
//---------------------
$("#canvas").mousedown(function(e) {
	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();
});

//-----------------------
// TOUCH START function
//-----------------------
canvas.addEventListener("touchstart", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}

	var rect = canvas.getBoundingClientRect();
	var touch = e.touches[0];

	var mouseX = touch.clientX - rect.left;
	var mouseY = touch.clientY - rect.top;

	drawing = true;
	addUserGesture(mouseX, mouseY);
	drawOnCanvas();

}, false);

//---------------------
// MOUSE MOVE function
//---------------------
$("#canvas").mousemove(function(e) {
	if(drawing) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
});

//---------------------
// TOUCH MOVE function
//---------------------
canvas.addEventListener("touchmove", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	if(drawing) {
		var rect = canvas.getBoundingClientRect();
		var touch = e.touches[0];

		var mouseX = touch.clientX - rect.left;
		var mouseY = touch.clientY - rect.top;

		addUserGesture(mouseX, mouseY, true);
		drawOnCanvas();
	}
}, false);

//-------------------
// MOUSE UP function
//-------------------
$("#canvas").mouseup(function(e) {
	drawing = false;
});

//---------------------
// TOUCH END function
//---------------------
canvas.addEventListener("touchend", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

//----------------------
// MOUSE LEAVE function
//----------------------
$("#canvas").mouseleave(function(e) {
	drawing = false;
});

//-----------------------
// TOUCH LEAVE function
//-----------------------
canvas.addEventListener("touchleave", function (e) {
	if (e.target == canvas) {
    	e.preventDefault();
  	}
	drawing = false;
}, false);

//--------------------
// ADD CLICK function
//--------------------
function addUserGesture(x, y, dragging) {
	clickX.push(x);
	clickY.push(y);
	clickD.push(dragging);
}

//-------------------
// RE DRAW function
//-------------------
function drawOnCanvas() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	ctx.strokeStyle = canvasStrokeStyle;
	ctx.lineJoin    = canvasLineJoin;
	ctx.lineWidth   = canvasLineWidth;

	for (var i = 0; i < clickX.length; i++) {
		ctx.beginPath();
		if(clickD[i] && i) {
			ctx.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			ctx.moveTo(clickX[i]-1, clickY[i]);
		}
		ctx.lineTo(clickX[i], clickY[i]);
		ctx.closePath();
		ctx.stroke();
	}
}

//------------------------
// CLEAR CANVAS function
//------------------------

async function loadModel(modelName){
  console.log("model loading..");

  // clear the model variable
  model = undefined;
  
  // load the model using a HTTPS request (where you have stored your model files)
  
  model = await tf.loadLayersModel("https://gogul.dev/models/digitrecognizercnn/model.json");
  
  console.log("model loaded..");
}

loadModel(modelName);

//-----------------------------------------------
// preprocess the canvas to be MLP friendly
//-----------------------------------------------
function preprocessCanvas(image, modelName) {
	console.log("pre");
	
	if (modelName === "digitrecognizercnn") {
		// resize the input image to digitrecognizermlp's target size of (1, 28, 28)
		let tensor = tf.browser.fromPixels(image)
		    .resizeNearestNeighbor([28, 28])
		    .mean(2)
		    .expandDims(2)
		    .expandDims()
		    .toFloat();
		console.log(tensor.shape);
		return tensor.div(255.0);
	}

	// else throw an error
	else {
		alert("Unknown model name..")
	}
}

//--------------------------------------------
// predict function for digit recognizer mlp
//--------------------------------------------
console.log("predict");
async function predict() {

	// get image data from canvas
	var imageData = canvas.toDataURL();
	var label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

	// preprocess canvas
	let tensor = preprocessCanvas(canvas, modelName);
	console.log("predict1");
	// make predictions on the preprocessed image tensor
	let predictions = await model.predict(tensor).data();
	
	console.log("predict2");
	// get the model's prediction results
	let results = Array.from(predictions)
	var i=results.indexOf(Math.max(...results))
	console.log(i);
	document.getElementById('output').innerHTML = 'Predicted number : ' + i;
	if(i==0){
	document.getElementById('aud0').play();}
	else if(i==1){document.getElementById('aud1').play();}
	else if(i==2){document.getElementById('aud2').play();}
	else if(i==3){document.getElementById('aud3').play();}
	else if(i==4){document.getElementById('aud4').play();}
	else if(i==5){document.getElementById('aud5').play();}
	else if(i==6){document.getElementById('aud6').play();}
	else if(i==7){document.getElementById('aud7').play();}
	else if(i==8){document.getElementById('aud8').play();}
	else if(i==9){document.getElementById('aud9').play();}
	else{}
	// display the predictions in chart
	
	displayChart(results)

	console.log(results);
}

//------------------------------
// Chart to display predictions
//------------------------------
var chart = "";
var firstTime = 0;
function loadChart(label, data) {
	var ctx = document.getElementById('chart_box').getContext('2d');
	chart = new Chart(ctx, {
	    // The type of chart we want to create
	    type: 'bar',

	    // The data for our dataset
	    data: {
	        labels: label,
	        datasets: [{
	            label: "Probability",
	            backgroundColor: '#f50057',
	            borderColor: 'rgb(255, 99, 132)',
	            data: data,
	        }]
	    },

	    // Configuration options go here
	    options: {}
	});
}

//----------------------------
// display chart with updated
// drawing from canvas
//----------------------------
function displayChart(data) {
	var select_model  = document.getElementById("select_model");
  	//var select_option = select_model.options[select_model.selectedIndex].value;

	var label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	if (firstTime == 0) {
		loadChart(label, data);
		firstTime = 1;
	} else {
		chart.destroy();
		loadChart(label, data);
	}
	document.getElementById('chart_box').style.display = "block";
}
console.log("all");

