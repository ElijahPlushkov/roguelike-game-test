<?php

session_start();

include __DIR__ . "/../../core/Dbh.php";
include __DIR__ . "/../models/user-profile.model.php";
include __DIR__ . "/../controllers/user-profile.controller.php";

$id = $_SESSION["id"] ?? null;
$username = $_SESSION["username"] ?? null;

if ($id !== null) {
    $profileInfo = new ProfileController($id, $username);
    $profileInfo->getCurrentProfile($id);

    $about = $profileInfo->displayAbout($id);
}


require_once __DIR__ . "/../views/header.php";
include __DIR__ . "/../views/main-menu.view.php";