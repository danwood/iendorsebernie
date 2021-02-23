// Mostly written without Jquery but since we're using it elsewhere, might as well take advantage of it.

// globals!
var firstname;
var fullname;
var where;
var reason;
var avatarImageSrc;
var variantNumber;		// 1 through 7

var imgs=[];
var imagesOK=0;

// Load multiple images and draw when totally finished loading
// https://stackoverflow.com/questions/33596638/loading-multiple-png-images-in-html5-canvas#answer-33601666

// put the paths to your images in imageURLs[]
var imageURLs=[];  

const AVATAR = 0;
const RECT = 1;
const SQUARE = 2;
const PROFILE = 3;

const OR_RED  = "#ef3e40";
const OR_BLUE = "#0c57a2";






// https://stackoverflow.com/a/53636623/25560
const prepareFontLoad = (fontList) => Promise.all(fontList.map(font => document.fonts.load(font)));

/* exported startGeneratingImage */

async function startGeneratingImage() {

	jQuery('#generate').prop("disabled", true)
	jQuery('.placeholder').hide();

	const fontList = ['400 60px Poppins', '800 60px Poppins' ];
	await prepareFontLoad(fontList);

	// the loaded images will be placed in imgs[]
	imgs=[];

	imageURLs=[];  
	imageURLs.push(avatarImageSrc ? avatarImageSrc : "img/avatar.png");
	imageURLs.push("img/rect-template.png");
	imageURLs.push("img/square-template" + variantNumber + ".png");
	imageURLs.push("img/profile-template.png");
	imagesOK=0;
	startLoadingAllImages(imagesAreNowLoaded);
}


// http://jsfiddle.net/cP5Fz/9/
// Modified to take additional letter spacing (in pixel units same as text) into account in measurements.
function wordWrap(text, width, ctx, useHyphen, letterSpacing) {
	var words = text.split(/(\s+)/),
		wrappedText = [],
		wordLength = 0,
		fullLength = 0,
		line = "",
		lineLength = 0,
		spacer = useHyphen ? "-" : "",
		spacerLength = ctx.measureText(spacer).width,	// no letter spacing after dash
		letterLength = 0;

	// make sure width to font size ratio is reasonable
	if (ctx.measureText("M" + letterSpacing + spacer).width > width) {
		return [];
	}

	// produce lines of text
	for (var i = 0, l = words.length; i < l; i++) {

		wordLength = ctx.measureText(words[i].replace(/\s+$/, "")).width + letterSpacing * words[i].length;
		fullLength = ctx.measureText(words[i]).width + letterSpacing * words[i].length;

		if (lineLength + wordLength < width) {
			line += words[i];
			lineLength += fullLength;
		} else if (wordLength < width) {
			wrappedText.push(line);
			line = words[i];
			lineLength = fullLength;
		} else {
			// word is too long so needs splitting up

			for (var k = 0, lim = words[i].length; k < lim; k++) {

				letterLength = ctx.measureText(words[i][k]).width + letterSpacing;

				if (words[i][k + 1] && /\S/.test(words[i][k + 1])) {

					if (lineLength + letterLength + spacerLength < width) {
						line += words[i][k];
						lineLength += letterLength;
					} else {
						if (true || words[i][k + 1] && /\s/.test(words[i][k + 1])) {
							line += spacer;
						}
						wrappedText.push(line);
						line = words[i][k];
						lineLength = letterLength;
					}

				} else {
					// last 'letter' in words

					if (lineLength + letterLength < width) {
						line += words[i].substr(k);
						lineLength += ctx.measureText(words[i].substr(k)).width + letterSpacing * words[i].substr(k).length;
					} else {
						line += spacer;
						wrappedText.push(line);
						line = words[i].substr(k);
						lineLength = ctx.measureText(words[i].substr(k)).width  + letterSpacing * words[i].substr(k).length;
					}

					break;

				}


			}

		}
	}

	wrappedText.push(line);

	// strip trailing whitespace from each line
	for (var j = 0, len = wrappedText.length; j < len; j++) {
		wrappedText[j] = wrappedText[j].replace(/\s+$/, "");
	}

	return wrappedText;

}

function deUnderline(string) {
	return string.replace('_', ' ');
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, letterSpacing=0, measureOnly=false){

	var textLines = wordWrap(text, maxWidth, ctx, true, letterSpacing);

	if (!measureOnly) {
		for (var i = 0, l = textLines.length; i < l; i++) {

			var line = textLines[i];
			if (letterSpacing === 0) {
				ctx.fillText(deUnderline(line), x, y + lineHeight * i);	// ideal since there's proper kerning
			} else {
				var lineWidth = ctx.measureText(line).width + letterSpacing * (line.length-1);
				var curX;
				switch(ctx.textAlign) {
					case "center": curX = x - lineWidth/2; break;
					case "right" : curX = x - lineWidth; break;
					default: curX = x;
				}
				// switch to left align for consistency
				var savedTextAlign = ctx.textAlign;
				ctx.textAlign = "left";
				for (var c = 0 ; c < line.length ; c++ ) {
					ctx.fillText(deUnderline(line[c]), curX, y + lineHeight * i);
					curX += letterSpacing + ctx.measureText(line[c]).width;
				}
				ctx.textAlign = savedTextAlign;

			}
		}
	}
	return lineHeight * textLines.length;
}

// Create a new Image() for each item in imageURLs[]
// When all images are loaded, run the callback (==imagesAreNowLoaded)
function startLoadingAllImages(callback){

	// iterate through the imageURLs array and create new images for each
	for (var i=0; i<imageURLs.length; i++) {
		// create a new image an push it into the imgs[] array
		var img = new Image();
		// Important! By pushing (saving) this img into imgs[],
		//     we make sure the img variable is free to
		//     take on the next value in the loop.
		imgs.push(img);
		// when this image loads, call this img.onload
		img.onload = function(){ 
			// this img loaded, increment the image counter
			imagesOK++; 
			// if we've loaded all images, call the callback
			if (imagesOK>=imageURLs.length ) {
				callback();
			}
		};
		// notify if there's an error
		img.onerror=function(){
			alert("image #" + i + " load failed: " + imageURLs[i]);
			jQuery('#generate').prop("disabled", false)
		};
		// set img properties
		img.src = imageURLs[i];
	}      
}

// All the images are now loaded
function imagesAreNowLoaded(){

	drawRect();
	drawSquare();
	drawProfile();

	jQuery('#generate').prop("disabled", false)
	jQuery('.initiallyHidden').show();
	jQuery('.placeholder').hide();

}



// Mask to a circle; don't rely on background image having transparency - broken in Safari?
function drawCircledAvatar(canvas, x, y, size) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	y = h - (y + size);			// convert lower left of coords, in lower-left-based grid, to upper-left corner


	// ----------------------------------------------------- Avatar

	var centerX = x + size / 2.0;
	var centerY = y + size / 2.0;
	var frameW = size;
	var frameH = size;

	const frameAspect = frameW / frameH;

	// Save the state, so we can undo the clipping
	ctx.save();

//	ctx.globalAlpha = 0.5;

	// Create a square
	ctx.beginPath();

	// ctx.rect(centerX-frameW/2.0, centerY-frameH/2.0, frameW, frameH);
	ctx.arc(centerX, centerY, size/2.0, 0, Math.PI * 2);


	// Clip to the current path
	ctx.clip();

	var image = imgs[AVATAR];
	var naturalWidth = image.naturalWidth;
	var naturalHeight = image.naturalHeight;
	var aspect = naturalWidth / naturalHeight;

	// ctx.fillRect(centerX-frameW/2, centerY-(frameW/aspect)/2, frameW, frameW/aspect);

	if (aspect > frameAspect) {	// wider, so clip sides

		ctx.drawImage(image, centerX-(frameH*aspect)/2, centerY-frameH/2, frameH*aspect, frameH);

	}
	else {	// narrower, so clip top/bottom

		ctx.drawImage(image, centerX-frameW/2, centerY-(frameW/aspect)/2, frameW, frameW/aspect);

	}

	// Undo the clipping
	ctx.restore();
}

function drawPortraitAvatar(canvas, x, y, frameW, frameH) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;

	var centerX = x + frameW / 2.0;
	var centerY = y + frameH / 2.0;

	// ----------------------------------------------------- Avatar

	const frameAspect = frameW / frameH;

	// Save the state, so we can undo the clipping
	ctx.save();

//	ctx.globalAlpha = 0.5;

	// Create a square
	ctx.beginPath();

	ctx.rect(x, y, frameW, frameH);
	//ctx.arc(centerX, centerY, size/2.0, 0, Math.PI * 2);


	// Clip to the current path
	ctx.clip();

	ctx.fillStyle = 'green';
	ctx.fillRect(0, 0,w,h);

	var image = imgs[AVATAR];
	var naturalWidth = image.naturalWidth;
	var naturalHeight = image.naturalHeight;
	var aspect = naturalWidth / naturalHeight;

	ctx.fillRect(centerX-frameW/2, centerY-(frameW/aspect)/2, frameW, frameW/aspect);

	if (aspect > frameAspect) {	// wider, so clip sides

		ctx.drawImage(image, centerX-(frameH*aspect)/2, centerY-frameH/2, frameH*aspect, frameH);

	}
	else {	// narrower, so clip top/bottom

		ctx.drawImage(image, centerX-frameW/2, centerY-(frameW/aspect)/2, frameW, frameW/aspect);

	}

	// Undo the clipping
	ctx.restore();
}

function drawSquareNameLine(canvas, x, y, text, initialSize) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var yTop = h - y;		// convert bottom-left-based Y to top-left-based Y
	var textWidth = w;

	ctx.textAlign = "left";

	for (var size = initialSize ; size > 12 ; size -= 1) {

		ctx.font = "800 " + String(size) + "px Poppins, sans-serif";

		textWidth = ctx.measureText(text).width;
		if (x + textWidth < w - size) {
			break;
		}
	}

	// use fontBoundingBox Ascent/Descent for a bigger box

	yTop += ctx.measureText(text).fontBoundingBoxDescent; 	// move down to compensate for text descender
	ctx.fillStyle = OR_RED;
	ctx.fillRect(0, yTop - ctx.measureText(text).fontBoundingBoxAscent, textWidth + x + size/2,	// add font size as right margin 
		ctx.measureText(text).fontBoundingBoxAscent  + ctx.measureText(text).fontBoundingBoxDescent);

	ctx.fillStyle = "white";

	ctx.font = "800 " + String(size) + "px Poppins, sans-serif";
	ctx.fillText(text, x, yTop);
}

function drawRectNameLine(canvas, x, y, text, initialSize) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var yTop = h - y;		// convert bottom-left-based Y to top-left-based Y
	var textWidth;

	ctx.textAlign = "center";

	for (var size = initialSize ; size > 12 ; size -= 1) {

		ctx.font = "800 " + String(size) + "px Poppins, sans-serif";

		textWidth = ctx.measureText(text).width;
		if (textWidth < w - 12 * 2) {						// hard-code margin
			break;
		}
	}

	yTop -= (52 - size)		// adjust vertical

	// use fontBoundingBox Ascent/Descent for a bigger box

	ctx.fillStyle = "white";

	ctx.font = "800 " + String(size) + "px Poppins, sans-serif";
	ctx.fillText(text, x, yTop);
}

function drawRectNameWhereLine(canvas, x, y, initialSize, text) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var yTop = h - y;		// convert bottom-left-based Y to top-left-based Y
	var textWidth = w;

	ctx.textAlign = "right";

	for (var size = initialSize ; size > 12 ; size -= 1) {

		ctx.font = "400 " + String(size) + "px Poppins, sans-serif";

		textWidth = ctx.measureText(text).width;
		if (x + textWidth < w - size) {
			break;
		}
	}

	// use fontBoundingBox Ascent/Descent for a bigger box

	ctx.fillStyle = OR_RED;
	var boxWidth = textWidth + size;
	boxWidth = Math.max(boxWidth, 294);
	ctx.fillRect(w-boxWidth, yTop - ctx.measureText(text).fontBoundingBoxAscent, boxWidth,	// add font size as right margin 
		ctx.measureText(text).fontBoundingBoxAscent  + ctx.measureText(text).fontBoundingBoxDescent);

	ctx.fillStyle = "white";

	ctx.font = "400 " + String(size) + "px Poppins, sans-serif";
	ctx.fillText(text, w - size/2, yTop);
}


function drawWhyLines(canvas, x, middleYBottom, text, initialSize, maxHeight, maxWidth=0, lineHeightMultiplier=1.45) {

	text = "“" + text + "”";

	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var middleY = h - middleYBottom;		// convert bottom-left-based Y to top-left-based Y

	//ctx.fillStyle = "black";
	//ctx.globalAlpha = 0.3;
	//ctx.fillRect(x, middleY-maxHeight/2, w-x, maxHeight);
	//ctx.globalAlpha = 1.0;


	ctx.textAlign = "left";
	ctx.fillStyle = "white";

	var width;

	for(var size = initialSize ; size > 10 ; size -= 1) {
		ctx.font = "800 " + String(size) + "px Poppins,sans-serif";

		// Draw paragraph
		textWidth = maxWidth ? maxWidth : w - x*2	// if not specified width, assume centered
		var paragraphHeight = wrapText(ctx, text, 0, 0, textWidth, size*lineHeightMultiplier, 0, true); // measure only

		if (paragraphHeight < maxHeight) {
			break;  // it fits, so really draw now.  Assume max 0.9 of height
		}
	}

	//ctx.fillStyle = "black";
	//ctx.globalAlpha = 0.3;
	//ctx.fillRect(x, middleY-maxHeight/2, textWidth, maxHeight);
	//ctx.globalAlpha = 1.0;

	ctx.font = "800 " + String(size) + "px Poppins,sans-serif";
	var line = wrapText(ctx, text, x, middleY - (paragraphHeight/2) + size, textWidth, size*lineHeightMultiplier, 0);   

}



function drawSquare() {
	var canvas = document.getElementById('squareCanvas');		// 1024 x 1024

	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	ctx.clearRect(0,0, w, h);

	var image = imgs[SQUARE];
	ctx.drawImage(image, 0, 0, w, h);
//	ctx.fillStyle = "orange";
//	ctx.fillRect(0, 0, w, h);

	drawCircledAvatar(canvas, 45, 643, 402);

	drawSquareNameLine(canvas, 75, 629, fullname.trim() + ", " + where, 28);
	drawWhyLines(canvas, 70, 275, reason, 80, 230);

	var theImg = document.getElementById('squareImg');
	theImg.style.display = 'none';		// hide sample image

	var dataUrl = canvas.toDataURL();
	var resultImg = document.getElementById('squareResult');
	resultImg.src = dataUrl;
}



function drawRect() {
	var canvas = document.getElementById('rectCanvas');

	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	ctx.clearRect(0,0, w, h);

	var image = imgs[RECT];
	ctx.drawImage(image, 0, 0, w, h);
	
	drawPortraitAvatar(canvas, 916, 132, 275, 345);

	drawRectNameLine(canvas, w/2, 543, firstname.trim().toUpperCase() + " ENDORSES NINA TURNER FOR CONGRESS", 54);
	
	drawRectNameWhereLine(canvas, 450, 134, 30, fullname + ", " + where)
	drawWhyLines(canvas, 435, 330, reason, 50, 300, 464, 1.25);

	var theImg = document.getElementById('rectImg');
	theImg.style.display = 'none';		// hide sample image

	var dataUrl = canvas.toDataURL();
	var resultImg = document.getElementById('rectResult');
	resultImg.src = dataUrl;
}


function drawProfile() {
	var canvas = document.getElementById('iconCanvas');
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;

	var avatarScale = 0.8;		// about .75 would show the maximum from original, so make slightly larger
	var scaledWidth = w * avatarScale;
	var scaledOffset = (w - scaledWidth) / 2.0;

	drawCircledAvatar(canvas, scaledOffset, scaledOffset, scaledWidth);


	image = imgs[PROFILE];
	
	ctx.drawImage(image, 0, 0, w, h);
	
	
	var theImg = document.getElementById('iconImg');
	theImg.style.display = 'none';		// hide sample image
	
	var dataUrl = canvas.toDataURL();
	var resultImg = document.getElementById('iconResult');
	resultImg.src = dataUrl;
	
	resultImg.title = 'I-Endorse-Nina-profile.png';

}


