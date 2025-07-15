<?php

header('Content-Type: application/json');

$level = [

    "tilemap" => [
        ['.', '.', '.'],
        ['.', 'T', '.'],
        ['.', '.', '.'],
        ['#', '.', '#'],
        ['#', 'N', '#'],
        ['#', '#', '#'],
    ],
    "tileset" => [
        '#' => ['type' => 'wall', 'walkable' => false, 'char' => '#'],
        '.' => ['type' => 'grass', 'walkable' => true, 'char' => '.'],
        'T' => ['type' => 'tree', 'walkable' => false, 'char' => 'T'],
        'N' => ['type' => 'npc', 'walkable' => true, 'char' => 'N']
    ],
    "player" => ["x" => 0, "y" => 0]

];

echo json_encode($level);
