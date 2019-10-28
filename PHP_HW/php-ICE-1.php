<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<?PHP
  $phpIsWeird = TRUE;
  if ($phpIsWeird){
  	echo("<p>PHP is REALLY weird!</p>");
	}else{
   	echo("<p>PHP is NOT weird!</p>");
  }
  
  $ritIsWeird = 0; // 0 and 0.0 are false, all other numbers coerce to TRUE
  if ($ritIsWeird){
  	echo("<p>RIT is REALLY weird!</p>");
	}else{
   	echo("<p>RIT is NOT weird!</p>");
  }
  
  $rochesterIsWeird = ""; // empty strings "" and '' are FALSE
  if ($rochesterIsWeird){
  	echo("<p>Rochester is REALLY weird!</p>");
	}else{
   	echo("<p>Rochester is NOT weird!</p>");
  }
  
  $gccisIsWeird = []; // empty array is FALSE
  if ($gccisIsWeird){
  	echo("<p>GCCIS is REALLY weird!</p>");
	}else{
   	echo("<p>GCCIS is NOT weird!</p>");
  }
  
  $thisDemoIsDone = "XYZPDQ"; // most everything else is TRUE
  if ($thisDemoIsDone){
  	echo("<p>This demo is DONE!</p>");
	}else{
   	echo("<p>This demo is NOT DONE!</p>");
  }
?>
</body>
</html>