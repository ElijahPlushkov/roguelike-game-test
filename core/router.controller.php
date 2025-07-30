<?php

class RouterController extends Router{
    public function mainMenu() {
        require __DIR__ . "/../app/game/main-menu.php";
    }

    public function userProfile() {
        require __DIR__ . "/../app/auth/user-profile.php";
    }

    public function login() {
        require __DIR__ . "/../app/auth/login.php";
    }

    public function register() {
        require __DIR__ . "/../app/auth/register.php";
    }

    public function logout() {
        require __DIR__ . "/../app/auth/logout.php";
    }

    public function game() {
        require __DIR__ . "/../app/game/game.php";
    }

    public function loadLevel() {
        require __DIR__ . "/../app/game/load-level.php";
    }

    public function uploadLevelController() {
        require __DIR__ . "/../app/controllers/upload-level.controller.php";
    }

    public function uploadLevel() {
        require __DIR__ . "/../app/views/upload-level.view.php";
    }

    public function loadScript() {
        require __DIR__ . "/../app/game/load-script.php";
    }

    public function scriptLoaderController() {
        require __DIR__ . "/../app/controllers/script-loader.controller.php";
    }

    public function uploadScript() {
        require __DIR__ . "/../app/views/upload-script.view.php";
    }
}