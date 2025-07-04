<?php

define("BASE_PATH", "/roguelike-game");

error_reporting(E_ALL);
ini_set('display_errors', 1);
file_put_contents('debug.log', "INDEX.PHP was called\n", FILE_APPEND);

require '../core/router.model.php';
require '../core/router.controller.php';

$router = new RouterController();

$router->add("GET", "/main-menu", [RouterController::class, "mainMenu"]);

$router->add("GET", "/", [RouterController::class, "mainMenu"]);

$router->add("POST", "/game", [RouterController::class, "game"]);

$router->add("POST", "/login", [RouterController::class, "login"]);

$router->add("POST", "/register", [RouterController::class, "register"]);

$router->add("POST", "/logout", [RouterController::class, "logout"]);

$router->add("POST", "/user-profile", [RouterController::class, "userProfile"]);

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