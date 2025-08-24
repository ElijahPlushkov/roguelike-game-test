<?php

require_once __DIR__ . "/../../core/Dbh.php";

class LevelController extends Dbh {
    private $db;

    public function __construct() {
        $this->db = $this->connect();
    }

    public function uploadLevel($slug, $name, $levelData) {

        if (!$levelData || !isset($slug) || !isset($name)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid level data']);
            return;
        }

        $stmt = $this->db->prepare("INSERT INTO levels (name, slug, level_data) VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE name = VALUES(name), level_data = VALUES(level_data)");

        $stmt->execute([$name,
                        $slug,
                        json_encode($levelData)
        ]);

        echo json_encode(['success' => true, 'message' => 'Level uploaded successfully']);
    }

    public function loadLevel($slug) {
        $stmt = $this->db->prepare("SELECT level_data FROM levels WHERE slug= ?");
        $stmt->execute([$slug]);
        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        $levelData = $result["level_data"];

        echo json_decode($levelData, true);
    }
}