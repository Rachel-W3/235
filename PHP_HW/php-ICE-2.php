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
        $colors = ["red", "green", "blue"];
        echo '<ol>';
        for($i = 0; $i < count($colors); $i++) {
            echo "<li> $colors[$i] </li>";
        }
        echo '</ol>';
    ?>
</body>
</html>