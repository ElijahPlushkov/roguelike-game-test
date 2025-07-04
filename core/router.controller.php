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
}