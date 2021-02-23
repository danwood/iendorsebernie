<?php
require_once('classes/class.housekeeping.php');
?><!DOCTYPE html><html class="no-js" lang="en-us"><head><meta charset="utf-8"><!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge'><![endif]--><title>I Endorse Pamela Price for Alameda County District Attorney - Generate your own endorsement graphic</title><link rel="prefetch" href="//code.jquery.com"><link rel="preconnect" href="https://fonts.gstatic.com"> 
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Source+Sans+Pro:wght@100;400&display=swap" rel="stylesheet"><meta name="description" content="Generate your own Pamela Price endorsement graphic &amp; avatar"><meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"><meta name="supported-color-schemes" content="light dark"><link rel="stylesheet" href="css/normalize.css"><link rel="stylesheet" href="css/main.css"></head><body><!--[if lt IE 9]><p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please
<a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p><![endif]--><main><article class="textual"><h1 style="font-weight:900; font-family:'Archivo Black'">I Endorse Pamela Price</h1><h3 style="font-weight:100; font-family:'Source Sans Pro'">If you endorse Pamela Price for Alameda District Attorney in 2022, enter your information here, upload your photo, and create a graphic to share over social media!</h3></article><section class="requires-js"><article class="textual"><div class="flexbox"><div class="ksflex half"><form class="generator"><div><label>Your Name</label></div><input id="fullname-input" type="text" maxlength="30" value="<?php echo htmlspecialchars(housekeeping::get('fullname')); ?>"><div><label><input id='plural-input' name='plural' type='checkbox'<?php if(housekeeping::isget('plural')) echo ' checked'; ?> />Check if this more than one person</label></div><div><label>Your Occupation, Position, etc.</label></div><input id="description-input" type="text" maxlength="30" value="<?php echo htmlspecialchars(housekeeping::get('description')); ?>"><div><label>Where do you live?</label></div><input id="where-input" type="text" maxlength="50" value="<?php echo htmlspecialchars(housekeeping::get('where')); ?>"><div><label>Why are you endorsing her? Pick something here …</label></div><select id="reason-select" name="reason" style="width:100%"><option value="">--- Some suggestions ---</option><option value="1"> We need a district attorney who will end the racial disparity in prosecutions and mass incarceration of Black and Brown people.</option><option value="2"> Pamela Price is the only candidate who truly understands that Black Lives Matter.</option><option value="3"> Across the country, citizens are electing a new wave of new district attorneys who recognize that that current so-called "justice" system is unfair and broken, and Pamela Price is part of that wave.</option><option value="4"> Pamela Price will join reforming district attorneys such as Chesa Boudin (San Francisco), Monique Worrell, Larry Krasner, and Rachael Rollins in fixing our broken criminal justice system.</option><option value="5"> The role of District Attorney is perhaps the most powerful locally elected official, and we in Alameda County need a leader who will dispense justice fairly and with compasssion.</option><option value="6"> Pamela will work agressively to restore public trust in our criminal justice system, ensure public safety, and end mass incarceration in our justice system.</option></select><div><label>… Or, write your own personal message</label></div><textarea id="freeform-text" name="freeform"></textarea><p class="small"><i>Suggestion: include your message when you share your image, along with <b>#AlamedaDA22</b> & <b>#JusticeDoneRight</b></i></p><div><label><div class="hidden-ios"><img id="avatarImage" src="img/avatar.png"></div>Photo of you</label></div><input class="filebutton" id="uploadAvatar" type="file" value="upload image" onchange="readURL(this);"><div><!-- if 'test' parameter set to a true value, then hidden input here allows missing avatar upload.--><?php if (housekeeping::isGet('test')) { ?><input type="hidden" id="test-input" value="1" name="test" /> <?php } ?><input class="button" id="generate" type="submit" value="Generate images"></div></form></div><div class="ksflex half" id="canvasContainer"><div class="initiallyHidden" style="display:none"><p>Images have been generated!<div class="visible-ios"><b>Tap and hold on images to save in your photo library.</b></div></p></div><div class="placeholder supertitle">Example RECT image for Twitter</div><canvas id="rectCanvas" width="1777" height="1000" style="display:none"></canvas><img class="placeholder" id="rectImg" src="/img/rect-example.png"><div class="download-container initiallyHidden" style="display:none"><img class="resultImage" id="rectResult"><span class="supertitle">for Twitter</span><a class="download hidden-ios button" id="downloadRect" href="#" data-shape="rect">Download</a></div><div class="placeholder supertitle">Example SQUARE image for FaceBook & Instagram</div><canvas id="squareCanvas" width="1080" height="1080" style="display:none"></canvas><img class="placeholder" id="squareImg" src="/img/square-example.png"><div class="download-container initiallyHidden" style="display:none"><img class="resultImage" id="squareResult"><span class="supertitle">for Facebook & Instagram</span><a class="download hidden-ios button" id="downloadSquare" href="#" data-shape="square">Download</a></div><div class="initiallyHidden" style="display:none"><p>Share your customized graphics and experiences by using <b>#AlamedaDA22</b> <b>#JusticeDoneRight</b> and tagging <b>@PPriceCares</b> on social media!<br>Twitter: <a href="https://twitter.com/PPriceCares">@PPriceCares</a></p><p style="font-size:80%"><b>Having problems?</b> If the fonts aren't quite right, try re-generating your image. And certain photos taken with your phone's camera may be rotated incorrectly depending on the orientation of your phone. Try taking a new photo with your phone oriented on a different side.</p></div></div></div></article></section><section class="js-warning">This page requires JavaScript! </section></main><footer><p>For personal use and personal images only. No information collected in the use of this website will be used or stored.

</p></footer><script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha384-ZvpUoO/+PpLXR1lu4jmpXWu80pZlYUAfxl5NsBMWOEPSjUn/6Z/hRTt8+pR6L4N2" crossorigin="anonymous"></script><script>window.jQuery || document.write('<script src="js/vendor/jquery-3.5.1.min.js"><\\/script>')</script><script src="js/plugins-min.js"></script><script src="js/main-min.js"></script><script>document.documentElement.className = document.documentElement.className.replace("no-js","js");

// Set body class to iPhone, iPad, or other
var bodyClass = 'other'
if (navigator.userAgent.includes('iPhone')) bodyClass = 'iPhone';
if (navigator.userAgent.includes('iPad')  ) bodyClass = 'iPad';
document.body.className = bodyClass;

//- Download canvas as a PNG image
//- https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl#answer-44487883

$(".download").on('click', function() {

	var shape = $(this).data('shape');
	var canvas = document.getElementById(shape + 'Canvas');

	$(this).attr('download', 'Pamela-Price-' + shape + '.png');
	$(this).attr('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
});

<?php if (!empty(housekeeping::get('reason'))) { ?>
$("#reason-select").val(<?php echo htmlspecialchars(housekeeping::get('reason')); ?>);
<?php } ?>

$( "#reason-select" ).change(function() {
	var str = "";
	$( "select option:selected" ).each(function() {
	  if ($(this).val() !== '') {
	  str += $( this ).text() + " ";
	  }
	});
	$("#freeform-text").text(str.trim())
})
.change();

$("#generate").on('click', function() {

	// Set globals

	fullname = $('#fullname-input').val().trim();
	description = $('#description-input').val().trim();
	where = $('#where-input').val().trim();
	reason = $('#freeform-text').val();
	plural = $('#plural-input').prop("checked");
	avatarImageSrc = $("#avatarImage").attr('src');

	if (fullname.length < 2 || where.length < 2 || reason.length < 10) {
		alert("Please fill in your name and location and choose a reason");
	}
	else if ((avatarImageSrc === undefined || avatarImageSrc == 'img/avatar.png') && $('#test-input').val() != 1) {
		alert("You need to upload your image!");
	}
	else {
		startGeneratingImage();
	}

	return false;
});

//- Load file locally
//- https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page

function readURL(input) 
{
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$("#avatarImage").attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}</script></body></html>