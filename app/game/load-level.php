<?php
header('Content-Type: application/json');

require __DIR__ . "/../models/upload-level.model.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $slug = "spider-nest";

    if (!$slug) {
        http_response_code(400);
        echo json_encode(["error" => "Missing slug"]);
        exit;
    }

    $levelController = new LevelController();
    $levelData = $levelController->loadLevel($slug);

    if ($levelData) {
        echo json_encode($levelData, true);
    }
}