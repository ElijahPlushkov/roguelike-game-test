<?php

interface displayTiles {
    public function display(): string;
}

class EmptyTile implements displayTiles {
    public function display(): string {
        return ".";
    }
}

class EarthTile implements displayTiles {
    public function display(): string {
        return "#";
    }
}