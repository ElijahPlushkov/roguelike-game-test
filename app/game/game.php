<?php

require_once __DIR__ . "/../views/header.php";
require "map-generator.model.php";
require "tiles.model.php";
require "map-generator.controller.php";

echo "here will be the main game screen";

$map = new createGameMap();
$map->createEarthTiles(20);

?>

<section class="map-display">
    <?php
    echo $map->getOutput();
    ?>
</section>

