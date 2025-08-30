<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
file_put_contents('debug.log', "INDEX.PHP was called\n", FILE_APPEND);

require '../core/router.model.php';
require '../core/router.controller.php';

$router = new RouterController();

//game
$router->add("GET", "/main-menu", [RouterController::class, "mainMenu"]);

$router->add("POST", "/main-menu", [RouterController::class, "mainMenu"]);

$router->add("GET", "/", [RouterController::class, "mainMenu"]);

$router->add("POST", "/game", [RouterController::class, "game"]);

$router->add("GET", "/game", [RouterController::class, "game"]);

//user profile
$router->add("POST", "/login", [RouterController::class, "login"]);

$router->add("POST", "/register", [RouterController::class, "register"]);

$router->add("POST", "/logout", [RouterController::class, "logout"]);

$router->add("POST", "/user-profile", [RouterController::class, "userProfile"]);

//level loader
$router->add("GET", "/load-level", [RouterController::class, "loadLevel"]);

$router->add("POST", "/upload-level", [RouterController::class, "uploadLevel"]);

$router->add("GET", "/upload-level", [RouterController::class, "uploadLevel"]);

$router->add("POST", "/upload-level.controller", [RouterController::class, "uploadLevelController"]);

//script loader
$router->add("GET", "/load-script", [RouterController::class, "loadScript"]);

$router->add("POST", "/upload-script", [RouterController::class, "uploadScript"]);

$router->add("GET", "/upload-script", [RouterController::class, "uploadScript"]);

$router->add("POST", "/script-loader.controller", [RouterController::class, "scriptLoaderController"]);

//death screen
$router->add("POST", "/death-screen", [RouterController::class, "deathScreen"]);
$router->add("GET", "/death-screen", [RouterController::class, "deathScreen"]);

//initialization
$basePath = '/roguelike-game';

$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if (str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}

if (empty($path)) {
    $path = '/';
}

file_put_contents('debug.log', "Dispatching path: $path\n", FILE_APPEND);

$router->dispatch($path);