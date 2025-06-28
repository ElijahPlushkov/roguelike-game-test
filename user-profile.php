<?php

session_start();

echo '<pre>';
print_r($_POST);
echo '</pre>';

include "Dbh.php";
include "user-profile.model.php";
include "user-profile.controller.php";

$id = $_SESSION["id"] ?? null;
$username = $_SESSION["username"] ?? null;

$profileInfo = new ProfileController($id, $username);

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["user-profile"])) {
    $profileData = $profileInfo->getCurrentProfile($id);
    $about = $profileInfo->displayAbout($id);

    include "user-profile.view.php";
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["save-changes"])) {
    $about = htmlspecialchars($_POST["about"] ?? '');
    $profileInfo->updateProfileInfo($id, $about);

    require "user-profile.view.php";
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["edit-profile"])) {
    $about = htmlspecialchars($_POST["about"] ?? '');
    $about = $profileInfo->displayAbout($id);

    require "profile-settings.view.php";
}

$profileData = $profileInfo->getCurrentProfile($id);
$about = $profileInfo->displayAbout($id);

echo '<pre>';
print_r($profileData);
echo '</pre>';
