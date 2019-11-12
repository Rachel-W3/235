<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Broken</title>
</head>
<body>
<h1>About you!</h1>
<?php
	$data = file_get_contents("http://www.cia.gov"); // or any other URL you want to use
	echo "<h1>Here's your data!!</h1>";
	echo $data;
 ?>
</body>
</html>