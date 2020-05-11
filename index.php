
<?php
require_once('classes/class.housekeeping.php'); 

$browser = '';
if (isset($_SERVER['HTTP_USER_AGENT'])) {
   $agent = $_SERVER['HTTP_USER_AGENT'];
	if (strlen(strstr($agent, 'Firefox')) > 0) {
	    $browser = 'firefox';
	}
}
?><!DOCTYPE html>
<html class="no-js" lang="en-us">
  <head>
    <meta charset="utf-8"><!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge'><![endif]-->
    <title>I Endorse Ed Markey</title>
    <meta name="description" content="Generate your own Senator Ed Markey endorsement graphic">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="supported-color-schemes" content="light dark">
    <link rel="apple-touch-icon" href="icon.png">
    <link rel="stylesheet" href="css/normalize.css">
    <link rel="stylesheet" href="css/main.css">
    <meta name="theme-color" content="#fafafa"><link href="https://fonts.googleapis.com/css2?family=Playball&family=Roboto:wght@300;900&display=swap" rel="stylesheet">
  </head>
  <body>
    <header>
      <section>
        <article class="textual">
          <h1>I Endorse Ed Markey</h1>
          <p>Create your own endorsement graphic for Senator Ed Markey to share over Instagram, Twitter, Facebook, emails, and so forth!</p>
        </article>
      </section>
    </header><!--[if lt IE 9]>
    <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please
      <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
    </p><![endif]-->
    <main class="requires-js">
      <section>
        <article class="textual">
          <div class="group">
            <div class="ksbox half"><?php if ($browser == 'firefox') { ?>
              <p>Terribly sorry, but this doesn't work very well on the Firefox browser. Please try using another browser.</p><?php } else { ?>
              <form>
                <div>
                  <label>Name
                    <input id="name-input" type="text" maxlength="30" value="<?php echo htmlspecialchars(housekeeping::get('name')); ?>">
                  </label>
                </div>
                <div>
                  <label>
                    <input id="plural" type="checkbox" <?php housekeeping::checkedIf(housekeeping::isGet('plural')); ?>>Plural names</label>
                </div>
                <div>
                  <label>Why you endorse Senator Markey (1 short paragraph)
                    <textarea id="quotation" rows="6"><?php echo htmlspecialchars(housekeeping::get('quotation')); ?></textarea>
                  </label>
                </div>
                <div>
                  <label><img id="avatarImage" style="display:none">Photo of you
                    <input id="uploadAvatar" type="file" value="upload image" onchange="readURL(this);">
                  </label>
                </div>
                <div>
                  <input id="generate" type="submit" value="Generate image">
                </div>
              </form><?php } ?>
            </div>
            <div class="ksbox half" id="canvasContainer">
              <canvas id="canvas" width="1600" height="1600" style="max-width:100%; display:none"></canvas><img id="canvasImg" src="img/example.png">
              <div id="saveContainer" style="display:none">
                <p>
                  Image has been generated! Feel free to adjust it to your liking.
                  
                </p>
                <p style="font-size:80%"><b>Known issues:</b> If the fonts aren't quite right, try re-generating your image. And certain photos may be rotated incorrectly depending on the orientation of your phone's camera. If you are on an <b>iPhone</b> <a href="https://www.businessinsider.com/where-do-downloads-go-on-iphone">read this</a> to access your image. For now, do not use <b>Firefox</b> browser.</p>
                <p><a class="button" id="download" href="#">Download Image</a></p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
    <footer>
      <p>
        Copyright © 2020 <a href="https://twitter.com/danwood">Dan Wood</a>. This site is not affiliated with the Ed Markey 2020 campaign or any other campaign or candidate.   For personal use only. Do not use to mislead people; use your own image only. No information collected in the use of this website will be shared with any party.
        
        
        
      </p>
    </footer>
  </body>
  <div class="js-warning">This page requires JavaScript! </div>
  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <script>window.jQuery || document.write('<script src="js/vendor/jquery-3.4.1.min.js"><\\/script>')</script>
  <script src="js/plugins.js"></script>
  <script src="js/main.js"></script>
  <script>
    document.documentElement.className = document.documentElement.className.replace("no-js","js");
    
  </script>
  <script>
    $("a#download").on('click', function() {
    	$(this).attr('download', 'I_Endorse_Ed_Markey.png');
    	$(this).attr('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    });
    
    $("#generate").on('click', function() {
    
    	// Set globals
    
    	name = $('#name-input').val().trim();
    	quotation = $('#quotation').val().trim();
    	
    	plural = $('#plural').is(':checked');
    
    	avatarImageSrc = $("#avatarImage").attr('src');
    
    	if (name.length < 4 || quotation.length < 30) {
    		alert("Please fill in all of the blanks with enough information!");
    	}
    	else if (avatarImageSrc === undefined) {
    		alert("You need to upload your image!");
    	}
    	else {
    		startGeneratingImage();
    	}
    
    	return false;
    });
    
  </script>
  <script>
    function readURL(input) 
    {
    	$("#avatarImage").css("display", "block");
    
    	if (input.files && input.files[0]) {
    		var reader = new FileReader();
    
    		reader.onload = function (e) {
    			$("#avatarImage").attr('src', e.target.result);
    		}
    
    		reader.readAsDataURL(input.files[0]);
    	}
    }
  </script>
</html>