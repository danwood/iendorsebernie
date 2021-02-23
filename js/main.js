// Mostly written without Jquery but since we're using it elsewhere, might as well take advantage of it.

// globals!
var fullname;
var plural;
var description;
var where;
var reason;
var avatarImageSrc;

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

const RECT_ENDORSE = 4;
const RECT_ENDORSES = 5;
const SQUARE_ENDORSE = 6;
const SQUARE_ENDORSES = 7;


const PP_PURPLE = '#623894'


// https://stackoverflow.com/a/53636623/25560
const prepareFontLoad = (fontList) => Promise.all(fontList.map(font => document.fonts.load(font)));

/* exported startGeneratingImage */

async function startGeneratingImage() {

	jQuery('#generate').prop("disabled", true)
	jQuery('.placeholder').hide();

	const fontList = ['400 italic 60px "Source Sans Pro"', '100 60px "Source Sans Pro"', '900 60px "Archivo Black"' ];
	await prepareFontLoad(fontList);

	// the loaded images will be placed in imgs[]
	imgs=[];

	imageURLs=[];  
	imageURLs.push(avatarImageSrc 
		? avatarImageSrc : 
		           "/img/avatar.png");
	imageURLs.push("/img/rect-template.png");
	imageURLs.push("/img/square-template.png");
	imageURLs.push("/img/profile-example.png");
	imageURLs.push("/img/rect-endorse.png");
	imageURLs.push("/img/rect-endorses.png");
	imageURLs.push("/img/square-endorse.png");
	imageURLs.push("/img/square-endorses.png");

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
		};
		// set img properties
		img.src = imageURLs[i];
	}      
}

// All the images are now loaded
function imagesAreNowLoaded(){

	drawRect();
	drawSquare();

	jQuery('#generate').prop("disabled", false)
	jQuery('.initiallyHidden').show();
	jQuery('.placeholder').hide();

}



// Mask to a circle; don't rely on background image having transparency - broken in Safari?
function drawAvatar(canvas, x, y, size) {
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

	ctx.rect(centerX-frameW/2.0, centerY-frameH/2.0, frameW, frameH);
	// CIRCLE: ctx.arc(centerX, centerY, size/2.0, 0, Math.PI * 2);


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

//	ctx.fillStyle = "orange";	
//	ctx.fillRect(centerX-frameW/2, centerY-(frameW/aspect)/2, frameW, frameW/aspect);


	// Undo the clipping
	ctx.restore();
}

function drawNameLine(canvas, x, y, text, initialSize) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var yTop = h - y;		// convert bottom-left-based Y to top-left-based Y
	var textWidth = w;

	ctx.textAlign = "left";

	for (var size = initialSize ; size > 12 ; size -= 1) {

		ctx.font = "900 " + String(size) + "px 'Archivo Black', sans-serif";

		textWidth = ctx.measureText(text).width;
		if (x + textWidth < w - size) {
			break;
		}
	}

	// use fontBoundingBox Ascent/Descent for a bigger box

	ctx.fillStyle = PP_PURPLE;

	ctx.fillText(text, x, yTop);

}

function drawDescriptionLine(canvas, x, y, text, initialSize) {
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var yTop = h - y;		// convert bottom-left-based Y to top-left-based Y
	var textWidth = w;

	ctx.textAlign = "left";

	for (var size = initialSize ; size > 12 ; size -= 1) {

		ctx.font = "100 " + String(size) + "px 'Source Sans Pro',sans-serif";

		textWidth = ctx.measureText(text).width;
		if (x + textWidth < w - size) {
			break;
		}
	}

	// use fontBoundingBox Ascent/Descent for a bigger box

	ctx.fillStyle = PP_PURPLE;
	ctx.fillText(text, x, yTop);

}


function drawWhyLines(canvas, x, middleYBottom, text, initialSize, maxHeight) {

	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;
	var middleY = h - middleYBottom;		// convert bottom-left-based Y to top-left-based Y

	//ctx.fillStyle = "black";
	//ctx.globalAlpha = 0.3;
	//ctx.fillRect(x, middleY-maxHeight/2, w-x, maxHeight);
	//ctx.globalAlpha = 1.0;


	ctx.textAlign = "left";
	ctx.fillStyle = PP_PURPLE;

	var lineHeightMultiplier = 1.1;
	var width;

	for(var size = initialSize ; size > 10 ; size -= 1) {
		ctx.font = "400 italic " + String(size) + "px 'Source Sans Pro',sans-serif";

		// Draw paragraph
		textWidth = w - x - size/2;
		var paragraphHeight = wrapText(ctx, text, 0, 0, textWidth, size*lineHeightMultiplier, 0, true); // measure only

		if (paragraphHeight < maxHeight) {
			break;  // it fits, so really draw now.  Assume max 0.9 of height
		}
	}

	//ctx.fillStyle = "black";
	//ctx.globalAlpha = 0.3;
	//ctx.fillRect(x, middleY-maxHeight/2, textWidth, maxHeight);
	//ctx.globalAlpha = 1.0;

	var line = wrapText(ctx, text, x, middleY - (paragraphHeight/2) + size, textWidth, size*lineHeightMultiplier, 0);   

}



function drawSquare() {
	var canvas = document.getElementById('squareCanvas');

	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	ctx.clearRect(0,0, w, h);

	var image = imgs[SQUARE];
	ctx.drawImage(image, 0, 0, w, h);

	//ctx.fillStyle = "green";
	//ctx.globalAlpha = 0.8;
	//ctx.fillRect(0,0,w,h);
	//ctx.globalAlpha = 1.0;

	drawAvatar(canvas, 40, 765, 275);

	drawNameLine(canvas, 45, 628, fullname, 100);

	var image = plural ? imgs[SQUARE_ENDORSE] : imgs[SQUARE_ENDORSES];
	ctx.drawImage(image, 0,0,w,h)

	var descAndWhere = description.length > 0 ? description + " / " + where : where;
	drawDescriptionLine(canvas, 45, 580, descAndWhere, 40);
	drawWhyLines(canvas, 350, 878, reason, 60, 308);

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

	//ctx.fillStyle = "green";
	//ctx.globalAlpha = 0.8;
	//ctx.fillRect(0,0,w,h);
	//ctx.globalAlpha = 1.0;
	
	drawAvatar(canvas, 38, 672, 294);

	drawNameLine(canvas, 36, 567, fullname, 100);

	var image = plural ? imgs[RECT_ENDORSE] : imgs[RECT_ENDORSES];
	ctx.drawImage(image, 0, 0, w, h)

	var descAndWhere = description.length > 0 ? description + " / " + where : where;
	drawDescriptionLine(canvas, 36, 510, descAndWhere, 50);
	drawWhyLines(canvas, 368, 851, reason, 100, 260);

	var theImg = document.getElementById('rectImg');
	theImg.style.display = 'none';		// hide sample image

	var dataUrl = canvas.toDataURL();
	var resultImg = document.getElementById('rectResult');
	resultImg.src = dataUrl;
}


