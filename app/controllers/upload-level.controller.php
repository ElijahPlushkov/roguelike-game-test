<?php
session_start();
require __DIR__ . "/../models/upload-level.model.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $slug = $_POST["slug"];
    $name = $_POST["name"];
    $levelData = $_POST["level-data"];

    $levelController = new LevelController();
    $levelController->uploadLevel($slug, $name, $levelData);
}