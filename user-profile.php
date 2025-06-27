<?php

session_start();

include "Dbh.php";
include "user-profile.model.php";
include "user-profile.controller.php";

$id = $_SESSION["id"] ?? null;
$username = $_SESSION["username"] ?? null;

$profileInfo = new ProfileController($id, $username);

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["edit-profile"])) {
    $about = htmlspecialchars($_POST["about"] ?? '');
    $profileInfo->updateProfileInfo($id, $about);

    header("location: user-profile.view.php");
    exit();
}

$profileData = $profileInfo->getCurrentProfile($id);
$about = $profileInfo->displayAbout($id);

echo '<pre>';
print_r($profileData);
echo '</pre>';

include "user-profile.view.php";