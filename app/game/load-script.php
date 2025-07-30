<?php
header('Content-Type: application/json');

require __DIR__ . "/../models/script-loader.model.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $slug = $_GET["slug"] ?? null;

    if (!$slug) {
        http_response_code(400);
        echo json_encode(["error" => "Missing slug"]);
        exit;
    }

    $scriptLoader = new ScriptLoader();
    $scriptData = $scriptLoader->loadScript($slug);

    if ($scriptData) {
        echo json_encode($scriptData, true);
    }
}