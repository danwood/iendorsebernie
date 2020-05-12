// globals!

var name;
var quotation;
var avatarImageSrc;
var plural;

var imgs=[];
var imagesOK=0;
var statePath = '';
var candidatePath = '';

// Load multiple images and draw when totally finished loading
// https://stackoverflow.com/questions/33596638/loading-multiple-png-images-in-html5-canvas#answer-33601666

// put the paths to your images in imageURLs[]
var imageURLs=[];  

const AVATAR = 0
const STAR = 1
const OPENQUOTE = 2
const EXAMPLE = 3


// https://stackoverflow.com/a/53636623/25560
const prepareFontLoad = (fontList) => Promise.all(fontList.map(font => document.fonts.load(font)));

/* exported startGeneratingImage */

async function startGeneratingImage() {

	const fontList = ['900 60px Roboto', '300 60px Roboto', '500 60px playball' ]
	await prepareFontLoad(fontList);

	// the loaded images will be placed in imgs[]
	imgs=[];

	imageURLs=[];  
	imageURLs.push(avatarImageSrc ? avatarImageSrc : "/img/avatar.png");
	imageURLs.push("/img/star.png");
	imageURLs.push("/img/openquote.png");
	imageURLs.push("/img/example.png");


	imagesOK=0;
	startLoadingAllImages(imagesAreNowLoaded);
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
			alert("image load failed: " + imageURLs[i]);
		} 
		// set img properties
		img.src = imageURLs[i];
	}      
}

// All the images are now loaded
function imagesAreNowLoaded(){

	// DRAW SOME TEXT

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var w = canvas.width;
	var h = canvas.height;

	// Background Color

	var exampleImage = imgs[EXAMPLE];
	ctx.drawImage(exampleImage, 0,0,w,h);

	ctx.fillStyle = 'rgb(36, 87, 145)';
	ctx.fillRect(0, 0, w, h);

	ctx.fillStyle = 'white';
	ctx.fillRect(w*.55, 0, w*.45, h*.56);


	ctx.globalAlpha = 1.0;



	// ----------------------------------------------------- Avatar

	var centerX = w * 0.775;
	var centerY = h * 0.275;
	var radius = w * 0.19;

	// Save the state, so we can undo the clipping
	ctx.save();


	// Create a square
	ctx.beginPath();

	ctx.rect(centerX-radius, centerY-radius, radius*2, radius*2);

	// Clip to the current path
	ctx.clip();

	var image = imgs[AVATAR];
	var imageWidth = image.naturalWidth;
	var imageHeight = image.naturalHeight;
	var aspect = imageWidth / imageHeight;


	if (aspect > 1.0) {

		ctx.drawImage(image, centerX-(radius*aspect), centerY-radius, radius*2*aspect,radius*2);

	}
	else {

		ctx.drawImage(image, centerX-radius, centerY-(radius/aspect), radius*2,(radius/aspect)*2);

	}


	// Undo the clipping
	ctx.restore();


	// ----------------------------------------------------- Stars

	image = imgs[STAR];
	for (var i = 2; i >= 0; i--) {
		ctx.drawImage(image, w*.10+i*w*.13, h*.055, w*.10, h*.10);
	}



	// ----------------------------------------------------- Name

	name = "[YOUR NAME HERE]";

	var fontSize = 50 * w/1000;
	ctx.font = "900 " + String(fontSize) + "px Roboto,sans-serif";

	var textWidth = ctx.measureText(name).width;
	var textHeight = ctx.measureText(name).actualBoundingBoxDescent + ctx.measureText(name).actualBoundingBoxAscent;



	// Make sure user's name fits

	if (textWidth > w * 0.5 ) {
		fontSize *= w*0.5/textWidth;
		ctx.font = "900 " + String(fontSize) + "px Roboto,sans-serif";
		textWidth = ctx.measureText(name).width;
		textHeight = ctx.measureText(name).actualBoundingBoxDescent + ctx.measureText(name).actualBoundingBoxAscent;
	}


	var y = h*0.27;
	textXCenter = w*0.275;

	ctx.fillStyle = 'white';
	ctx.fillRect(0,y-textHeight-h*.02, w*.55, textHeight+h*.05);

	ctx.fillStyle = 'rgb(236, 71, 61)';		// red
	ctx.fillText(name, textXCenter-textWidth/2, y, textWidth);


	// ----------------------------------------------------- Endorses, for re-election, ED Markey


	y = h*0.39;
	fontSize = 66 * w/1000;


	var endorses = (plural ? "endorse" : "endorses") + " ";

	ctx.font = "500 " + String(fontSize) + "px Playball,serif";

	textWidth = ctx.measureText(endorses).width;
	ctx.fillStyle = 'white';
	ctx.fillText(endorses, textXCenter-textWidth/2, y, textWidth);


	y = h*0.56;
	var reelection = 'for re-election';

	textWidth = ctx.measureText(reelection).width;
	ctx.fillText(reelection, textXCenter-textWidth/2, y, textWidth);


	fontSize = 80 * w/1000;
	ctx.font = "900 " + String(fontSize) + "px Roboto,sans-serif";
	var edmarkey = 'ED MARKEY';
	textWidth = ctx.measureText(edmarkey).width;
	y = h*0.49;
	ctx.fillText(edmarkey, textXCenter-textWidth/2, y, textWidth);


	// ----------------------------------------------------- BOX

	ctx.fillStyle = 'rgb(236, 71, 61)';		// red
	x = w * 0.08;
	ctx.fillRect(x, h*0.63, w-x, h*.26);

	// ----------------------------------------------------- Quote Mark

	image = imgs[OPENQUOTE];
	imageWidth = image.naturalWidth;
	imageHeight = image.naturalHeight;
	aspect = imageWidth / imageHeight;

	x = w*0.12;
	y = h*0.65;
	radius = w*0.05

	ctx.globalAlpha = 0.5;
	ctx.drawImage(image, x-radius, y-(radius/aspect), radius*2,(radius/aspect)*2);
	ctx.globalAlpha = 1.0;




	// ----------------------------------------------------- Paragraph Text
	var setting = {
			maxSpaceSize : 6,
			minSpaceSize : 0.5,
			lineSpacing : 1.07,
			compact : false
	}

	ctx.textAlign = "left";
	ctx.fillStyle = "transparent";

	var endquote = "”";
	var left = w*.12;
	var wid = w*.85;
	var origY = h*0.7;			// further down if Nina
	var size;

	for(size = 200 ; size > 15 ; size -= 1) {

		y = origY;
		ctx.font = "300 " + String(size * h/1000) + "px Roboto, sans-serif";

		// Draw paragraph
		var line = ctx.fillParaText(quotation+endquote, left, y, wid, setting);  // settings is remembered    

		y = line.nextLine;

		if (y < h * 0.90) {
			break;  // it fits, so really draw now.
		}
	}



	ctx.fillStyle = "white";
	y = origY;
	ctx.font = "300 " + String(size * h/1000) + "px Roboto, sans-serif";
	line = ctx.fillParaText(quotation+endquote, left, y, wid, setting);  // settings is remembered    




	// ----------------------------------------------------- BOTTOM STUFF

	var GENERATED_TEXT = "Generated at IENDORSEBERNIE.com";
	var GENERATED_HASHTAG = " #IEndorseBernie"

	ctx.font = "500 " + String(20 * h/1000) + "px freight-sans-pro, monospace";
	ctx.fillStyle = 'white';
	ctx.fillText(GENERATED_TEXT, w*0.051, h*0.96, w*0.9);

	var thatWidth = ctx.measureText(GENERATED_TEXT + "  ").width;
	ctx.fillStyle = 'RGBA(255,255,255,0.6';
	ctx.font = "700 " + String(20 * h/1000) + "px freight-sans-pro, monospace";
	ctx.fillText(GENERATED_HASHTAG, w*0.051 + thatWidth, h*0.96, w*0.9);

	ctx.font = "500 " + String(15 * h/1000) + "px freight-sans-pro, monospace";
	ctx.fillStyle = 'RGBA(255,255,255,0.4';
	ctx.fillText("Not affiliated with the Bernie 2020 campaign", w*0.051, h*0.98, w*0.9);


	var saveContainer = document.getElementById('saveContainer');
	saveContainer.style.display = 'block';		// reveal all!

	var canvas = document.getElementById('canvas');
	canvas.style.display = 'block';		// reveal all!

	var canvasImg = document.getElementById('canvasImg');
	canvasImg.style.display = 'none';		// hide sample image




	// Reference Image - overlay

		// ctx.globalAlpha = 0.4;
		// ctx.drawImage(imgs[REFERENCE], 0, 0, w, h);
		// ctx.globalAlpha = 1.0;


	// STORE INTO Local storage????
	// https://hacks.mozilla.org/2012/02/saving-images-and-files-in-localstorage/

	// How to save an image to localStorage and display it on the next page?
	// https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page



}




