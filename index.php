<?php
	require_once '__system__/api/config.php';
	
	$REQUEST_URI = $_SERVER["REQUEST_URI"];
	
	$INITE = strpos($REQUEST_URI, '?');
	if ($INITE):
		$REQUEST_URI = substr($REQUEST_URI, 0, $INITE);
	endif;
	
	$REQUEST_URI_PASTA = substr($REQUEST_URI, 1);
	
	$URL = explode('/', $REQUEST_URI_PASTA);
	$URL[1] = ($URL[1] != '' ? $URL[1] : 'home');
		
	if (file_exists('__system__/' . $URL[1] . '.php')):
		if (isset($URL[2])):
			require '__system__/404.php';
		else:
			require '__system__/' . $URL[1] . '.php';
		endif;
	elseif (is_dir('__system__/' . $URL[1])):
		if (isset($URL[2]) && file_exists('__system__/' . $URL[1] . '/' . $URL[2] . '.php')):
			if (isset($URL[3])):
				require '__system__/404.php';
			else:
				require '__system__/' . $URL[1] . '/' . $URL[2] . '.php';
			endif;
		else:
			require '__system__/404.php';
		endif;
	else:
		require '__system__/404.php';
	endif;
