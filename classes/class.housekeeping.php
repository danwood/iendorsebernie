<?php

error_reporting(E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED));

// contains tools used for cleaning up, validation, etc.
// an attempt to organize functions and avoiding "re-declaring" same functions on
// the same flow. It also could help lessen the overhead bandwith brought about by the
// previously mentioned re-declaration. Consequently, it would make php scripts cleaner
// and organized
class housekeeping {


	public static function makeMultiParagraphs($text)			// HTML escape and such, surround in paragraphs, add br's
	{
		$text = htmlspecialchars($text);
		$text = preg_replace("/\r*\n\r*\n+/", "</p><p>", $text);	// double-newlines into paragraph separators
		$text = preg_replace("/\r*\n/", "<br />", $text);		// single-newlines into explicit breaks
		// surround with outer paragraph
		$text = "<p>" . $text . "</p>";
		return $text;
	}

	public static function startsWith($Haystack, $Needle)
	{
		// Recommended version, using strpos
    	return strpos($Haystack, $Needle) === 0;
	}

	public static function stripURLQuery($url)
	{
		$result = $url;
		$whereQ = strpos($url, "?");
		if (false !== $whereQ)
		{
			$result = substr($url, 0, $whereQ);
		}
		return $result;
	}

	public static function resultURL($newURL = NULL, $tryReferer = FALSE)
	{
		if ($tryReferer && isset($_SERVER["HTTP_REFERER"]))
		{
			$redirectSite = $_SERVER["HTTP_REFERER"];
			$redirectSite = housekeeping::stripURLQuery($redirectSite);
		}
		else
		{
			$redirectSite = $newURL ? $newURL : '/result.html';
		}
		return $redirectSite;
	}

	public static function buildURL($url, $dict)	// add the associative array to the existing URL
	{
		$hasQuery = (false !== strpos($url, "?"));
		$separator = $hasQuery ? '&' : '?';
		$result = $url . $separator;		// start with the first separator
		foreach ($dict as $key => $value)
		{
			if (!empty($value))	// don't bother with empty values
			{
				$result .= urlencode($key) . '=' . urlencode($value) . '&';
			}
		}
		$result = substr($result, 0, -1);	// take off the last seprator we added
		return $result;
	}

	public static function buildErrorURL($url, $err, $details = '', $title = '')
	{
		return housekeeping::buildURL($url, array('err' => $err, 'details' => $details, 'title' => $title));
	}

	public static function buildMessageURL($url, $msg, $details = '', $title = '')
	{
		return housekeeping::buildURL($url, array('msg' => $msg, 'details' => $details, 'title' => $title));
	}


	public static function redirectToURL($url)
	{
		header("Location: $url");
	}

	public static function trimFirst($string)	// gets the first line of a multi-line input and trims it. Really cleans the input!
	{
		$lines = explode("\n",$string);
		$string = $lines[0];
		$string = trim($string);
		return $string;
	}

	public static function testStringAsBoolean($string)
	{
		$result = TRUE;
   		$string = strtolower($string);
		if (empty($string)
			|| $string == 'no'
			|| $string == '0'
	   		|| $string == 'false'
			|| $string == 'f'
			|| $string == 'n'
		    )
		{
			$result = FALSE;
		}
		return $result;
	}

	// GET FUNCTIONS.  Use getraw for a textarea.
	public static function getraw($key, $default='')
	{
   		return isset ( $_GET[$key] ) ? $_GET[$key] : $default;
	}
	public static function get($key, $default='')
	{
   		return isset ( $_GET[$key] ) ? housekeeping::trimFirst($_GET[$key]) : $default;
	}
	public static function isGet($key)
	{
   		return isset ( $_GET[$key] ) ? housekeeping::testStringAsBoolean($_GET[$key]) : FALSE;
   	}

	// POST FUNCTIONS.  Use postraw for a textarea.
	public static function postraw($key, $default='')
	{
   		return isset ( $_POST[$key] ) ? $_POST[$key] : $default;
	}
	public static function post($key, $default='')
	{
   		return isset ( $_POST[$key] ) ? housekeeping::trimFirst($_POST[$key]) : $default;
	}
	public static function isPost($key)
	{
   		return isset ( $_POST[$key] ) ? housekeeping::testStringAsBoolean($_POST[$key]) : FALSE;
   	}

	// REQUEST FUNCTIONS - get or post.  Use requestraw for a textarea.
	public static function requestraw($key, $default='')
	{
   		return isset ( $_REQUEST[$key] ) ? $_REQUEST[$key] : $default;
	}
	public static function request($key, $default='')
	{
   		return isset ( $_REQUEST[$key] ) ? housekeeping::trimFirst($_REQUEST[$key]) : $default;
	}
	public static function isRequest($key)
	{
   		return isset ( $_REQUEST[$key] ) ? housekeeping::testStringAsBoolean($_REQUEST[$key]) : FALSE;
   	}

	// SESSION FUNCTIONS.  Use sessionraw for a textarea.
	public static function sessionraw($key, $default='')
	{
   		return isset ( $_SESSION[$key] ) ? $_SESSION[$key] : $default;
	}
	public static function session($key, $default='')
	{
   		return isset ( $_SESSION[$key] ) ? housekeeping::trimFirst($_SESSION[$key]) : $default;
	}
	public static function isSession($key, $default=FALSE)
	{
   		return isset ( $_SESSION[$key] ) ? housekeeping::testStringAsBoolean($_SESSION[$key]) : $default;
   	}


	public static function lastPathComponent($path)
	{
		$pos = strrpos($path, '/');
		if (FALSE !== $pos)
		{
			$name = substr($path, $pos+1);
			return $name;
		}
		else
		{
			return FALSE;
		}
	}

	public static function passThruAttachment($path, $name='')
	{
		if (empty($name))
		{
			$name = housekeeping::lastPathComponent($path);
		}

		$fp = fopen($path, 'rb');

		// send the right headers
		header("Content-Type: application/zip");
		header("Content-Length: " . filesize($path));
		header('Content-Disposition: attachment; filename="' . $name . '"');
		header("Content-Description: File Transfer");
		header("Cache-Control: public");
		header("Content-Transfer-Encoding: binary");

		// dump the picture and stop the script
		fpassthru($fp);
	}

	public static function condense($str)		// multiple white
	{
		$str = preg_replace('/\s\s*/', ' ', $str);
		$str = trim($str);
		return $str;
	}

	public static function fixNameCapitalization($str)
	{
		$str = self::condense($str);
		if (preg_match('/^[a-z \.\']+$/iD', $str))	// only muck with it if we are fully ASCII.  Allow . and '
		{
			if (	(preg_match('/[a-z]/', $str) && !preg_match('/[A-Z]/', $str) )	// lower but not upper,
				||	(!preg_match('/[a-z]/', $str) && preg_match('/[A-Z]/', $str) )	// OR upper but not lower?
				)
			{
				$str = ucwords(strtolower($str));

				// Some special additional capitalization: from http://us3.php.net/ucwords
				$str = preg_replace('/(?:^|\\b)(O\'|Ma?c|Fitz)([^\W\d_])/xe', "'\$1' . strtoupper('\$2')", $str);
			}
		}

		return $str;
	}



	public static function getLang()
	{
		// gets from lang GET/POST parameter, or from server headers. Normalizes to lower case and underscore like zh_cn


		$lang = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'en';		// defalt to en

 		// split complex patterns like from FIREFOX:  en_us,en;q=0.5,
       	$lang = explode(";", $lang);
	    $lang = explode(",", $lang[0]);
	    $lang = $lang[0];

		$lang = housekeeping::post('lang', $lang);
		$lang = housekeeping::get('lang', $lang);
		$lang = strtolower(str_replace('-','_',$lang));		// convert zh-cn to zh_cn, and zh_CN to zh_cn
		return $lang;
		// probably you will want to also set $la = substr($lang,0,2);
	}

	public static function getLangs()		// Like above, but returns an ordered array for us to scan through until we find a match
	{
		// gets from lang GET/POST parameter, or from server headers. Normalizes to lower case and underscore like zh_cn


		$langString = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'en';		// defalt to en

		$result = array();
 		// split complex patterns like from FIREFOX:  en_us,en;q=0.5,
       	$semicolonPieces = explode(";", $langString);
       	foreach ($semicolonPieces as $semicolonPiece)
       	{
		$semicolonPiece = trim($semicolonPiece);
      		$commaPieces = explode(',', trim($semicolonPiece));
       		foreach ($commaPieces as $commaPiece)
       		{
       			$commaPiece = trim($commaPiece);
       			if (substr($commaPiece, 0, 2) !== 'q=')
       			{
       				$result[] = $commaPiece;
       			}
       		}
       	}

		$declaredLang = housekeeping::post('lang', '');
		$declaredLang = housekeeping::get('lang', $declaredLang);
		$declaredLang = strtolower(str_replace('-','_',$declaredLang));		// convert zh-cn to zh_cn, and zh_CN to zh_cn
		if (!empty($declaredLang))
		{
			array_unshift($result, $declaredLang);
		}
		// error_log("langString = $langString --> " . implode('+', $result));
		return $result;
	}

	// Clean up and escape input for passing to shell
	public static function cleanShell($input, $maxlength)
	{
		$input = substr($input, 0, $maxlength);
		$input = EscapeShellCmd($input);
		return ($input);
	}

	public static function commandLineQuote($str)
	{
		// Escape apostrophes by un-quoting, adding apos, then re-quoting
		// so this turns ' into '\'' ... we have to double-slash for this php.
		return "'" . str_replace("'", "'\\''", $str) . "'";
	}

	public static function jsSingleQuoteEscape($str)
	{
		// We have to double-slash for this php.
		return str_replace("'", "\\'", $str);
	}

	public static function fetch($keyArray, $key) {	// returns item if it exists, or NULL
		$result = NULL;
		if ($keyArray && array_key_exists($key, $keyArray))
		{
			$result = $keyArray[$key];
		}
		return $result;
	}

	public static function isfetch($keyArray, $key) {	// returns as a boolean if it exists, or NULL
		$result = NULL;
		if ($keyArray && array_key_exists($key, $keyArray))
		{
			$result = housekeeping::testStringAsBoolean($keyArray[$key]);
		}
		return $result;
	}






	public static function location($url, $ixXHR = FALSE)
	{
		global $isXHR;
		if ($isXHR)
		{
			echo "<script type='text/javascript'>window.location.assign('" . htmlspecialchars($url) . "');</script>";
		}
		else
		{
			header("Location: " . $url);
		}
	}


	public static function filename_extension($filename)
	{
		$pos = strrpos($filename, '.');
		if($pos===false) {
			return false;
		} else {
			return substr($filename, $pos+1);
		}
	}

	public static function checkedIf($flag)	// output checked="checked" if the given flag is true.
	{
		if ($flag) echo 'checked="checked"';
	}

	public static function selectedIf($flag)	// output checked="checked" if the given flag is true.
	{
		if ($flag) echo 'selected="selected"';
	}

 

	public static function relative_date($time) {
		$today = time();

		$reldays = ($time - $today)/86400;
		if ($reldays >= -1 && $reldays < 1) {
			return 'today';
		} else if ($reldays >= 1 && $reldays < 2) {
			return 'tomorrow';
		} else if ($reldays >= -2 && $reldays < -1) {
			return 'yesterday';
		}
		if (abs($reldays) < 7) {
			if ($reldays > 0) {
				$reldays = floor($reldays);
				return 'in ' . $reldays . ' day' . ($reldays != 1 ? 's' : '');
			} else {
				$reldays = abs(floor($reldays));
				return $reldays . ' day'  . ($reldays != 1 ? 's' : '') . ' ago';
			}
		}
		if (abs($reldays) < 45 && (date('Y', $today) == date('Y', $time) ) ) {
			return date('l, j F',$time ? $time : time());
		}
		else if (abs($reldays) < 182 && (date('Y', $today) == date('Y', $time) ) ) {
			return date('j F',$time ? $time : time());
		} else {
			return date('j F Y',$time ? $time : time());
		}
	}





}
?>
