<?php

require_once __DIR__ . "/../../core/Dbh.php";

class ScriptLoader extends Dbh {
    private $db;

    public function __construct() {
        $this->db = $this->connect();
    }

    public function uploadScript($slug, $type, $scriptData) {

        if (!$slug || !isset($type) || !isset($scriptData)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid script data']);
            return;
        }

        $stmt = $this->db->prepare("INSERT INTO scripts (slug, type, script_data) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE slug = VALUES(slug), script_data = VALUES(script_data)");

        $stmt->execute([$slug,
            $type,
            json_encode($scriptData)
        ]);

        echo json_encode(['success' => true, 'message' => 'script uploaded successfully']);
    }

    public function loadScript($slug) {
        $stmt = $this->db->prepare("SELECT script_data FROM scripts WHERE slug= ?");
        $stmt->execute([$slug]);
        $result =  $stmt->fetch(PDO::FETCH_ASSOC);

        $scriptData = $result["script_data"];

        echo json_decode($scriptData, true);
    }
}