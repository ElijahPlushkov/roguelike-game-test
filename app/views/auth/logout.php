<?php

session_start();
session_unset();
session_destroy();

header("location: /roguelike-game/app/views/game/main-menu.php");
exit();