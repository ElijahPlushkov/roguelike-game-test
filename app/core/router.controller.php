<?php

class RouterController extends Router{
    public function mainMenu() {
        require __DIR__ . "/../views/game/main-menu.php";
    }

    public function userProfile() {
        require __DIR__ . "/../views/auth/user-profile.php";
    }

    public function login() {
        require __DIR__ . "/../views/auth/login.php";
    }

    public function register() {
        require __DIR__ . "/../views/auth/register.php";
    }

    public function logout() {
        require __DIR__ . "/../views/auth/logout.php";
    }
}