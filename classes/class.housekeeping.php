<?php

error_reporting(E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED));

// contains tools used for cleaning up, validation, etc.
// an attempt to organize functions and avoiding "re-declaring" same functions on
// the same flow. It also could help lessen the overhead bandwith brought about by the
// previously mentioned re-declaration. Consequently, it would make php scripts cleaner
// and organized
class housekeeping {

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



	public static function checkedIf($flag)	// output checked="checked" if the given flag is true.
	{
		if ($flag) echo 'checked="checked"';
	}

	public static function selectedIf($flag)	// output checked="checked" if the given flag is true.
	{
		if ($flag) echo 'selected="selected"';
	}

 




}
?>
