<?php

class createGameMap extends Map {

    public function getOutput() {
        $output = "";
        for ($y = 0; $y < $this->height; $y++) {
            $output .= '<div>';
            for ($x = 0; $x < $this->width; $x++) {
                $output .= $this->getTile($x, $y)->display();
            }
            $output .= '</div>';
        }
        return $output;
    }

    public function createEarthTiles(int $quantity): void {
        for ($i = 0; $i < $quantity; $i++) {
            $x = rand(0, $this->width - 1);
            $y = rand(0, $this->height - 1);
            $this->addTile(new EarthTile(), $x, $y);
        }
    }
}