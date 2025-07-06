<?php

class Map {
    protected string $name;
    protected int $width;
    protected int $height;
    protected array $generatedMap;

    public function __construct (int $width = 20, int $height = 20, string $name = null) {
        $this->name = $name ?? "Dungeon";
        $this->width = $width;
        $this->height = $height;
        $this->generateMap();
    }

    protected function generateMap(): void {
        for ($x = 0; $x < $this->width; $x++) {
            for ($y = 0; $y < $this->height; $y++) {
                $this->generatedMap[$x][$y] = new EmptyTile();
            }
        }
    }

    protected function addTile($tile, int $width, int $height) {
        $this->generatedMap[$width][$height] = $tile;
    }

    public function getTile(int $width, int $height) {
        return $this->generatedMap[$width][$height];
    }

    public function getGeneratedMap(): array {
        return $this->generatedMap;
    }
}
