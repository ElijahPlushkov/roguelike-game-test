<?php

session_start();

include __DIR__ . "/../../core/Dbh.php";
include __DIR__ . "/../models/user-profile.model.php";
include __DIR__ . "/../controllers/user-profile.controller.php";

$id = $_SESSION["id"] ?? null;
$username = $_SESSION["username"] ?? null;

$profileInfo = new ProfileController($id, $username);

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["user-profile"])) {
    $profileData = $profileInfo->getCurrentProfile($id);
    $about = $profileInfo->displayAbout($id);

    include __DIR__ . "/../views/user-profile.view.php";
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["save-changes"])) {
    $about = htmlspecialchars($_POST["about"] ?? '');
    $profileInfo->updateProfileInfo($id, $about);

    require __DIR__ . "/../views/user-profile.view.php";
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["edit-profile"])) {
    $about = htmlspecialchars($_POST["about"] ?? '');
    $about = $profileInfo->displayAbout($id);

    require __DIR__ . "/../views/profile-settings.view.php";
}

$profileData = $profileInfo->getCurrentProfile($id);
$about = $profileInfo->displayAbout($id);

