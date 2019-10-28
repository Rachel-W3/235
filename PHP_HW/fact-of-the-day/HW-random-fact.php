<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<link rel='stylesheet' type='text/css' href='style.css' />
	<title>Random Facts</title>
</head>
<body>
<h1>Random Fact</h1>
<?php
	// Taken from uselessfacts.net
	$facts = ["Dueling is legal in Paraguay as long as both parties are registered blood donors.",
			  "A strand from the web of the golden spider is as strong as a steel wire of the same size.",
			  "Chuck Norris doesn’t read books. He stares them down until he gets the information he wants.",
			  "The sound of E.T. walking was made by someone squishing her hands in jelly",
			  "Because metal was scarce, the Oscars given out during World War II were made of wood.",
			  "Chewing gum while peeling onions will keep you from crying.",
			  "A group of finches is called a Charm."];
	
	$selected_fact = $facts[rand(0, count($facts) - 1)];

	echo "<p>" . $selected_fact . "</p>";

 ?>

<form action="HW-random-fact.php" method="post">
	<input type="submit" value="Get another fact!">
</form>

</body>
</html>